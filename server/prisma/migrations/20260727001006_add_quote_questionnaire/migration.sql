-- CreateTable
CREATE TABLE `QuoteQuestion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `label` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `type` ENUM('TEXT', 'TEXTAREA', 'SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'BOOLEAN', 'NUMBER', 'FILE') NOT NULL,
    `options` JSON NULL,
    `isRequired` BOOLEAN NOT NULL DEFAULT false,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `position` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `QuoteQuestion_isActive_position_idx`(`isActive`, `position`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `QuoteAnswer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `value` JSON NOT NULL,
    `quoteId` INTEGER NOT NULL,
    `questionId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `QuoteAnswer_quoteId_idx`(`quoteId`),
    INDEX `QuoteAnswer_questionId_idx`(`questionId`),
    UNIQUE INDEX `QuoteAnswer_quoteId_questionId_key`(`quoteId`, `questionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `QuoteAnswer` ADD CONSTRAINT `QuoteAnswer_quoteId_fkey` FOREIGN KEY (`quoteId`) REFERENCES `Quote`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuoteAnswer` ADD CONSTRAINT `QuoteAnswer_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `QuoteQuestion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
