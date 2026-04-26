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

declare module '*.svg?component' {
  import type { FunctionalComponent, SVGAttributes } from 'vue';
  const component: FunctionalComponent<SVGAttributes>;
  export default component;
}

declare module '*.svg?url' {
  const src: string;
  export default src;
}

declare module '*.svg?raw' {
  const src: string;
  export default src;
}
