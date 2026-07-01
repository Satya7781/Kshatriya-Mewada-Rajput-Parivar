import { sql } from "drizzle-orm"
import { db } from "@/lib/db"

async function addContactRequests() {
  console.log("📬 Adding contact_requests table...")
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "contact_request_status" AS ENUM('PENDING', 'APPROVED', 'REJECTED');
    EXCEPTION WHEN duplicate_object THEN
      NULL;
    END $$;

    CREATE TABLE IF NOT EXISTS "contact_requests" (
      "id" serial PRIMARY KEY NOT NULL,
      "requester_id" integer NOT NULL,
      "owner_id" integer NOT NULL,
      "status" "contact_request_status" DEFAULT 'PENDING' NOT NULL,
      "created_at" timestamp with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp with time zone DEFAULT now() NOT NULL
    );

    DO $$ BEGIN
      ALTER TABLE "contact_requests"
        ADD CONSTRAINT "contact_requests_requester_id_users_id_fk"
        FOREIGN KEY ("requester_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN
      NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "contact_requests"
        ADD CONSTRAINT "contact_requests_owner_id_users_id_fk"
        FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN
      NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "contact_requests_requester_idx" ON "contact_requests" ("requester_id");
    CREATE INDEX IF NOT EXISTS "contact_requests_owner_idx" ON "contact_requests" ("owner_id");
    CREATE INDEX IF NOT EXISTS "contact_requests_status_idx" ON "contact_requests" ("status");
    CREATE UNIQUE INDEX IF NOT EXISTS "contact_requests_requester_owner_idx"
      ON "contact_requests" ("requester_id", "owner_id");
  `)
  console.log("✅ contact_requests table ready.")
}

addContactRequests().catch((err) => {
  console.error(err)
  process.exit(1)
})
