import type { H3Event } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
  try {
    const body = await readBody(event);

    // Input validation
    if (!body.email || !body.email.includes('@')) {
      throw createError({
        statusCode: 400,
        message: 'Invalid email address',
      });
    }

    const KV =
      event.context.cloudflare.env[
        import.meta.env.NODE_ENV === 'development'
          ? 'flipthecoin-app-flipthecoin_emails_list_local'
          : 'flipthecoin_emails_list'
      ];

    await KV?.put('email', body.email).then(console.log);

    return {
      message: 'Subscribed',
    };
  } catch (error: any) {
    // Log the error server-side
    console.error('Newsletter subscription error:', error);

    // Return a proper error response
    throw createError({
      statusCode: error?.statusCode || 500,
      message: error?.message || 'Something went wrong while subscribing',
    });
  }
});
