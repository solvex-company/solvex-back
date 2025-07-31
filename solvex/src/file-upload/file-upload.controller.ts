/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  MaxFileSizeValidator,
  ParseFilePipe,
  FileTypeValidator,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file-upload.service';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('file-upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files', 3))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Subir 3 archivos como un array en el campo "files"',
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
      required: ['files'],
    },
  })
  async uploadFiles(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
        ],
        fileIsRequired: false,
      }),
    )
    files?: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No se han subido archivos');
    }

    try {
      const uploadResults = await this.fileUploadService.uploadImages(files);
      return {
        message: 'Archivos subidos correctamente',
        urls: uploadResults,
      };
    } catch (error) {
      throw new BadRequestException(
        'Error al subir los archivos: ' + error.message,
      );
    }
  }
}
