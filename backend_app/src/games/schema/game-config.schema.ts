import { GAME_TYPE } from "@prisma/client";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const CreateGameConfigSchema = z.object({
    gameType: z.enum(Object.values(GAME_TYPE)),
    minPlayers: z.number().int().min(2, "Minimum players must be at least 2"),
    maxPlayers: z.number().int().min(2, "Maximum players must be at least 2"),
    isActive: z.boolean().default(true),
    serviceCharge: z.number().min(0, "Service charge cannot be negative"),
});


export const GameConfigGameTypeSchema = z.object({
    gameType: z.enum(Object.values(GAME_TYPE))
});




export const UpdateGameConfigSchema = CreateGameConfigSchema.omit({
    gameType: true
}).partial()

// Types
export type CreateGameConfigInput = z.infer<typeof CreateGameConfigSchema>;
export type UpdateGameConfigInput = z.infer<typeof UpdateGameConfigSchema>;

// ✅ DTOs for NestJS Controllers
export class CreateGameConfigDto extends createZodDto(CreateGameConfigSchema) { }
export class UpdateGameConfigDto extends createZodDto(UpdateGameConfigSchema) { }




