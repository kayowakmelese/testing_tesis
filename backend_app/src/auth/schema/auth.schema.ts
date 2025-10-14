import { z } from 'zod';
import { createZodDto } from "nestjs-zod";

export const TelegramLoginSchema = z.object({
  id: z.string().min(1, 'Telegram ID is required'),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().optional(),
  username: z.string().optional(),
  photo_url: z.url().optional().or(z.literal('')),
  auth_date: z.string().min(1, 'Auth date is required'),
  hash: z.string().min(1, 'Hash is required'),
});

export type TelegramLoginInput = z.infer<typeof TelegramLoginSchema>;


export class TelegramLoginSchemaDto extends createZodDto(TelegramLoginSchema) { }

