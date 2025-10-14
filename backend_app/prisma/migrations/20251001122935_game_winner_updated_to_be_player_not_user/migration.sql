/*
  Warnings:

  - A unique constraint covering the columns `[winner_id]` on the table `games` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."games" DROP CONSTRAINT "games_winner_id_fkey";

-- AlterTable
ALTER TABLE "public"."game_config" ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '1 day';

-- CreateIndex
CREATE UNIQUE INDEX "games_winner_id_key" ON "public"."games"("winner_id");

-- AddForeignKey
ALTER TABLE "public"."games" ADD CONSTRAINT "games_winner_id_fkey" FOREIGN KEY ("winner_id") REFERENCES "public"."game_players"("id") ON DELETE SET NULL ON UPDATE CASCADE;
