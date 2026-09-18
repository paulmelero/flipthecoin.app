import Database from 'better-sqlite3';
import { betterAuth } from 'better-auth';
import { Kysely, SqliteDialect } from 'kysely';

// CLI-only config used to compile the Better Auth schema to SQL:
//   pnpm dlx auth@latest generate --config auth.ts --output migrations/0001_auth.sql --yes
// D1 is SQLite, so the schema is generated against in-memory SQLite.
// Keep this in sync with server/auth.config.ts when adding plugins or
// additionalFields (plugins are what change the schema).
export const auth = betterAuth({
  database: {
    db: new Kysely({
      dialect: new SqliteDialect({ database: new Database(':memory:') }),
    }),
    type: 'sqlite',
  },
});
