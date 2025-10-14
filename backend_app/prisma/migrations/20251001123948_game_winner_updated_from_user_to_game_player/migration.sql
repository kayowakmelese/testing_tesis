/*
  Warnings:

  - You are about to drop the column `bet` on the `game_players` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."game_config" ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '1 day';

-- AlterTable
ALTER TABLE "public"."game_players" DROP COLUMN "bet";
