-- DropForeignKey
ALTER TABLE `contacts` DROP FOREIGN KEY `contacts_username_fkey`;

-- AddForeignKey
ALTER TABLE `contacts` ADD CONSTRAINT `contacts_username_fkey` FOREIGN KEY (`username`) REFERENCES `users`(`username`) ON DELETE CASCADE ON UPDATE CASCADE;
