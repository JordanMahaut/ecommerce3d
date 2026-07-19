-- AlterTable Category
ALTER TABLE `Category`
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `image` VARCHAR(191) NULL,
    ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `slug` VARCHAR(191) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

UPDATE `Category`
SET `slug` = CONCAT(
    LOWER(REPLACE(TRIM(`name`), ' ', '-')),
    '-',
    `id`
)
WHERE `slug` IS NULL;

ALTER TABLE `Category`
    MODIFY `slug` VARCHAR(191) NOT NULL;

-- AlterTable Product
ALTER TABLE `Product`
    ADD COLUMN `featured` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `gallery` JSON NULL,
    ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `slug` VARCHAR(191) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

UPDATE `Product`
SET `slug` = CONCAT(
    LOWER(REPLACE(TRIM(`name`), ' ', '-')),
    '-',
    `id`
)
WHERE `slug` IS NULL;

ALTER TABLE `Product`
    MODIFY `slug` VARCHAR(191) NOT NULL;

CREATE UNIQUE INDEX `Category_slug_key`
ON `Category`(`slug`);

CREATE UNIQUE INDEX `Product_slug_key`
ON `Product`(`slug`);