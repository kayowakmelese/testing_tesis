import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GAME_STATUS, GAME_TYPE } from '@prisma/client';
import { CreatePenaltyGameDto, MakePenaltyMoveDto } from './schema/penalty.schema';

@Injectable()
export class PenaltyGameService {
  private readonly logger = new Logger(PenaltyGameService.name)
  constructor(private prisma: PrismaService) { }

  async createGame(dto: CreatePenaltyGameDto) {
    const { gameInviteId, bet, playersId } = dto;
    const isFree = bet <= 0

    const gameConfig = await this.prisma.gameConfig.findUnique({
      where: {
        gameType: GAME_TYPE.PENALTY
      }
    })

    if (!gameConfig) {
      throw new NotFoundException('Game config not found.')
    }

    // Validate users exist
    const players = await this.prisma.user.findMany({
      where: {
        id: {
          in: playersId
        }
      },
      include: {
        wallet: {
          include: { user: true }
        }
      }
    })

    if (players.length !== 2) {
      throw new NotFoundException('One or both players not found');

    }

    // Validate wallets & sufficient balance
    const playersWallet = players.map(p => p.wallet).filter(w => !!w)

    if (playersWallet.length !== 2) {
      throw new BadRequestException(`There is a user without wallet`);
    }

    const walletWithInsufficientBalance = playersWallet.find(w => w.balance < bet)

    if (walletWithInsufficientBalance) {
      throw new BadRequestException(`${walletWithInsufficientBalance.user.username} has insufficient balance`);
    }

    const existingGame = await this.prisma.game.findUnique({
      where: {
        gameInviteId: gameInviteId
      }
    })

    if (existingGame) {
      throw new BadRequestException('Game already created for given game invite Id.')
    }

    // Start transaction — deduct bets
    return this.prisma.$transaction(async (tx) => {
      // Create Game

      const game = await tx.game.create({
        data: {
          type: GAME_TYPE.PENALTY,
          status: GAME_STATUS.PENDING,
          round: gameConfig.round,
          gameInviteId: gameInviteId,
        },
      });

      // Link players
      await tx.gamePlayer.createMany({
        data: players.map(p => ({
          userId: p.id,
          gameId: game.id,
        }))
      });


      if (!isFree) {
        await tx.wallet.updateMany({
          where: {
            userId: {
              in: playersId
            }
          },
          data: { balance: { decrement: bet } },
        });
        // Record BET transactions
        await tx.transaction.createMany({
          data: playersWallet.map(w => ({
            walletId: w.id,
            type: "BET",
            amount: -bet,
            gameId: game.id,
          })),
        });
      }

      return game;
    });
  }

  async initGame(gameId: string, shooterId: string, goalkeeperId: string) {
    const game = await this.prisma.game.findUnique({
      where: { id: gameId },
      include: {
        players: true,
      },
    });

    if (!game) {
      throw new NotFoundException('Game not found');
    }

    // Ensure both players are part of this game
    const shooter = game.players.find((p) => p.userId === shooterId);
    const goalkeeper = game.players.find((p) => p.userId === goalkeeperId);

    if (!shooter || !goalkeeper) {
      throw new BadRequestException('Shooter or goalkeeper not in game');
    }

    const updatedGame = await this.prisma.$transaction(async tx => {
      // Assign roles
      await tx.gamePlayer.update({
        where: { id: shooter.id },
        data: { role: 'shooter' },
      });

      await tx.gamePlayer.update({
        where: { id: goalkeeper.id },
        data: { role: 'goalkeeper' },
      });

      // Initialize game state
      const initialState = {
        turn: 'shooter',
        score: { shooter: 0, goalkeeper: 0 },
        attempts: [],
        round: game.round, // total goals to win
        status: GAME_STATUS.ACTIVE,
      };

      // Update game with state
      const updatedGame = await tx.game.update({
        where: { id: gameId },
        data: {
          status: GAME_STATUS.ACTIVE,
          state: initialState,
        },
        include: {
          players: { include: { user: true } },
        },
      });

      return updatedGame;
    })

    return updatedGame
  }

  getGame(gameId: string) {
    return this.prisma.game.findUnique({
      where: { id: gameId },
    });
  }

  async makeMove(dto: MakePenaltyMoveDto) {
    const { gameId, playerId, direction } = dto;

    // Get game with players
    const game = await this.prisma.game.findUnique({
      where: { id: gameId },
      include: {
        players: {
          include: { user: true }
        }
      },
    });

    if (!game || game.status !== GAME_STATUS.ACTIVE) {
      throw new NotFoundException('Active game not found');
    }

    // Get shooter and goalkeeper from players (not from state)
    const shooter = game.players.find(p => p.role === 'shooter');
    const goalkeeper = game.players.find(p => p.role === 'goalkeeper');

    if (!shooter || !goalkeeper) {
      throw new Error('Invalid game state: missing player roles');
    }

    let state = game.state as any;

    // Validate turn
    if (state.turn === 'shooter' && shooter.userId !== playerId) {
      throw new BadRequestException('Not shooter\'s turn');
    }
    if (state.turn === 'goalkeeper' && goalkeeper.userId !== playerId) {
      throw new BadRequestException('Not goalkeeper\'s turn');
    }

    // Process move
    if (state.turn === 'shooter') {
      // Shooter chooses direction
      state = {
        ...state,
        currentShot: { shooterDirection: direction },
        turn: 'goalkeeper',
      };
    } else {
      // Goalkeeper chooses direction - resolve the shot
      const shooterDirection = state.currentShot.shooterDirection;
      const keeperDirection = direction;
      const scored = shooterDirection !== keeperDirection;

      state = {
        ...state,
        attempts: [
          ...(state.attempts || []),
          {
            shooterDirection,
            keeperDirection,
            scored,
            timestamp: new Date().toISOString(),
          }
        ],
        score: scored
          ? { ...state.score, shooter: state.score.shooter + 1 }
          : { ...state.score, goalkeeper: state.score.goalkeeper + 1 },
        turn: 'shooter',
      };

      // Check win condition (first to roundNumber goals)
      const winnerId =
        state.score.shooter >= game.round ? shooter.id :
          state.score.goalkeeper >= game.round ? goalkeeper.id :
            null;

      if (winnerId) {
        state = {
          ...state,
          winnerId,
          status: GAME_STATUS.FINISHED,
        };
      }

      // Clean up currentShot
      delete state.currentShot;
    }

    // Update game state
    const updatedGame = await this.prisma.game.update({
      where: { id: gameId },
      data: {
        state,
        status: state.status || game.status,
        winnerId: state.winnerId || null,
      },
      include: { players: true },
    });

    // Handle game end if finished
    if (state.status === GAME_STATUS.FINISHED && state.winnerId) {
      await this.handleGameEnd(
        gameId,
        state.winnerId,
        shooter.id,
        goalkeeper.id
      );
    }

    return updatedGame;
  }

  private async handleGameEnd(gameId: string, winnerId: string, shooterId: string, goalkeeperId: string) {
    const winner = await this.prisma.gamePlayer.findUnique({
      where: {
        id: winnerId
      },
      include: {
        user: true
      }
    })

    if (!winner) {
      throw new NotFoundException("Winner not found.")
    }

    await this.prisma.$transaction(async (tx) => {
      // Get winner's wallet
      const winnerWallet = await tx.wallet.findUnique({
        where: { userId: winner.user.id }
      });

      if (!winnerWallet) return;

      // Get game to calculate pot
      const game = await tx.game.findUnique({
        where: { id: gameId },
        include: { players: true, gameInvite: true }
      });

      if (!game) return;

      // Calculate total pot (sum of all bets)
      const totalPot = game.players.length * game.gameInvite.bet

      // Get service charge
      const gameConfig = await tx.gameConfig.findUnique({
        where: { gameType: game.type }
      });

      const serviceCharge = totalPot * (gameConfig?.serviceCharge || 0)
      const netWinnings = totalPot - serviceCharge

      // !! Create transactions stating money being made
      // await tx.transaction.create({
      //   data: {
      //     amount: serviceCharge,
      //     type: "DEPOSIT",
      //     gameId: game.id,
      //     walletId: "COMPANY_WALLET",
      //   }
      // })

      // Update winner's balance
      await tx.wallet.update({
        where: { id: winnerWallet.id },
        data: { balance: { increment: netWinnings } },
      });

      // Record WIN transaction
      await tx.transaction.create({
        data: {
          walletId: winnerWallet.id,
          type: 'WIN',
          amount: netWinnings,
          gameId: gameId,
        },
      });
    });
  }

  async getGameState(gameId: string) {
    const game = await this.prisma.game.findUnique({
      where: { id: gameId },
      include: {
        players: true,
        winner: true
      },
    });

    if (!game) throw new NotFoundException('Game not found');
    return game;
  }
}