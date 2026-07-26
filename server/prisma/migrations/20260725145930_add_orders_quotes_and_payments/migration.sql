/*
  Warnings:

  - You are about to alter the column `total` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `status` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `Enum(EnumId(2))`.
  - A unique constraint covering the columns `[reference]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[quoteId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[reference]` on the table `Quote` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `reference` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtotal` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productName` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reference` to the `Quote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Quote` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `OrderItem` DROP FOREIGN KEY `OrderItem_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `OrderItem` DROP FOREIGN KEY `OrderItem_productId_fkey`;

-- AlterTable
ALTER TABLE `Order` ADD COLUMN `approvedAt` DATETIME(3) NULL,
    ADD COLUMN `billingCompany` VARCHAR(191) NULL,
    ADD COLUMN `billingPhone` VARCHAR(191) NULL,
    ADD COLUMN `cancellationReason` TEXT NULL,
    ADD COLUMN `cancelledAt` DATETIME(3) NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `customerNote` TEXT NULL,
    ADD COLUMN `deliveredAt` DATETIME(3) NULL,
    ADD COLUMN `discount` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    ADD COLUMN `estimatedShippingAt` DATETIME(3) NULL,
    ADD COLUMN `paidAt` DATETIME(3) NULL,
    ADD COLUMN `paymentStatus` ENUM('NOT_STARTED', 'PENDING', 'PARTIALLY_PAID', 'PAID', 'FAILED', 'CANCELLED', 'PARTIALLY_REFUNDED', 'REFUNDED') NOT NULL DEFAULT 'NOT_STARTED',
    ADD COLUMN `printingStartedAt` DATETIME(3) NULL,
    ADD COLUMN `quoteId` INTEGER NULL,
    ADD COLUMN `readyAt` DATETIME(3) NULL,
    ADD COLUMN `reference` VARCHAR(191) NOT NULL,
    ADD COLUMN `rejectedAt` DATETIME(3) NULL,
    ADD COLUMN `rejectionReason` TEXT NULL,
    ADD COLUMN `shippedAt` DATETIME(3) NULL,
    ADD COLUMN `shippingCompany` VARCHAR(191) NULL,
    ADD COLUMN `shippingCost` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    ADD COLUMN `subtotal` DECIMAL(10, 2) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `total` DECIMAL(10, 2) NOT NULL,
    MODIFY `status` ENUM('REQUESTED', 'UNDER_REVIEW', 'NEEDS_INFORMATION', 'APPROVED', 'AWAITING_PAYMENT', 'PARTIALLY_PAID', 'PAID', 'PRINTING', 'READY', 'SHIPPED', 'DELIVERED', 'REJECTED', 'CANCELLED') NOT NULL DEFAULT 'REQUESTED';

-- AlterTable
ALTER TABLE `OrderItem` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `productImage` VARCHAR(191) NULL,
    ADD COLUMN `productName` VARCHAR(191) NOT NULL,
    ADD COLUMN `productSlug` VARCHAR(191) NULL,
    MODIFY `price` DECIMAL(10, 2) NOT NULL,
    MODIFY `productId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Product` MODIFY `price` DECIMAL(10, 2) NOT NULL;

-- AlterTable
ALTER TABLE `Quote` ADD COLUMN `acceptedAt` DATETIME(3) NULL,
    ADD COLUMN `adminNote` TEXT NULL,
    ADD COLUMN `attachmentUrl` TEXT NULL,
    ADD COLUMN `balanceAmount` DECIMAL(10, 2) NULL,
    ADD COLUMN `cancelledAt` DATETIME(3) NULL,
    ADD COLUMN `depositAmount` DECIMAL(10, 2) NULL,
    ADD COLUMN `depositPercentage` INTEGER NULL,
    ADD COLUMN `description` TEXT NULL,
    ADD COLUMN `discount` DECIMAL(10, 2) NULL DEFAULT 0,
    ADD COLUMN `expiredAt` DATETIME(3) NULL,
    ADD COLUMN `phone` VARCHAR(191) NULL,
    ADD COLUMN `reference` VARCHAR(191) NOT NULL,
    ADD COLUMN `rejectedAt` DATETIME(3) NULL,
    ADD COLUMN `rejectionReason` TEXT NULL,
    ADD COLUMN `sentAt` DATETIME(3) NULL,
    ADD COLUMN `shippingCost` DECIMAL(10, 2) NULL DEFAULT 0,
    ADD COLUMN `status` ENUM('PENDING', 'UNDER_REVIEW', 'NEEDS_INFORMATION', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED', 'CONVERTED_TO_ORDER', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    ADD COLUMN `subtotal` DECIMAL(10, 2) NULL,
    ADD COLUMN `title` VARCHAR(191) NULL,
    ADD COLUMN `total` DECIMAL(10, 2) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `userId` INTEGER NULL,
    ADD COLUMN `validUntil` DATETIME(3) NULL,
    MODIFY `message` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `User` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- CreateTable
CREATE TABLE `Payment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `reference` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'EUR',
    `type` ENUM('FULL_PAYMENT', 'DEPOSIT', 'BALANCE', 'ADDITIONAL_PAYMENT') NOT NULL,
    `provider` ENUM('STRIPE', 'PAYPAL') NOT NULL,
    `method` ENUM('CARD', 'KLARNA', 'PAYPAL', 'PAYPAL_PAY_LATER') NULL,
    `status` ENUM('PENDING', 'REQUIRES_ACTION', 'AUTHORIZED', 'PROCESSING', 'PAID', 'FAILED', 'CANCELLED', 'EXPIRED', 'PARTIALLY_REFUNDED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    `providerPaymentId` VARCHAR(191) NULL,
    `providerSessionId` VARCHAR(191) NULL,
    `providerCaptureId` VARCHAR(191) NULL,
    `providerRefundId` VARCHAR(191) NULL,
    `checkoutUrl` TEXT NULL,
    `failureCode` VARCHAR(191) NULL,
    `failureMessage` TEXT NULL,
    `authorizedAt` DATETIME(3) NULL,
    `paidAt` DATETIME(3) NULL,
    `failedAt` DATETIME(3) NULL,
    `cancelledAt` DATETIME(3) NULL,
    `refundedAt` DATETIME(3) NULL,
    `expiresAt` DATETIME(3) NULL,
    `metadata` JSON NULL,
    `orderId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Payment_reference_key`(`reference`),
    UNIQUE INDEX `Payment_providerPaymentId_key`(`providerPaymentId`),
    UNIQUE INDEX `Payment_providerSessionId_key`(`providerSessionId`),
    UNIQUE INDEX `Payment_providerCaptureId_key`(`providerCaptureId`),
    UNIQUE INDEX `Payment_providerRefundId_key`(`providerRefundId`),
    INDEX `Payment_orderId_idx`(`orderId`),
    INDEX `Payment_status_idx`(`status`),
    INDEX `Payment_provider_idx`(`provider`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Order_reference_key` ON `Order`(`reference`);

-- CreateIndex
CREATE UNIQUE INDEX `Order_quoteId_key` ON `Order`(`quoteId`);

-- CreateIndex
CREATE INDEX `Order_status_idx` ON `Order`(`status`);

-- CreateIndex
CREATE INDEX `Order_paymentStatus_idx` ON `Order`(`paymentStatus`);

-- CreateIndex
CREATE UNIQUE INDEX `Quote_reference_key` ON `Quote`(`reference`);

-- CreateIndex
CREATE INDEX `Quote_userId_idx` ON `Quote`(`userId`);

-- CreateIndex
CREATE INDEX `Quote_status_idx` ON `Quote`(`status`);

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_quoteId_fkey` FOREIGN KEY (`quoteId`) REFERENCES `Quote`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Quote` ADD CONSTRAINT `Quote_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `Address` RENAME INDEX `Address_userId_fkey` TO `Address_userId_idx`;

-- RenameIndex
ALTER TABLE `Order` RENAME INDEX `Order_userId_fkey` TO `Order_userId_idx`;

-- RenameIndex
ALTER TABLE `OrderItem` RENAME INDEX `OrderItem_orderId_fkey` TO `OrderItem_orderId_idx`;

-- RenameIndex
ALTER TABLE `OrderItem` RENAME INDEX `OrderItem_productId_fkey` TO `OrderItem_productId_idx`;

-- RenameIndex
ALTER TABLE `Product` RENAME INDEX `Product_categoryId_fkey` TO `Product_categoryId_idx`;
