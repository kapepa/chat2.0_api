import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';

@Module({
  exports: [
    FileService
  ],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
