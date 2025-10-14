/*
  Warnings:

  - You are about to drop the column `max_players` on the `game_invites` table. All the data in the column will be lost.
  - You are about to drop the column `to_user_id` on the `game_invites` table. All the data in the column will be lost.
  - You are about to drop the column `bet_amount` on the `game_players` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."game_invites" DROP CONSTRAINT "game_invites_to_user_id_fkey";

-- DropIndex
DROP INDEX "public"."game_invites_to_user_id_status_idx";

-- AlterTable
ALTER TABLE "public"."game_invites" DROP COLUMN "max_players",
DROP COLUMN "to_user_id",
ADD COLUMN     "min_players" INTEGER NOT NULL DEFAULT 2;

-- AlterTable
ALTER TABLE "public"."game_players" DROP COLUMN "bet_amount",
ADD COLUMN     "bet" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "public"."_GameInvitesReceived" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_GameInvitesReceived_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_GameInvitesReceived_B_index" ON "public"."_GameInvitesReceived"("B");

-- CreateIndex
CREATE INDEX "game_invites_status_idx" ON "public"."game_invites"("status");

-- AddForeignKey
ALTER TABLE "public"."_GameInvitesReceived" ADD CONSTRAINT "_GameInvitesReceived_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."game_invites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_GameInvitesReceived" ADD CONSTRAINT "_GameInvitesReceived_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
