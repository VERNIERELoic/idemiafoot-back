import { Controller, Post, UseInterceptors, UploadedFile, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'
import { FileUploadService } from './file-upload.service';
import { BufferedFile } from 'src/minio-client/file.model';

@Controller('file-upload')
export class FileUploadController {
    constructor(
        private fileUploadService: FileUploadService
    ) { }

    @Post(':userId/single')
    @UseInterceptors(FileInterceptor('image'))
    async uploadSingle(
        @Param('userId') userId: number,
        @UploadedFile() image: BufferedFile
    ) {
        return await this.fileUploadService.uploadSingle(image, userId)
    }
}
