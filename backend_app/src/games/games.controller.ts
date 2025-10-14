import {
    Body,
    Controller,
    Get,
    Post,
    Patch,
    Param,
    Logger,
    Query,
} from '@nestjs/common';
import { ApiTags, ApiBody, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { GamesService } from './games.service';
import { CreateGameConfigDto, GameConfigGameTypeSchema, UpdateGameConfigDto } from './schema/game-config.schema';
import { GAME_TYPE } from '@prisma/client';


@ApiTags('Games')
@Controller('games')
export class GamesController {
    private readonly logger = new Logger(GamesController.name);
    constructor(private readonly gamesService: GamesService) { }

    @Get()
    @ApiResponse({ status: 200, description: 'List of game configurations' })
    async getGames() {
        this.logger.debug('Fetching all game configs');
        return this.gamesService.getGameConfigs();
    }

    @Get('/types/:gameType')
    @ApiParam({
        name: 'gameType',
        enum: GAME_TYPE,
        description: 'The type of game configuration to fetch',
    })
    @ApiResponse({ status: 200, description: 'List of game configurations' })
    async getGameByGameType(@Param('gameType') gameType: string) {
        const validatedGameType = this.gamesService.validateGameType(gameType as GAME_TYPE);
        return this.gamesService.getGameConfigByGameType(validatedGameType);
    }

    @Post()
    @ApiBody({ type: CreateGameConfigDto })
    @ApiResponse({ status: 201, description: 'Game config created' })
    async create(@Body() dto: CreateGameConfigDto) {
        return this.gamesService.createGameConfig(dto);
    }

    @Patch(':id')
    @ApiBody({ type: UpdateGameConfigDto })
    @ApiResponse({ status: 200, description: 'Game config updated' })
    async update(@Param('id') id: string, @Body() dto: UpdateGameConfigDto) {
        return this.gamesService.updateGameConfig(id, dto);
    }


    @Get('/rooms')
    @ApiQuery({
        name: 'gameType',
        required: false,
        enum: GAME_TYPE,
        description: 'Filter game rooms by type (optional)',
    })
    @ApiResponse({
        status: 200,
        description: 'List of available game rooms',
        type: [Object], // replace with DTO if you have one, e.g., GameRoomDto
    })
    async getGameRooms(@Query('gameType') gameType?: GAME_TYPE) {
        if (gameType) {
            GameConfigGameTypeSchema.parse({ gameType })
        }
        return this.gamesService.getGameRooms(gameType)
    }

    @Get('/rooms/:id')
    @ApiParam({
        name: 'id',
        type: String,
        description: 'Game room ID',
    })
    @ApiResponse({
        status: 200,
        description: 'Details of a specific game room',
        type: Object, // replace with GameRoomDto if you have one
    })
    @ApiResponse({
        status: 404,
        description: 'Game room not found',
    })
    async getGameRoom(@Param('id') gameId: string) {
        return this.gamesService.getGameRoom(gameId)
    }
}
