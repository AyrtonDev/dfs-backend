CREATE TABLE "movies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"original_title" varchar(255),
	"image_url" varchar(255),
	"description" text,
	"release_date" date,
	"duration" integer,
	"genre" varchar(100) NOT NULL,
	"director" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
