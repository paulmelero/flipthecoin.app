import { deleteCommentsUser } from '#comments/server';

// Self-service account deletion (GDPR Art. 17). Two steps, in order:
//   1. erase the comments-domain PII (comments, reactions, name/avatar snapshots)
//   2. delete the Better Auth user (sessions/accounts cascade)
//
// Better Auth's self `deleteUser` requires a session newer than
// `session.freshAge` (default 1 day). We gate on that *before* erasing anything
// so a stale session never leaves a half-deleted state.
export default defineEventHandler(async (event) => {
  const { user, session } = await requireUserSession(event);
  const auth = serverAuth(event);

  const freshAge = auth.options?.session?.freshAge ?? 60 * 60 * 24;
  const ageSeconds =
    (Date.now() - new Date(session.createdAt).getTime()) / 1000;
  if (freshAge > 0 && ageSeconds >= freshAge) {
    throw createError({
      statusCode: 409,
      statusMessage: 'session_expired',
      data: { code: 'session_expired' },
    });
  }

  const erased = await deleteCommentsUser(event, user.id);

  await auth.api.deleteUser({ body: {}, headers: getRequestHeaders(event) });

  return { ok: true, erased };
});
