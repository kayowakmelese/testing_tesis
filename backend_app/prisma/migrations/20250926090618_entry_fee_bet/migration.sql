/*
  Warnings:

  - You are about to drop the column `entry_fee` on the `game_invites` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."game_invites" DROP COLUMN "entry_fee",
ADD COLUMN     "bet" DOUBLE PRECISION NOT NULL DEFAULT 5;
