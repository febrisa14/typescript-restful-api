/*
  Warnings:

  - You are about to drop the column `contanct_id` on the `addresses` table. All the data in the column will be lost.
  - Added the required column `contact_id` to the `addresses` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `addresses` DROP FOREIGN KEY `addresses_contanct_id_fkey`;

-- AlterTable
ALTER TABLE `addresses` DROP COLUMN `contanct_id`,
    ADD COLUMN `contact_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `addresses` ADD CONSTRAINT `addresses_contact_id_fkey` FOREIGN KEY (`contact_id`) REFERENCES `contacts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
