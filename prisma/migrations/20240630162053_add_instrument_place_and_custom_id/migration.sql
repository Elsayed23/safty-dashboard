/*
  Warnings:

  - Added the required column `customInstrumentId` to the `Instrument` table without a default value. This is not possible if the table is not empty.
  - Added the required column `place` to the `Instrument` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Instrument` ADD COLUMN `customInstrumentId` VARCHAR(191) NOT NULL,
    ADD COLUMN `place` VARCHAR(191) NOT NULL;
