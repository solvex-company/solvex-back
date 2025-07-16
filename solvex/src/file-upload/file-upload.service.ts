import { Injectable } from '@nestjs/common';

@Injectable()
export class FileUploadService {
  uploadImage(ticketId: string) {
    return 'This action adds a new fileUpload' + ticketId;
  }
}
