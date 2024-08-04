import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { SubscribeService } from './subscribe.service';
import { Observable } from 'rxjs';
import { UserInt } from 'src/user/interface/user.interface';
import { AuthGuard } from 'src/auth/guards/auth/auth.guard';

@Controller('subscribe')
export class SubscribeController {
  constructor(
    private subscribeService: SubscribeService
  ) {}

  @Get('/all')
  @UseGuards(AuthGuard)
  getAll(@Req() req): Observable<UserInt[]> {
    return this.subscribeService.getAll();
  }
}
