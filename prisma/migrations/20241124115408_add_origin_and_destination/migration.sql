/*
  Warnings:

  - Added the required column `destination` to the `Delivery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `origin` to the `Delivery` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Delivery" ADD COLUMN     "destination" TEXT NOT NULL,
ADD COLUMN     "origin" TEXT NOT NULL;
