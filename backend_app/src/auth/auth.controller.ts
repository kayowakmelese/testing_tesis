import {
    Body,
    Controller,
    Post,
    UsePipes,
    Logger,
    Request,
    UseGuards,
    Get,
    Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TelegramLoginInput, TelegramLoginSchemaDto } from './schema/auth.schema';
import { JwtAuthGuard, JwtRefreshGuard } from 'src/guards/auth.guard';
import { JwtPayload } from 'src/types';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    private logger = new Logger(AuthController.name);

    constructor(private readonly authService: AuthService) { }

    @Post('telegram')
    @ApiBody({
        type: TelegramLoginSchemaDto
    })
    @ApiResponse({ status: 201, description: 'User authenticated successfully' })
    @ApiResponse({ status: 400, description: 'Validation failed' })
    async telegramLogin(@Body() body: TelegramLoginInput) {
        this.logger.debug('Telegram login attempt', { telegramId: body.id });
        // if (!this.authService.verifyTelegramData(body)) {
        //     this.logger.warn('Invalid Telegram login data', { telegramId: body.id });
        //     throw new UnauthorizedException('Invalid Telegram authentication data');
        // }

        const user = await this.authService.validateOrCreateUser(body);
        const tokens = this.authService.generateTokens({
            userId: user.id,
            telegramId: user.telegramId
        });

        this.logger.log('✅ User authenticated', { userId: user.id });

        return {
            ...tokens,
            user
        };
    }

    @Post('refresh')
    @UseGuards(JwtRefreshGuard)
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                'refreshToken': { type: 'string', example: '123456789' },
            },
        },
    })
    @ApiResponse({ status: 200, description: 'User token refreshed' })
    async refreshToken(@Request() req: Request & { user: JwtPayload }) {
        const user = req.user;
        return this.authService.generateTokens(user);
    }

    @Get("/telegram/:telegramId/login")
    loginByTelegramId(@Param("telegramId") telegramId: string) {
        return this.authService.loginByTelegramId(telegramId)
    }

    @Get("verify")
    @UseGuards(JwtAuthGuard)
    verifyUser(@Request() req: Request & { user: JwtPayload }) {
        const jwtPayload = req.user
        return this.authService.verifyUser(jwtPayload)
    }
}
