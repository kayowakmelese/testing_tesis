/*
  Warnings:

  - You are about to drop the column `game_id` on the `game_invites` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[game_invite_id]` on the table `games` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `game_invite_id` to the `games` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."game_invites" DROP CONSTRAINT "game_invites_game_id_fkey";

-- AlterTable
ALTER TABLE "public"."game_invites" DROP COLUMN "game_id";

-- AlterTable
ALTER TABLE "public"."games" ADD COLUMN     "game_invite_id" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "games_game_invite_id_key" ON "public"."games"("game_invite_id");

-- CreateIndex
CREATE INDEX "games_game_invite_id_idx" ON "public"."games"("game_invite_id");

-- AddForeignKey
ALTER TABLE "public"."games" ADD CONSTRAINT "games_game_invite_id_fkey" FOREIGN KEY ("game_invite_id") REFERENCES "public"."game_invites"("id") ON DELETE CASCADE ON UPDATE CASCADE;
