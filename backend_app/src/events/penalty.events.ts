// src/events/penalty.events.ts
export enum PENALTY_EVENTS {
  // Connection & presence
  JOIN_GAME = 'penalty:join',
  JOINED = 'penalty:joined',
  LEAVE_GAME = 'penalty:leave',
  LEFT = 'penalty:left',
  PRESENCE = 'penalty:presence',

  // Game lifecycle
  INIT = 'penalty:init',
  GAME_INIT = 'penalty:game_init',
  MAKE_MOVE = 'penalty:make_move',
  GAME_UPDATE = 'penalty:game_update',
  GAME_FINISHED = 'penalty:game_finished',

  // Error handling
  ERROR = 'penalty:error',
}
