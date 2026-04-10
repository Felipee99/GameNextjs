/*
  Warnings:

  - You are about to drop the column `releaseData` on the `Console` table. All the data in the column will be lost.
  - Added the required column `releasedate` to the `Console` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Console" DROP COLUMN "releaseData",
ADD COLUMN     "releasedate" TIMESTAMP(0) NOT NULL;

-- AlterTable
ALTER TABLE "Game" ALTER COLUMN "releasedate" SET DATA TYPE TIMESTAMP(0);
