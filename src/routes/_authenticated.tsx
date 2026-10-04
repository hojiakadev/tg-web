import { createFileRoute, redirect } from '@tanstack/react-router';

import Session from '@/layouts/Session';
import * as Auth from '@/modules/auth';

/** States in which Telegram data cannot be used and the user has to sign in first. */
const SIGNED_OUT: Auth.Types.IEntity.State[] = ['notAuthorized', 'pendingPassword'];

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context }) => {
    const state = await context.queryClient
      .ensureQueryData(Auth.Hooks.instanceStateQuery)
      .catch((): Auth.Types.IEntity.State => 'notAuthorized');

    if (SIGNED_OUT.includes(state)) throw redirect({ to: '/login' });
  },
  component: Session
});
