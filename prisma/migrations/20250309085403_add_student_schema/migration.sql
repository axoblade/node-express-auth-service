-- CreateTable
CREATE TABLE `Student` (
    `id` VARCHAR(191) NOT NULL,
    `first_name` VARCHAR(191) NOT NULL,
    `middle_name` VARCHAR(191) NULL,
    `last_name` VARCHAR(191) NOT NULL,
    `gender` VARCHAR(191) NOT NULL,
    `dob` DATETIME(3) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `class_assigned` VARCHAR(191) NOT NULL,
    `lin_number` VARCHAR(191) NULL,
    `religion` VARCHAR(191) NOT NULL,
    `program` VARCHAR(191) NOT NULL,
    `bursary` BOOLEAN NOT NULL,
    `half_bursary` BOOLEAN NOT NULL,
    `fees_for_program` VARCHAR(191) NOT NULL,
    `school_pay_code` VARCHAR(191) NULL,
    `school_fees_Charged` VARCHAR(191) NULL,
    `discount_fees` VARCHAR(191) NULL,
    `stationary_amount` VARCHAR(191) NULL,
    `fees_payable` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `student_photo` VARCHAR(191) NULL,
    `guardian1_name` VARCHAR(191) NULL,
    `guardian1_relationship` VARCHAR(191) NULL,
    `guardian1_phone1` VARCHAR(191) NULL,
    `guardian2_name` VARCHAR(191) NULL,
    `guardian2_relationship` VARCHAR(191) NULL,
    `guardian2_phone1` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdby` VARCHAR(191) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `updatedby` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_createdby_fkey` FOREIGN KEY (`createdby`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_updatedby_fkey` FOREIGN KEY (`updatedby`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
