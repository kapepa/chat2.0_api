import { Controller, Post, Body, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { Observable } from 'rxjs';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post("/login")
  @UseInterceptors(NoFilesInterceptor())
  login(@Body() loginAuthDto: LoginAuthDto): Observable<LoginType> {
    const toBody = JSON.parse(JSON.stringify(loginAuthDto))
    return this.authService.login(toBody);
  }

}
