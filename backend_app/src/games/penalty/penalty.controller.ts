import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseUUIDPipe,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';
import { PenaltyGameService } from './penalty.service';
import { CreatePenaltyGameDto, MakePenaltyMoveDto } from './schema/penalty.schema';

@ApiTags('Penalty Game')
@Controller('games/penalty')
export class PenaltyGameController {
  private readonly logger = new Logger(PenaltyGameController.name);

  constructor(private readonly penaltyGameService: PenaltyGameService) { }
  @Post('create')
  @ApiBody({ type: CreatePenaltyGameDto })
  @ApiResponse({ status: 201, description: 'Penalty game created' })
  async createGame(@Body() dto: CreatePenaltyGameDto) {
    return this.penaltyGameService.createGame(dto);
  }

  @Post('move')
  @ApiBody({ type: MakePenaltyMoveDto })
  @ApiResponse({ status: 200, description: 'Penalty move made' })
  async makeMove(@Body() dto: MakePenaltyMoveDto) {
    return this.penaltyGameService.makeMove(dto);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Get game state' })
  async getGame(@Param('id', ParseUUIDPipe) id: string) {
    return this.penaltyGameService.getGameState(id);
  }
}
