import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { SharpPipe } from 'src/file/pipes/sharp/sharp.pipe';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { UserInt } from './interface/user.interface';
import { FileService } from 'src/file/file.service';
import { DeleteResult } from 'typeorm';
import { AuthGuard } from 'src/auth/guards/auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly fileService: FileService,
  ) {}

  @Post("/create")
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

  @Get('/myself')
  @UseGuards(AuthGuard)
  myself(@Request() req): Observable<UserInt> {
    const { sub } = req.user;
    return this.userService.findOne(sub)
  }

  @Get('/all')
  findAll(): Observable<UserInt[]> {
    return this.userService.findAll();
  }

  @Get('/one/:id')
  findOne(@Param('id') id: string): Observable<UserInt> {
    return this.userService.findOne(id);
  }

  @Patch('/update/:id')
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

  @Delete('/one/:id')
  remove(@Param('id') id: string): Observable<DeleteResult> {
    return this.userService.remove(id);
  }
}
