import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { Request as Req } from 'express';
import { JwtPayload } from 'src/types';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }
    @Get()
    @UseGuards(JwtAuthGuard)
    getUsers(@Request() req: Req) {
        const user = req.user as JwtPayload
        return this.usersService.getUsers(user.userId)
    }

    @Get("dev")
    getUsersForDev(@Request() req: Req) {
        return this.usersService.getUsersForDev()
    }

    @Get(':userId')
    @UseGuards(JwtAuthGuard)
    getUserById(@Param('userId') userId: string, @Request() req: Req) {
        const user = req.user as JwtPayload
        return this.usersService.getUserById(userId, user.userId)
    }



    @Get("/telegram/:telegramId")
    getUserByTelegramId(@Param("telegramId") telegramId: string) {
        return this.usersService.getUserByTelegramId(telegramId)
    }
}
