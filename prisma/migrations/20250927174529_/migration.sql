/*
  Warnings:

  - You are about to drop the column `createAt` on the `task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."task" DROP COLUMN "createAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
