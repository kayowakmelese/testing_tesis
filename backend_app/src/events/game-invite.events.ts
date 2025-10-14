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

