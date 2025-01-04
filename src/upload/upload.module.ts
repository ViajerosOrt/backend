import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryModule } from './cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  controllers: [UploadController],
  providers: [CloudinaryService],
  exports: [CloudinaryService]
})
export class UploadModule {}