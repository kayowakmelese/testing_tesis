import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { EnvService } from 'src/env/env.service';
import { JwtStrategy } from 'src/strategies/jwt.strategy';
import { RefreshTokenStrategy } from 'src/strategies/refresh-token.strategy';
import { PassportModule } from '@nestjs/passport';
// import { EnvModule } from 'src/env/env.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [EnvService],
      useFactory(envService: EnvService) {
        return {
          secret: envService.get('JWT_SECRET'),
          signOptions: { expiresIn: envService.get('JWT_EXPIRES_IN') },
        };
      },
    }),
  ],
  providers: [AuthService, JwtStrategy, RefreshTokenStrategy],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule { }
