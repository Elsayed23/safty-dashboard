/*
  Warnings:

  - You are about to drop the `UserFile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `UserFile` DROP FOREIGN KEY `UserFile_user_id_fkey`;

-- DropTable
DROP TABLE `UserFile`;

-- CreateTable
CREATE TABLE `InstrumentsFiles` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `path` VARCHAR(191) NOT NULL,
    `instrumentId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `InstrumentsFiles` ADD CONSTRAINT `InstrumentsFiles_instrumentId_fkey` FOREIGN KEY (`instrumentId`) REFERENCES `Instrument`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
