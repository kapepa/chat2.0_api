import { Controller, Post, Body, UseInterceptors, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { Observable } from 'rxjs';
import { RefreshGuard } from './guards/refresh/refresh.guard';
import { TokensType } from './types/tokens.type';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post("/login")
  @UseInterceptors(NoFilesInterceptor())
  login(@Body() loginAuthDto: LoginAuthDto): Observable<TokensType> {
    const toBody = JSON.parse(JSON.stringify(loginAuthDto))
    return this.authService.login(toBody);
  }

  @UseGuards(RefreshGuard)
  @Post('/refresh')
  refrshToken(@Req() req) {
    return this.authService.refreshToken(req.user);
  }
}
