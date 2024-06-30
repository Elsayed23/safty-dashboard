-- DropForeignKey
ALTER TABLE `TrainingDetail` DROP FOREIGN KEY `TrainingDetail_created_by_fkey`;

-- AlterTable
ALTER TABLE `TrainingDetail` MODIFY `created_by` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `TrainingDetail` ADD CONSTRAINT `TrainingDetail_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
