/*
  Warnings:

  - You are about to drop the column `status` on the `Delivery` table. All the data in the column will be lost.
  - Added the required column `deliveryStatus` to the `Delivery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentStatus` to the `Delivery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scheduledAt` to the `Delivery` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Delivery" DROP COLUMN "status",
ADD COLUMN     "deliveryStatus" TEXT NOT NULL,
ADD COLUMN     "paymentStatus" TEXT NOT NULL,
ADD COLUMN     "scheduledAt" TIMESTAMP(3) NOT NULL;
