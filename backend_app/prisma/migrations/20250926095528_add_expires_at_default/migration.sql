/*
  Warnings:

  - You are about to drop the column `expires_at` on the `game_invites` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."game_invites_status_expires_at_idx";

-- AlterTable
ALTER TABLE "public"."game_config" ADD COLUMN     "expires_at" TIMESTAMP(3) NOT NULL DEFAULT NOW() + INTERVAL '1 day';

-- AlterTable
ALTER TABLE "public"."game_invites" DROP COLUMN "expires_at";
