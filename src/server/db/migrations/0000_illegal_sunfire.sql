CREATE TABLE `conversation_participants` (
	`conversation_id` text(128),
	`user_id` text(128),
	`joined_at` integer NOT NULL,
	FOREIGN KEY (`conversation_id`) REFERENCES `conversations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `conversations` (
	`id` text(128) PRIMARY KEY NOT NULL,
	`title` text(128),
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `friend_requests` (
	`id` text(128) PRIMARY KEY NOT NULL,
	`sender_id` text(128) NOT NULL,
	`receiver_id` text(128) NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`receiver_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `friendships` (
	`id` text(128) PRIMARY KEY NOT NULL,
	`user_id_1` text(128) NOT NULL,
	`user_id_2` text(128) NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id_1`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id_2`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unique_friendship` ON `friendships` (`user_id_1`,`user_id_2`);--> statement-breakpoint
CREATE TABLE `messages` (
	`id` text(128) PRIMARY KEY NOT NULL,
	`content` text NOT NULL,
	`conversation_id` text(128) NOT NULL,
	`created_by_user_id` text(128) NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`conversation_id`) REFERENCES `conversations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text(128) PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`username` text NOT NULL,
	`display_name` text,
	`profile_image_url` text DEFAULT 'https://github.com/shadcn.png' NOT NULL,
	`email` text NOT NULL,
	`date_of_birth` integer NOT NULL,
	`password_hash` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);