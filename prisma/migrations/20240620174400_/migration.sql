-- DropForeignKey
ALTER TABLE `event` DROP FOREIGN KEY `event_addressId_fkey`;

-- AlterTable
ALTER TABLE `event` MODIFY `addressId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `event` ADD CONSTRAINT `event_addressId_fkey` FOREIGN KEY (`addressId`) REFERENCES `address`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
