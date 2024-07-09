-- AlterTable
ALTER TABLE `UserViolationApproval` MODIFY `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `GeneralData` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `supervisorId` VARCHAR(191) NOT NULL,
    `siteManagerId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `GeneralData` ADD CONSTRAINT `GeneralData_supervisorId_fkey` FOREIGN KEY (`supervisorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GeneralData` ADD CONSTRAINT `GeneralData_siteManagerId_fkey` FOREIGN KEY (`siteManagerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
