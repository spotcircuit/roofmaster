import { StackHandler, StackServerApp } from '@stackframe/stack';

const stackServerApp = new StackServerApp({
  projectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID!,
  publishableClientKey: process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY!,
  secretServerKey: process.env.STACK_SECRET_SERVER_KEY!,
  tokenStore: 'nextjs-cookie',
});

export default function Handler(props: any) {
  return (
    <StackHandler
      fullPage
      app={stackServerApp}
      routeProps={props}
    />
  );
}