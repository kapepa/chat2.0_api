import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DeleteResult, FindOneOptions, Repository } from 'typeorm';
import { forkJoin, from, map, mergeMap, Observable, of, switchMap, tap, toArray } from 'rxjs';
import { UserInt } from './interface/user.interface';
import { FileService } from 'src/file/file.service';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly fileService: FileService,
    private readonly authService: AuthService,
  ) {}

  create(createUserDto: CreateUserDto): Observable<UserInt> {
    const profile = this.userRepository.create(createUserDto)
    return forkJoin([
      this.userOne({
        where: {
          email: profile.email,
        },
      }),
      this.authService.hashPassword(createUserDto.password)
    ])
    .pipe(
      switchMap(([existUser, hash]) => {
        if (!!existUser) throw new BadRequestException("This email adress is already in use")
        profile.password = hash;
        return from(this.userRepository.save(profile))
      }),
    )
  }

  findAll(): Observable<UserInt[]> {
    return from(this.userRepository.find())
  }

  findOne(id: string): Observable<UserInt> {
    return from(this.userRepository.findOne({
      where: {
        id
      }
    }))
  }

  update(id: string, updateUserDto: UpdateUserDto): Observable<UserInt> {
    return from(this.userRepository.findOne({
      where: {
        id,
      }
    }))
    .pipe(
      switchMap((profile) => {
        if (!profile) throw new NotFoundException("This user was not found");
        const updateAvatar = updateUserDto.avatarUrl !== profile.avatarUrl

        return from(this.userRepository.update(id, updateUserDto)).pipe(
          tap(() => {
            if (updateAvatar) this.fileService.remove(profile.avatarUrl).subscribe()
          }),
          switchMap(() => {
            return from(this.userRepository.findOne({
              where: {
                id
              }
            }))
          })
        )
      })
    )
  }

  remove(id: string): Observable<DeleteResult> {
    return from(this.userRepository.findOne({
      where: {
        id,
      }
    }))
    .pipe(
      switchMap((profile) => {
        if (!profile) throw new NotFoundException("This user was not found");

        return this.fileService.remove(profile.avatarUrl).pipe(
          switchMap(() => {
            return from(this.userRepository.delete({
              id
            }))
          })
        )
      })
    )
  }

  userOne(params: FindOneOptions<User>) {
    return from(
      this.userRepository.findOne(params)
    )
  }
}
