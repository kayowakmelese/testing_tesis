-- DropForeignKey
ALTER TABLE "public"."user_status" DROP CONSTRAINT "user_status_user_id_fkey";

-- AlterTable
ALTER TABLE "public"."game_config" ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '1 day';

-- AddForeignKey
ALTER TABLE "public"."user_status" ADD CONSTRAINT "user_status_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
