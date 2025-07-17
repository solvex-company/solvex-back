import { Injectable, Inject } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class FileUploadService {
  constructor(
    @Inject('CLOUDINARY')
    private readonly cloudinaryInstance: typeof cloudinary,
  ) {}

  async uploadImages(files: Express.Multer.File[]): Promise<string[]> {
    const uploadResults = await Promise.all(
      files.map((file) => this.uploadImage(file).catch(() => 'no image')),
    );

    // Rellenar con 'no image' si hay menos de 3
    while (uploadResults.length < 3) uploadResults.push('no image');
    return uploadResults.slice(0, 3);
  }

  private async uploadImage(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = this.cloudinaryInstance.uploader.upload_stream(
        {
          folder: 'tickets',
          resource_type: 'auto',
          transformation: [
            { width: 1000, height: 1000, crop: 'limit' },
            { quality: 'auto:best' },
          ],
          allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        },
        (error, result) => {
          if (error)
            return reject(
              new Error(
                typeof error === 'string'
                  ? error
                  : error?.message || 'Unknown error',
              ),
            );
          if (result && result.secure_url) {
            resolve(result.secure_url);
          } else {
            reject(new Error('No secure_url returned from Cloudinary'));
          }
        },
      );
      uploadStream.end(file.buffer);
    });
  }
}
