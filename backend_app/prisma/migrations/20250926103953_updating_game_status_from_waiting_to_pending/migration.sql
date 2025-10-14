/*
  Warnings:

  - The values [WAITING] on the enum `GAME_STATUS` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."GAME_STATUS_new" AS ENUM ('PENDING', 'ACTIVE', 'FINISHED');
ALTER TABLE "public"."games" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."games" ALTER COLUMN "status" TYPE "public"."GAME_STATUS_new" USING ("status"::text::"public"."GAME_STATUS_new");
ALTER TYPE "public"."GAME_STATUS" RENAME TO "GAME_STATUS_old";
ALTER TYPE "public"."GAME_STATUS_new" RENAME TO "GAME_STATUS";
DROP TYPE "public"."GAME_STATUS_old";
ALTER TABLE "public"."games" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "public"."game_config" ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '1 day';

-- AlterTable
ALTER TABLE "public"."games" ALTER COLUMN "status" SET DEFAULT 'PENDING';
