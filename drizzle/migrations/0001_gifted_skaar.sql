ALTER TABLE "subscribers" DROP CONSTRAINT "subscribers_email_unique";--> statement-breakpoint
ALTER TABLE "subscribers" ADD COLUMN "email_address" varchar(254) NOT NULL;--> statement-breakpoint
ALTER TABLE "subscribers" DROP COLUMN "email";--> statement-breakpoint
ALTER TABLE "subscribers" ADD CONSTRAINT "subscribers_email_address_unique" UNIQUE("email_address");