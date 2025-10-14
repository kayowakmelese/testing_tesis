/*
  Warnings:

  - The values [EXPIRED] on the enum `INVITE_STATUS` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."INVITE_STATUS_new" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED');
ALTER TABLE "public"."game_invites" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."game_invites" ALTER COLUMN "status" TYPE "public"."INVITE_STATUS_new" USING ("status"::text::"public"."INVITE_STATUS_new");
ALTER TYPE "public"."INVITE_STATUS" RENAME TO "INVITE_STATUS_old";
ALTER TYPE "public"."INVITE_STATUS_new" RENAME TO "INVITE_STATUS";
DROP TYPE "public"."INVITE_STATUS_old";
ALTER TABLE "public"."game_invites" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "public"."game_config" ADD COLUMN     "round" INTEGER NOT NULL DEFAULT 2,
ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '1 day';
