import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreatePenaltyGameSchema = z.object({
    playersId: z.array(z.uuid()),
    gameInviteId: z.uuid(),
    bet: z.number().positive('Bet amount must be positive').default(0),
});

export type CreatePenaltyGameInput = z.infer<typeof CreatePenaltyGameSchema>;

export const MakePenaltyMoveSchema = z.object({
    gameId: z.uuid('Game ID must be a valid UUID'),
    playerId: z.uuid('Player ID must be a valid UUID'),
    direction: z.enum(['left', 'center', 'right'], {
        message: 'Direction must be "left", "center", or "right"',
    }),

});

export type MakePenaltyMoveInput = z.infer<typeof MakePenaltyMoveSchema>;

export class CreatePenaltyGameDto extends createZodDto(CreatePenaltyGameSchema) { }
export class MakePenaltyMoveDto extends createZodDto(MakePenaltyMoveSchema) { }
