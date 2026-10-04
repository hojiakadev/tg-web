import * as Contacts from '@/modules/contacts';

import * as Mappers from '../mappers';
import type * as Types from '../types';
import useGroup from './useGroup';

/**
 * Real chat title. `getChats` sometimes returns no name (then the id is shown);
 * such titles are fetched from `getContactInfo` (users) or `getGroupData` (groups / channels).
 */
const useTitle = (chat: Pick<Types.IEntity.Chat, 'id' | 'name' | 'type'>, enabled = true) => {
  const untitled = enabled && Mappers.IsUntitled(chat);
  const isGroup = chat.type === 'group' || chat.type === 'channel';

  const group = useGroup(chat.id, untitled && isGroup);
  const user = Contacts.Hooks.useSingle(chat.id, untitled && !isGroup);

  if (!untitled) return chat.name;
  return (isGroup ? group.data?.name : user.data?.name) || chat.name;
};

export default useTitle;
