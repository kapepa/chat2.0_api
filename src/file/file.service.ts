import { Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { Observable, of, switchMap } from 'rxjs';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class FileService {
  create(createFileDto: CreateFileDto) {
    return 'This action adds a new file';
  }

  findAll() {
    return `This action returns all file`;
  }

  findOne(id: number) {
    return `This action returns a #${id} file`;
  }

  update(id: number, updateFileDto: UpdateFileDto) {
    return `This action updates a #${id} file`;
  }

  remove(filename: string): Observable<boolean> {
    return of(filename).pipe(
      switchMap(async (filename) => {
        const fullpath = join(__dirname, '..', '..', 'static', filename);
        if (!fs.existsSync(fullpath)) return false;

        fs.unlinkSync(fullpath);
        return true;
      })
    );
  }
}
