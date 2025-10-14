import {
  Controller,
  Post,
  Get,
  Param,
  ParseUUIDPipe,
  Logger,
  Request,
  UseGuards,
  BadRequestException,
  Patch,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { GameInviteService } from './game-invite.service';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { Request as Req } from 'express';
import { JwtPayload } from 'src/types';

@ApiTags('Game Invites')
@Controller('game-invites')
export class GameInviteController {
  private readonly logger = new Logger(GameInviteController.name);

  constructor(private readonly gameInviteService: GameInviteService) { }

  @Get('received')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'List invites that involve you' })
  async getMyInvites(@Request() req: Req) {
    const jwtPayload = req.user as JwtPayload
    const invites = await this.gameInviteService.getMyInvites(jwtPayload.userId);

    return invites
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Fetch game invite detail' })
  async fetchGameInviteDetail(@Request() req: Req, @Param('id') id: string) {
    const { userId } = req.user as JwtPayload

    if (!id) {
      throw new BadRequestException('Game invite ID not provided.')
    }

    const invites = await this.gameInviteService.fetchGameInviteDetail({
      userId,
      gameInviteId: id
    });

    return invites
  }

  @Post(':id/accept')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Invite accepted, game created' })
  async acceptInvite(
    @Request() req: Req & { user: JwtPayload },
    @Param('id', ParseUUIDPipe) gameInviteId: string,
  ) {
    const userId = req.user.userId
    const result = await this.gameInviteService.acceptInvite(userId, gameInviteId);
    return { success: true, result };
  }

  @Patch(':id/decline')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Invite declined' })
  async declineInvite(
    @Request() req: & { user: JwtPayload },
    @Param('id', ParseUUIDPipe) gameInviteId: string,
  ) {
    const userId = req.user.userId
    const invite = await this.gameInviteService.declineInvite(userId, gameInviteId);
    return { success: true, data: invite };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Delete game invite' })
  async deleteInvite(
    @Request() req: & { user: JwtPayload },
    @Param('id', ParseUUIDPipe) gameInviteId: string,
  ) {
    const userId = req.user.userId
    const deletedInvite = await this.gameInviteService.cancelInvite(userId, gameInviteId);
    return { success: true, data: deletedInvite };
  }
}