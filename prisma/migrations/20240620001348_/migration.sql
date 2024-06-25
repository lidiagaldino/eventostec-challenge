/*
  Warnings:

  - You are about to alter the column `discount` on the `coupon` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `coupon` MODIFY `discount` INTEGER NOT NULL;
