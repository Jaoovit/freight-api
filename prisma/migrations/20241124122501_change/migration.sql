/*
  Warnings:

  - A unique constraint covering the columns `[taxDocument]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_taxDocument_key" ON "User"("taxDocument");
