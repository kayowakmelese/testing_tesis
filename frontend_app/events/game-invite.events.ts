import { GAME_TYPE } from "@/types";
import z from "zod";

export enum GAME_INVITE_EVENTS {
  CREATE = "invite.create",          // client → server
  CREATED = "invite.created",        // server → client
  RECEIVED = "invite.received",
  ACCEPT = "invite.accept",
  ACCEPTED = "invite.accepted",
  DECLINE = "invite.decline",
  DECLINED = "invite.declined",
  CANCEL = "invite.cancel",
  CANCELED = "invite.canceled",
}

export enum GAME_INVITE_ROOM_EVENTS {
  JOIN = "game.join",
  JOINED = "game.joined",
  LEAVE = "game.leave",
  LEFT = "game.left",
  PRESENCE = "game.presence",
  PLAYER_READY = "game.player.ready",
  START = "game.start",
  STARTED = "game.started",
  UPDATE = "game.update",
}



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


export interface InviteCreatedPayload {
  inviteId: string;
  fromUserId: string;
  toUserIds: string[];
  gameType: GAME_TYPE;
  bet: number;
  status: string;
}

export interface InviteAcceptedPayload {
  inviteId: string;
  acceptorId: string;
  gameId: string;
  playerCount: number;
}

export interface GamePresencePayload {
  gameId: string;
  playerStatuses: Record<string, { isConnected: boolean; isReady: boolean }>;
}
