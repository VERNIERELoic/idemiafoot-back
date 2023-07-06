import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { BufferedFile } from '../minio-client/file.model.js';
import * as crypto from 'crypto'
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';

@Injectable()
export class MinioClientService {
    private readonly logger: Logger;
    private readonly baseBucket = this.configService.get<string>('MINIO_BUCKET')

    public get client() {
        return this.minio.client;
    }

    constructor(
        private readonly minio: MinioService,
        private configService: ConfigService,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {
        this.logger = new Logger('MinioStorageService');
        this.setBucketPolicy();
    }

    public async upload(user_id: number, file: BufferedFile, baseBucket: string = this.baseBucket) {
        if (!(file.mimetype.includes('jpeg') || file.mimetype.includes('png'))) {
            throw new HttpException('Error uploading file', HttpStatus.BAD_REQUEST)
        }
        let temp_filename = Date.now().toString();
        let hashedFileName = crypto.createHash('md5').update(temp_filename).digest("hex");
        let ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
        const metaData = {
            'Content-Type': file.mimetype,
            'X-Amz-Meta-Testing': 1234,
        };
        let filename = hashedFileName + ext;
        const fileName: string = `${filename}`;
        const fileBuffer = file.buffer;

        const size = fileBuffer.length;

        await this.client.putObject(baseBucket, fileName, fileBuffer, size, metaData);

        const url = `${this.configService.get<string>('MINIO_ENDPOINT_PUBLIC') ?? "http://localhost:9000"}/${this.configService.get<string>('MINIO_BUCKET')}/${filename}`;


        const user = await this.usersRepository.findOneBy({ id: user_id });
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        user.avatar = url;
        await this.usersRepository.save(user);

        return { url };
    }

    async setBucketPolicy(baseBucket: string = this.baseBucket) {
        const policy = {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Action": [
                        "s3:ListBucket"
                    ],
                    "Effect": "Deny",
                    "Principal": {
                        "AWS": [
                            "*"
                        ]
                    },
                    "Resource": [
                        "arn:aws:s3:::avatar"
                    ]
                },
                {
                    "Action": [
                        "s3:GetObject"
                    ],
                    "Effect": "Allow",
                    "Principal": {
                        "AWS": [
                            "*"
                        ]
                    },
                    "Resource": [
                        "arn:aws:s3:::avatar/*"
                    ]
                }
            ]
        }

        await this.client.setBucketPolicy(baseBucket, JSON.stringify(policy));
    }

    async delete(objetName: string, baseBucket: string = this.baseBucket) {
        try {
            await this.client.removeObject(baseBucket, objetName);
        } catch (err) {
            throw new HttpException("Oops Something wrong happened", HttpStatus.BAD_REQUEST)
        }
    }

}
export { MinioService };
