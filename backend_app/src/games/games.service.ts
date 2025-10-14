import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGameConfigInput, GameConfigGameTypeSchema, UpdateGameConfigInput } from './schema/game-config.schema';
import { GAME_TYPE } from '@prisma/client';

@Injectable()
export class GamesService {
    private readonly logger = new Logger(GamesService.name);
    constructor(private readonly prisma: PrismaService) { }

    validateGameType(gameType: string) {
        const data = GameConfigGameTypeSchema.parse({ gameType })
        return data.gameType
    }

    async getGameConfigs() {
        const gameConfigs = await this.prisma.gameConfig.findMany()
        return gameConfigs
    }

    async getGameConfigByGameType(gameType: GAME_TYPE) {
        const gameConfig = await this.prisma.gameConfig.findUnique({
            where: {
                gameType
            }
        })
        return gameConfig
    }

    async createGameConfig(gameConfig: CreateGameConfigInput) {
        // const gameType = this.validateGameType(gameConfig.gameType)

        const newGameConfig = await this.prisma.gameConfig.create({
            data: {
                ...gameConfig,
                // gameType
            }
        })

        return newGameConfig
    }

    async updateGameConfig(gameId: string, gameConfig: UpdateGameConfigInput) {
        const updatedGameConfig = await this.prisma.gameConfig.update({
            where: {
                id: gameId
            },
            data: gameConfig
        })
        return updatedGameConfig
    }

    async getGameRooms(gameType?: GAME_TYPE) {
        const gameRooms = await this.prisma.game.findMany({
            where: gameType && { type: gameType },
            include: {
                gameInvite: true,
                players: {
                    include: {
                        user: true,
                        game: true
                    }
                }
            }
        })

        return gameRooms
    }

    async getGameRoom(gameId: string) {
        const gameRoom = await this.prisma.game.findUnique({
            where: { id: gameId },
            include: {
                gameInvite: true,
                players: {
                    include: {
                        user: true,
                    }
                }
            }
        })

        if (!gameRoom) {
            throw new NotFoundException('Game room not found.')
        }

        const gameConfig = await this.prisma.gameConfig.findUnique({
            where: { gameType: gameRoom.type }
        })

        if (!gameConfig) {
            throw new BadRequestException('Game configuration not found for this game type.')
        }

        return { ...gameRoom, config: gameConfig }
    }
}
