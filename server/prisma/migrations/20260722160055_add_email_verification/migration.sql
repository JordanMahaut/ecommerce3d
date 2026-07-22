/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Order` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[emailVerificationToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `billingCity` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `billingCountry` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `billingFirstname` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `billingLastname` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `billingPostalCode` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `billingStreet` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingCity` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingCountry` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingFirstname` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingLastname` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingPostalCode` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingStreet` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Category` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `Order` DROP COLUMN `createdAt`,
    ADD COLUMN `billingCity` VARCHAR(191) NOT NULL,
    ADD COLUMN `billingCountry` VARCHAR(191) NOT NULL,
    ADD COLUMN `billingFirstname` VARCHAR(191) NOT NULL,
    ADD COLUMN `billingLastname` VARCHAR(191) NOT NULL,
    ADD COLUMN `billingPostalCode` VARCHAR(191) NOT NULL,
    ADD COLUMN `billingStreet` VARCHAR(191) NOT NULL,
    ADD COLUMN `billingStreet2` VARCHAR(191) NULL,
    ADD COLUMN `shippingCity` VARCHAR(191) NOT NULL,
    ADD COLUMN `shippingCountry` VARCHAR(191) NOT NULL,
    ADD COLUMN `shippingFirstname` VARCHAR(191) NOT NULL,
    ADD COLUMN `shippingLastname` VARCHAR(191) NOT NULL,
    ADD COLUMN `shippingPhone` VARCHAR(191) NULL,
    ADD COLUMN `shippingPostalCode` VARCHAR(191) NOT NULL,
    ADD COLUMN `shippingStreet` VARCHAR(191) NOT NULL,
    ADD COLUMN `shippingStreet2` VARCHAR(191) NULL,
    MODIFY `total` DECIMAL(65, 30) NOT NULL;

-- AlterTable
ALTER TABLE `Product` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `emailVerificationExpires` DATETIME(3) NULL,
    ADD COLUMN `emailVerificationToken` VARCHAR(191) NULL,
    ADD COLUMN `emailVerified` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `Address` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('SHIPPING', 'BILLING') NOT NULL,
    `firstname` VARCHAR(191) NOT NULL,
    `lastname` VARCHAR(191) NOT NULL,
    `company` VARCHAR(191) NULL,
    `street` VARCHAR(191) NOT NULL,
    `street2` VARCHAR(191) NULL,
    `postalCode` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL DEFAULT 'France',
    `phone` VARCHAR(191) NULL,
    `isDefault` BOOLEAN NOT NULL DEFAULT false,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `User_emailVerificationToken_key` ON `User`(`emailVerificationToken`);

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
