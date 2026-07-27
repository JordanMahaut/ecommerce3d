/*
  Warnings:

  - Added the required column `customerEmail` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingMethod` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Order` ADD COLUMN `customerEmail` VARCHAR(191) NOT NULL,
    ADD COLUMN `relayPointId` VARCHAR(191) NULL,
    ADD COLUMN `relayPointName` VARCHAR(191) NULL,
    ADD COLUMN `shippingMethod` ENUM('COLISSIMO', 'MONDIAL_RELAY', 'CHRONOPOST', 'PICKUP') NOT NULL;

-- AlterTable
ALTER TABLE `Quote` ADD COLUMN `processingMaxDays` INTEGER NULL,
    ADD COLUMN `processingMinDays` INTEGER NULL;

-- CreateIndex
CREATE INDEX `Order_shippingMethod_idx` ON `Order`(`shippingMethod`);

-- CreateIndex
CREATE INDEX `Order_createdAt_idx` ON `Order`(`createdAt`);

-- CreateIndex
CREATE INDEX `Quote_createdAt_idx` ON `Quote`(`createdAt`);

-- CreateIndex
CREATE INDEX `Quote_validUntil_idx` ON `Quote`(`validUntil`);
