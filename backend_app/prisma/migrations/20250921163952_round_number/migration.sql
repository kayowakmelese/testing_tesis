/*
  Warnings:

  - You are about to drop the column `is_active` on the `user_status` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."games" ADD COLUMN     "roundNumber" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "public"."user_status" DROP COLUMN "is_active";
