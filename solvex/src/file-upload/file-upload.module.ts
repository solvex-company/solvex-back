import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileUploadService } from './file-upload.service';
import { FileUploadController } from './file-upload.controller';
import { Ticket } from '../tickets/entities/ticket.entity';
import { CloudinaryProvider } from 'src/config/cloudinary';

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forFeature([Ticket])],
  controllers: [FileUploadController],
  providers: [CloudinaryProvider, FileUploadService],
  exports: [FileUploadService],
})
export class FileUploadModule {}
