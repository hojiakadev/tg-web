import { Outlet, useSearch } from '@tanstack/react-router';

import * as Notifications from '@/modules/notifications';

/** Wraps every signed-in screen: keeps one live notifications listener for the whole session. */
const Session = () => {
  const { chatId } = useSearch({ strict: false });
  Notifications.Hooks.useListener(chatId);

  return <Outlet />;
};

export default Session;
