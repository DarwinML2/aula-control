/*
  Warnings:

  - You are about to drop the column `userId` on the `students` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `students` DROP FOREIGN KEY `students_userId_fkey`;

-- AlterTable
ALTER TABLE `students` DROP COLUMN `userId`;
