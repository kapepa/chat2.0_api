import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt'
import { forkJoin, from, Observable, of, switchMap } from 'rxjs';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UserService } from 'src/user/user.service';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { UserInt } from 'src/user/interface/user.interface';
import { TokensType } from './types/tokens.type';

type PayloadType = Pick<UserInt, "id" | "username" | "avatarUrl" | "firstName" | "lastName"> & {sub: string}

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  login({ email, password }: LoginAuthDto): Observable<TokensType> {
    return this.userService.userOne({
      where: {
        email
      },  
      select:{
        id: true,
        password: true,
        username: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
      },
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
          this.jwtToken(payload, { expiresIn: '60d' }),
        ]).pipe(
          switchMap(([compare, token, refresh]) => {
            if (!compare) throw new UnauthorizedException("This email doesn't existing");
            return of({ 
              access_token: token,
              refresh_token: refresh,
            })
          })
        )
      })
    )
  }

  refreshToken(profile: UserInt): Observable<TokensType> {
    return this.userService.userOne({
      where: {
        id: profile.id,
      },  
      select:{
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
      },
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
          this.jwtToken(payload),
          this.jwtToken(payload, { expiresIn: '60d' }),
        ]).pipe(
          switchMap(([token, refresh]) => {
            return of({ 
              access_token: token,
              refresh_token: refresh,
            })
          })
        )
      })
    )
  }

  jwtToken(payload: PayloadType, options?: JwtSignOptions): Observable<string> {
    return from(this.jwtService.signAsync(payload, options));
  };

  hashPassword(password: string): Observable<string> {
    const saltRounds = 10;
    return from(bcrypt.hash(password, saltRounds));
  };

  comparePasswords(plainPassword: string, hashedPassword: string): Observable<boolean> {
    return from(bcrypt.compare(plainPassword, hashedPassword));
  };
}
