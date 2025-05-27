ALTER TABLE "Chat" ADD COLUMN "updatedAt" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "name" varchar(64) NOT NULL;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "membership" varchar(64) DEFAULT 'free' NOT NULL;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "stripecustomerid" varchar(256);--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "stripesubscriptionid" varchar(256);--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "previoussubscriptionid" varchar(256);--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "usage" numeric(10, 4) DEFAULT '0.0000' NOT NULL;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "provider" varchar(20) DEFAULT 'credentials' NOT NULL;