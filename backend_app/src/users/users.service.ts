import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService, private readonly authService: AuthService) { }

    async getUsers(userId: string) {
        const users = await this.prisma.user.findMany(
            {
                where: {
                    id: {
                        not: userId
                    }
                }
            }
        )
        return users
    }

    async getUserById(userId: string, requesterId: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            },
            include: {
                wallet: true,
                userStatus: true
            }
        })

        if (!user) {
            throw new NotFoundException("User not found")
        }

        // if (user.id === requesterId) {
        //     return user
        // }

        return user
    }

    async getUsersForDev() {
        const users = await this.prisma.user.findMany()
        return users
    }

    async getUserByTelegramId(telegramId: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                telegramId: telegramId
            }
        })

        if (!user) {
            throw new NotFoundException("User not found")
        }

        return user
    }

}
