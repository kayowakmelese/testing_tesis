import { Injectable } from '@nestjs/common';
import { EnvService } from './env/env.service';

@Injectable()
export class AppService {
  constructor(private envService: EnvService) {}

  getHello() {
    const ab = this.envService.get('DATABASE_URL');
    return ab;
  }
}
