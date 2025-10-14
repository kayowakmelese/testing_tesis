import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { GAME_TYPE } from '@prisma/client';

export const CreateGameInviteSchema = z.object({
  toUsersId: z.array(z.uuid('Recipient user ID must be a valid UUID')),
  gameType: z.enum(GAME_TYPE, {
    message: 'Game type must be a valid enum value (e.g., PENALTY, TIC_TAC_TOE)',
  }),
  bet: z
    .number()
    .default(0),
  minPlayers: z
    .number()
    .int()
    .min(2, 'Minimum 2 players required')
    .max(100, 'Maximum 100 players allowed')
    .default(2),
});

export type CreateGameInviteInput = z.infer<typeof CreateGameInviteSchema>;


export const AcceptGameInviteSchema = z.object({
  gameInviteId: z.uuid()
})

export type AcceptGameInviteInput = z.infer<typeof AcceptGameInviteSchema>;

// 👇 Generate NestJS DTO classes
export class CreateGameInviteDto extends createZodDto(CreateGameInviteSchema) { }
export class AcceptGameInviteDto extends createZodDto(AcceptGameInviteSchema) { }