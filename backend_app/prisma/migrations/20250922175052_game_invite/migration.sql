/*
  Warnings:

  - You are about to drop the `heartbeats` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."INVITE_STATUS" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'EXPIRED');

-- AlterEnum
ALTER TYPE "public"."TRANSACTION_TYPE" ADD VALUE 'GIFT';

-- DropForeignKey
ALTER TABLE "public"."heartbeats" DROP CONSTRAINT "heartbeats_receiver_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."heartbeats" DROP CONSTRAINT "heartbeats_sender_id_fkey";

-- DropTable
DROP TABLE "public"."heartbeats";

-- CreateTable
CREATE TABLE "public"."game_invites" (
    "id" UUID NOT NULL,
    "game_id" UUID,
    "from_user_id" UUID NOT NULL,
    "to_user_id" UUID NOT NULL,
    "game_type" "public"."GAME_TYPE" NOT NULL,
    "entry_fee" DOUBLE PRECISION NOT NULL,
    "max_players" INTEGER NOT NULL DEFAULT 2,
    "status" "public"."INVITE_STATUS" NOT NULL DEFAULT 'PENDING',
    "expires_at" TIMESTAMP(3),
    "accepted_at" TIMESTAMP(3),
    "declined_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "game_invites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "game_invites_to_user_id_status_idx" ON "public"."game_invites"("to_user_id", "status");

-- CreateIndex
CREATE INDEX "game_invites_status_expires_at_idx" ON "public"."game_invites"("status", "expires_at");

-- AddForeignKey
ALTER TABLE "public"."game_invites" ADD CONSTRAINT "game_invites_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."game_invites" ADD CONSTRAINT "game_invites_from_user_id_fkey" FOREIGN KEY ("from_user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."game_invites" ADD CONSTRAINT "game_invites_to_user_id_fkey" FOREIGN KEY ("to_user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
