/*
  Warnings:

  - You are about to drop the column `heigth` on the `Cars` table. All the data in the column will be lost.
  - Added the required column `height` to the `Cars` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cars" DROP COLUMN "heigth",
ADD COLUMN     "height" DOUBLE PRECISION NOT NULL;
