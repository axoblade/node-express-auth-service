/*
  Warnings:

  - You are about to drop the column `name` on the `user` table. All the data in the column will be lost.
  - Added the required column `first_name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `emailverificationtoken` DROP FOREIGN KEY `EmailVerificationToken_userId_fkey`;

-- DropForeignKey
ALTER TABLE `passwordresettoken` DROP FOREIGN KEY `PasswordResetToken_userId_fkey`;

-- DropForeignKey
ALTER TABLE `userrole` DROP FOREIGN KEY `UserRole_userId_fkey`;

-- DropForeignKey
ALTER TABLE `usertag` DROP FOREIGN KEY `UserTag_userId_fkey`;

-- DropIndex
DROP INDEX `EmailVerificationToken_userId_fkey` ON `emailverificationtoken`;

-- DropIndex
DROP INDEX `PasswordResetToken_userId_fkey` ON `passwordresettoken`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `name`,
    ADD COLUMN `account_number` VARCHAR(191) NULL,
    ADD COLUMN `address` VARCHAR(191) NULL,
    ADD COLUMN `first_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `gender` VARCHAR(191) NOT NULL,
    ADD COLUMN `initials` VARCHAR(191) NULL,
    ADD COLUMN `last_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `middle_name` VARCHAR(191) NULL,
    ADD COLUMN `mobile_money_number` VARCHAR(191) NULL,
    ADD COLUMN `name_of_bank` VARCHAR(191) NULL,
    ADD COLUMN `registered_name` VARCHAR(191) NULL,
    ADD COLUMN `role` VARCHAR(191) NOT NULL,
    ADD COLUMN `salary` VARCHAR(191) NULL,
    ADD COLUMN `section` VARCHAR(191) NULL,
    ADD COLUMN `staff_photo` VARCHAR(191) NULL,
    ADD COLUMN `utility` VARCHAR(191) NULL,
    MODIFY `emailVerified` BOOLEAN NOT NULL DEFAULT true;
