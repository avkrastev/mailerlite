DROP TABLE IF EXISTS `subscribers`;
CREATE TABLE `subscribers` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`email` VARCHAR(255) NOT NULL,
	`name` VARCHAR(255) NOT NULL,
	`state` TINYINT NOT NULL DEFAULT 1,
	`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
	`updated_at` DATETIME NULL,
	PRIMARY KEY (`id`),
	UNIQUE INDEX `email` (`email`) USING BTREE
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB;

DROP TABLE IF EXISTS `fields`;
CREATE TABLE `fields` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`title` VARCHAR(255) NOT NULL,
	`type` TINYINT NOT NULL DEFAULT 1,
	`description` TEXT NULL,
	`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
	`updated_at` DATETIME NULL,
	PRIMARY KEY (`id`)
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB;

DROP TABLE IF EXISTS `subscriber_fields`;
CREATE TABLE `subscriber_fields` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`subscriber_id` INT(11) NOT NULL,
	`field_id` INT(11) NOT NULL,
	`created_at` DATETIME NOT NULL DEFAULT current_timestamp(),
	`updated_at` DATETIME NULL DEFAULT NULL,
	PRIMARY KEY (`id`) USING BTREE,
	INDEX `field_fk` (`field_id`) USING BTREE,
	INDEX `subsciber_fk` (`subscriber_id`) USING BTREE,
	CONSTRAINT `field_fk` FOREIGN KEY (`field_id`) REFERENCES `mailerlite`.`fields` (`id`) ON UPDATE NO ACTION ON DELETE RESTRICT,
	CONSTRAINT `subscriber_fk` FOREIGN KEY (`subscriber_id`) REFERENCES `mailerlite`.`subscribers` (`id`) ON UPDATE NO ACTION ON DELETE CASCADE
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB;


