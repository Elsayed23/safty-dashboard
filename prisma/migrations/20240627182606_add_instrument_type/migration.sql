/*
  Warnings:

  - Added the required column `typeId` to the `Instrument` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Instrument` ADD COLUMN `typeId` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `InstrumentType` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Instrument` ADD CONSTRAINT `Instrument_typeId_fkey` FOREIGN KEY (`typeId`) REFERENCES `InstrumentType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
