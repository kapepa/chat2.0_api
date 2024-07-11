import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt'
import { forkJoin, from, Observable, of, switchMap } from 'rxjs';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserInt } from 'src/user/interface/user.interface';

type PayloadType = Pick<UserInt, "id" | "username" | "avatarUrl" | "firstName" | "lastName"> & {sub: string}

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  login({ email, password }: LoginAuthDto): Observable<LoginType> {
    return this.userService.userOne({
      where: {
        email
      }
    }).pipe(
      switchMap((profile) => {
        if (!profile) throw new UnauthorizedException("This email doesn't existing");

        const payload: PayloadType = { 
          sub: profile.id, 
          id: profile.id,
          username: profile.username,
          firstName: profile.firstName,
          lastName: profile.lastName,
          avatarUrl: profile.avatarUrl,
        };

        return forkJoin([
          this.comparePasswords(password, profile.password),
          this.jwtToken(payload),
        ]).pipe(
          switchMap(([compare, token]) => {
            if (!compare) throw new UnauthorizedException("This email doesn't existing");
            return of({ access_token: token })
          })
        )
      })
    )
  }

  jwtToken(payload: PayloadType): Observable<string> {
    return from(this.jwtService.signAsync(payload))
  }

  hashPassword(password: string): Observable<string> {
    const saltRounds = 10;
    return from(bcrypt.hash(password, saltRounds));
  }

  comparePasswords(plainPassword: string, hashedPassword: string): Observable<boolean> {
    return from(bcrypt.compare(plainPassword, hashedPassword));
  }
}
