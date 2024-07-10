import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { SharpPipe } from 'src/file/pipes/sharp/sharp.pipe';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { UserInt } from './interface/user.interface';
import { FileService } from 'src/file/file.service';
import { DeleteResult } from 'typeorm';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly fileService: FileService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('avatarUrl'))
  create(@UploadedFile(SharpPipe) avatarUrl, @Body() createUserDto: CreateUserDto): Observable<UserInt> {
    return this.userService
    .create(Object.assign(JSON.parse(JSON.stringify(createUserDto)), {avatarUrl}))
    .pipe(
      catchError((error) => {
        if (!avatarUrl) return of(error);

        return this.fileService.remove(avatarUrl)
          .pipe(
            switchMap(() => {
              return of(error.response)
            })
          )
      })
    );
  }

  @Get()
  findAll(): Observable<UserInt[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Observable<UserInt> {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('avatarUrl'))
  update(@Param('id') id: string, @UploadedFile(SharpPipe) avatarUrl, @Body() updateUserDto: UpdateUserDto) {
    return this.userService
    .update(id, Object.assign(JSON.parse(JSON.stringify(updateUserDto)), {avatarUrl}))
    .pipe(
      catchError((error) => {
        if (!avatarUrl) return of(error);

        return this.fileService.remove(avatarUrl)
          .pipe(
            switchMap(() => {
              return of(error.response)
          })
        )
      })
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string): Observable<DeleteResult> {
    return this.userService.remove(id);
  }
}
