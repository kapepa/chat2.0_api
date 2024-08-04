import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { User } from 'src/user/entities/user.entity';
import { UserInt } from 'src/user/interface/user.interface';
import { Repository } from 'typeorm';

@Injectable()
export class SubscribeService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ){}

  getAll(): Observable<UserInt[]> {
    return from(this.userRepository.find());
  }
}
