// src/modules/auth/auth.service.ts
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { EnvService } from 'src/env/env.service';
import { TelegramLoginInput } from './schema/auth.schema';
import { JwtPayload } from 'src/types';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private envService: EnvService,
  ) { }

  private getTelegramBotToken(): string {
    return this.envService.get('TELEGRAM_BOT_TOKEN');
  }

  verifyTelegramData(data: Record<string, string>): boolean {
    // Telegram sends data as string key-value pairs
    const checkArr = Object.keys(data)
      .filter((key) => key !== 'hash')
      .sort()
      .map((key) => `${key}=${data[key]}`)
      .join('\n');

    const secretKey = crypto
      .createHash('sha256')
      .update(this.getTelegramBotToken())
      .digest();

    const hmac = crypto.createHmac('sha256', secretKey);
    const calculatedHash = hmac.update(checkArr).digest('hex');

    const isRecent = Date.now() / 1000 - parseInt(data.auth_date) < 86400; // 24h
    const isValidHash = calculatedHash === data.hash;

    if (!isRecent) {
      this.logger.warn('Telegram login attempt with expired auth_date');
    }
    if (!isValidHash) {
      this.logger.warn('Invalid Telegram hash received');
    }

    return isValidHash && isRecent;
  }

  async validateOrCreateUser(data: TelegramLoginInput): Promise<User> {
    let user = await this.prisma.user.findUnique({
      where: { telegramId: data.id },
    });

    if (!user) {
      user = await this.prisma.$transaction(async tx => {
        const user = await tx.user.create({
          data: {
            telegramId: data.id,
            firstName: data.first_name,
            lastName: data.last_name || '',
            username: data.username || '',
            photoUrl: data.photo_url || '',
          },
        });


        await tx.userStatus.create({
          data: {
            userId: user.id,
            isBanned: false,
            isSuspended: false,
          }
        })

        await tx.wallet.create({
          data: {
            userId: user.id,
            balance: 100,
          }
        })

        return user
      })
      this.logger.log(`🆕 Created new user: ${user.id}`);
    } else {
      // Update profile if changed
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          firstName: data.first_name,
          lastName: data.last_name || user.lastName,
          username: data.username || user.username,
          photoUrl: data.photo_url || user.photoUrl,
        },
      });
      this.logger.log(`🔄 Updated user profile: ${user.id}`);
    }

    return user;
  }

  generateTokens(jwtPayload: JwtPayload) {
    const payload = { sub: jwtPayload.userId, userId: jwtPayload.userId, telegramId: jwtPayload.telegramId };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.envService.get('JWT_SECRET'),
      expiresIn: this.envService.get('JWT_EXPIRES_IN'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.envService.get('JWT_SECRET'),
      expiresIn: '30d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async loginByTelegramId(telegramId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        telegramId: telegramId
      }
    })

    if (!user) {
      throw new NotFoundException("User not found")
    }

    const tokens = this.generateTokens({
      userId: user.id,
      telegramId: user.telegramId
    })
    return { user, tokens }
  }


  async verifyUser(jwtPayload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: jwtPayload.userId
      }
    })

    if (!user) {
      throw new NotFoundException("User not found")
    }

    return user
  }
}
