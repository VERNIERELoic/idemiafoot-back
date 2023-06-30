import { Module } from '@nestjs/common';
import { MinioClientService } from './minio-client.service';
import { MinioModule } from 'nestjs-minio-client';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { ConfigService } from '@nestjs/config/dist/config.service';

@Module({
  imports: [
  MinioModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => ({
      endPoint: configService.get<string>('MINIO_ENDPOINT') ?? "localhost",
      port: 9000,
      useSSL: false,
      accessKey: configService.get<string>('MINIO_ACCESSKEY'),
      secretKey: configService.get<string>('MINIO_SECRETKEY'),
    }),
  }),
],
  providers: [MinioClientService],
  exports: [MinioClientService, MinioModule]
})
export class MinioClientModule {}
