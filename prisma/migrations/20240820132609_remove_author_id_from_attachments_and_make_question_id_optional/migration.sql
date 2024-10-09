/*
  Warnings:

  - You are about to drop the column `author_id` on the `attachments` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "attachments" DROP CONSTRAINT "attachments_question_id_fkey";

-- AlterTable
ALTER TABLE "attachments" DROP COLUMN "author_id",
ALTER COLUMN "question_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
