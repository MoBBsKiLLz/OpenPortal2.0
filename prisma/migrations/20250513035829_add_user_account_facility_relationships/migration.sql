-- CreateTable
CREATE TABLE `accounts` (
    `account_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `phone_number` VARCHAR(15) NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `city` VARCHAR(100) NOT NULL,
    `state` VARCHAR(50) NOT NULL,
    `postal_code` VARCHAR(20) NOT NULL,
    `region_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`account_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `facilities` (
    `facility_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `phone_number` VARCHAR(15) NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `city` VARCHAR(100) NOT NULL,
    `state` VARCHAR(50) NOT NULL,
    `postal_code` VARCHAR(20) NOT NULL,
    `account_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`facility_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `regions` (
    `region_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `regions_name_key`(`name`),
    PRIMARY KEY (`region_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_account` (
    `user_account_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `account_id` INTEGER NOT NULL,

    UNIQUE INDEX `user_account_user_id_account_id_key`(`user_id`, `account_id`),
    PRIMARY KEY (`user_account_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_facility` (
    `user_facility_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `facility_id` INTEGER NOT NULL,

    UNIQUE INDEX `user_facility_user_id_facility_id_key`(`user_id`, `facility_id`),
    PRIMARY KEY (`user_facility_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `accounts` ADD CONSTRAINT `accounts_region_id_fkey` FOREIGN KEY (`region_id`) REFERENCES `regions`(`region_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `facilities` ADD CONSTRAINT `facilities_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`account_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_account` ADD CONSTRAINT `user_account_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_account` ADD CONSTRAINT `user_account_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`account_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_facility` ADD CONSTRAINT `user_facility_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_facility` ADD CONSTRAINT `user_facility_facility_id_fkey` FOREIGN KEY (`facility_id`) REFERENCES `facilities`(`facility_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
