/*
  Warnings:

  - You are about to drop the column `roundNumber` on the `games` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."game_config" ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '1 day';

-- AlterTable
ALTER TABLE "public"."games" DROP COLUMN "roundNumber",
ADD COLUMN     "round" INTEGER NOT NULL DEFAULT 1;
