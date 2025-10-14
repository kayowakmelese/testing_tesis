import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from 'src/validators/env.validation';

@Injectable()
export class EnvService {
  constructor(private configService: ConfigService<EnvConfig, true>) {}

  get<T extends keyof EnvConfig>(key: T) {
    return this.configService.get(key, { infer: true });
  }
}
