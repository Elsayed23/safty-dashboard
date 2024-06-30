/*
  Warnings:

  - The primary key for the `Instrument` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Test` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `TestEntry` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `TestEntryCheck` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `TypeOfTest` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `Test` DROP FOREIGN KEY `Test_instrumentId_fkey`;

-- DropForeignKey
ALTER TABLE `Test` DROP FOREIGN KEY `Test_typeOfTestId_fkey`;

-- DropForeignKey
ALTER TABLE `TestEntry` DROP FOREIGN KEY `TestEntry_typeOfTestId_fkey`;

-- DropForeignKey
ALTER TABLE `TestEntryCheck` DROP FOREIGN KEY `TestEntryCheck_testId_fkey`;

-- DropForeignKey
ALTER TABLE `TypeOfTest` DROP FOREIGN KEY `TypeOfTest_instrumentId_fkey`;

-- AlterTable
ALTER TABLE `Instrument` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Test` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `instrumentId` VARCHAR(191) NOT NULL,
    MODIFY `typeOfTestId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `TestEntry` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `typeOfTestId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `TestEntryCheck` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `testId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `TypeOfTest` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `instrumentId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `TypeOfTest` ADD CONSTRAINT `TypeOfTest_instrumentId_fkey` FOREIGN KEY (`instrumentId`) REFERENCES `Instrument`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TestEntry` ADD CONSTRAINT `TestEntry_typeOfTestId_fkey` FOREIGN KEY (`typeOfTestId`) REFERENCES `TypeOfTest`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Test` ADD CONSTRAINT `Test_instrumentId_fkey` FOREIGN KEY (`instrumentId`) REFERENCES `Instrument`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Test` ADD CONSTRAINT `Test_typeOfTestId_fkey` FOREIGN KEY (`typeOfTestId`) REFERENCES `TypeOfTest`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TestEntryCheck` ADD CONSTRAINT `TestEntryCheck_testId_fkey` FOREIGN KEY (`testId`) REFERENCES `Test`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
