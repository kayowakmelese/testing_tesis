import { Injectable, BadRequestException, NotFoundException, Logger, NotImplementedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGameInviteInput } from './schema/game-invite.schema';
import { INVITE_STATUS, GAME_TYPE, Game } from '@prisma/client';
import { PenaltyGameService } from 'src/games/penalty/penalty.service';

@Injectable()
export class GameInviteService {
    private readonly logger = new Logger(GameInviteService.name)
    constructor(private prisma: PrismaService, private penaltyGameService: PenaltyGameService) { }

    async createInvite(userId: string, dto: CreateGameInviteInput) {
        const { toUsersId } = dto

        if (toUsersId.includes(userId)) {
            throw new BadRequestException('Cannot invite yourself');
        }

        const targetUsers = await this.prisma.user.findMany({
            where: {
                id: {
                    in: toUsersId
                }
            },
        });

        if (targetUsers.length !== toUsersId.length) {
            throw new NotFoundException('Not all invited users found');
        }

        const existingGameInvite = await this.prisma.gameInvite.findFirst({
            where: {
                fromUserId: userId,
                gameType: dto.gameType,
                bet: dto.bet,
                minPlayers: dto.minPlayers,
                status: INVITE_STATUS.PENDING,
            },
            include: {
                toUsers: true
            }
        })


        if (existingGameInvite) {
            const isSameUsers = existingGameInvite.toUsers.map(u => u.id).every(id => dto.toUsersId.includes(id))

            if (isSameUsers) {
                throw new BadRequestException('Game invite already existing with same setup.')
            }

        }

        // Create invite
        return this.prisma.gameInvite.create({
            data: {
                fromUserId: userId,
                gameType: dto.gameType,
                bet: dto.bet,
                minPlayers: dto.minPlayers,
                status: INVITE_STATUS.PENDING,
                toUsers: {
                    connect: targetUsers
                }
            },
            include: {
                fromUser: true,
                toUsers: true
            }
        });
    }

    // ✅ GET MY INVITES — Fetch pending invites related to current user
    async getMyInvites(userId: string) {
        return this.prisma.gameInvite.findMany({
            where: {
                OR: [
                    { fromUserId: userId, },
                    {
                        toUsers: {
                            some: {
                                id: userId
                            }
                        }
                    }
                ]
            },
            include: {
                fromUser: {
                    select: {
                        id: true,
                        username: true,
                        photoUrl: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                toUsers: {
                    select: {
                        id: true,
                        username: true,
                        photoUrl: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                game: true
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async fetchGameInviteDetail({ userId, gameInviteId }: { userId: string, gameInviteId: string }) {
        const gameInvite = await this.prisma.gameInvite.findUnique({
            where: {
                id: gameInviteId,
                OR: [{
                    fromUserId: userId
                }, {
                    toUsers: {
                        some: {
                            id: userId
                        }
                    }
                }]
            },
            include: {
                fromUser: true,
                game: true,
                toUsers: true,
            }
        })

        return gameInvite
    }

    // ✅ ACCEPT INVITE — Deduct wallet, create game, update invite
    async acceptInvite(userId: string, inviteId: string) {
        // 1. Find and validate invite
        const invite = await this.prisma.gameInvite.findUnique({
            where: { id: inviteId },
            include: { fromUser: true, toUsers: true },
        });

        if (!invite) {
            throw new NotFoundException('Game invite not found');
        }

        const invitedUserIds = invite.toUsers.map(u => String(u.id));

        if (!invitedUserIds.includes(String(userId))) {
            throw new BadRequestException('This invite is not for you');
        }

        if (invite.status !== INVITE_STATUS.PENDING) {
            throw new BadRequestException(`Invite is already ${invite.status.toLowerCase()}`);
        }

        // 2. Check user wallet
        const wallet = await this.prisma.wallet.findUnique({
            where: { userId },
        });

        if (!wallet) {
            throw new BadRequestException('Wallet not found. Please contact support.');
        }

        if (wallet.balance < invite.bet) {
            throw new BadRequestException('Insufficient balance to accept this invite');
        }

        const now = new Date()

        if (invite.gameType === GAME_TYPE.PENALTY) {
            this.prisma.$transaction(async tx => {
                const game = await this.penaltyGameService.createGame({
                    bet: invite.bet,
                    gameInviteId: invite.id,
                    playersId: [invite.fromUserId, userId],
                })

                await this.prisma.gameInvite.update({
                    where: {
                        id: invite.id
                    },
                    data: {
                        status: "ACCEPTED",
                        acceptedAt: now
                    }
                })

                return game
            })
        } else {
            throw new NotImplementedException("Not implemented game type")
        }
    }

    // ✅ DECLINE INVITE
    async declineInvite(userId: string, inviteId: string) {
        const invite = await this.prisma.gameInvite.findUnique({
            where: { id: inviteId },
            include: {
                toUsers: true
            }
        });

        if (!invite) {
            throw new NotFoundException('Game invite not found');
        }

        if (!invite.toUsers.map(u => u.id).includes(userId)) {
            throw new BadRequestException('This invite is not for you');
        }


        if (invite.status !== INVITE_STATUS.PENDING) {
            throw new BadRequestException(`Invite is already ${invite.status.toLowerCase()}`);
        }

        const updatedInvite = await this.prisma.gameInvite.update({
            where: { id: invite.id },
            data: {
                status: INVITE_STATUS.DECLINED,
                declinedAt: new Date(),
            },
            include: {
                toUsers: true
            }
        });

        this.logger.log(`Invite ${inviteId} declined by user ${userId}.`);

        return updatedInvite;
    }

    async cancelInvite(userId: string, inviteId: string) {
        const invite = await this.prisma.gameInvite.findUnique({
            where: { id: inviteId },
        });

        if (!invite) {
            throw new NotFoundException('Game invite not found');
        }

        if (invite.fromUserId !== userId) {
            throw new BadRequestException("This invite isn't yours");
        }

        if (invite.status !== INVITE_STATUS.PENDING) {
            throw new BadRequestException(`Invite is already ${invite.status.toLowerCase()}`);
        }

        const deletedInvite = await this.prisma.gameInvite.delete({
            where: { id: invite.id },
        });

        this.logger.log(`Invite ${inviteId} deleted by user ${userId}.`);

        return deletedInvite;
    }

    // ✅ GET INVITE BY ID
    async getInvite(inviteId: string) {
        const invite = await this.prisma.gameInvite.findUnique({
            where: { id: inviteId },
            include: {
                fromUser: true,
                toUsers: true,
                game: {
                    include: {
                        players: {
                            include: {
                                user: true,
                            },
                        },
                    },
                },
            },
        });

        if (!invite) {
            throw new NotFoundException('Game invite not found');
        }

        return invite;
    }

    async updateGameInfo({ gameId, game }: { gameId: string, game: Partial<Omit<Game, 'id' | 'type'>> }) {
        const now = new Date()
        const updatedGame = await this.prisma.game.update({
            where: {
                id: gameId
            },
            data: {
                status: game.status,
                startedAt: now,
            }
        })

        return updatedGame
    }
}