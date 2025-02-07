import {
  CfProperties,
  Request,
  ExecutionContext,
  KVNamespace,
} from '@cloudflare/workers-types';

declare module 'h3' {
  interface H3EventContext {
    cf: CfProperties;
    cloudflare: {
      request: Request;
      env: {
        flipthecoin_emails_list: KVNamespace;
        'flipthecoin-app-flipthecoin_emails_list_local': KVNamespace;
      };
      context: ExecutionContext;
    };
  }
}
