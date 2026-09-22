import { defineServerAuth } from '@nuxtjs/better-auth/config';

// Better Auth persistence is configured by `comments.auth.database.binding`
// in nuxt.config.ts (the package registers a D1 provider with
// @nuxtjs/better-auth). Do not set `database` here — the module's provider
// takes precedence and setting both is unsupported.
export default defineServerAuth({
  // Self-service account deletion (profile page). Requires a session newer
  // than the default `session.freshAge` (1 day); stale sessions are prompted
  // to sign in again.
  user: { deleteUser: { enabled: true } },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
});
