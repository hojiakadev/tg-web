import { createFileRoute, redirect } from '@tanstack/react-router';

import * as Auth from '@/modules/auth';
import Login from '@/pages/Auth/Login';

export const Route = createFileRoute('/login')({
  beforeLoad: async ({ context }) => {
    const state = await context.queryClient.ensureQueryData(Auth.Hooks.instanceStateQuery).catch(() => undefined);
    if (state === 'authorized') throw redirect({ to: '/' });
  },
  component: Login
});
