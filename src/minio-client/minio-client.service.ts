import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { BufferedFile } from '../minio-client/file.model.js';
import * as crypto from 'crypto'
import { ConfigService } from '@nestjs/config';

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
    ) {
        this.logger = new Logger('MinioStorageService');
    }

    public async upload(file: BufferedFile, baseBucket: string = this.baseBucket) {
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

        const size = fileBuffer.length;  // Get file size from buffer

        this.client.putObject(baseBucket, fileName, fileBuffer, size, metaData, function (err, res) {
            if (err) throw new HttpException('Error uploading file', HttpStatus.BAD_REQUEST)
        });

        return {
            url: `${this.configService.get<string>('MINIO_ENDPOINT') ?? "localhost"}:9001/${this.configService.get<string>('MINIO_BUCKET')}/${filename}`
        }
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