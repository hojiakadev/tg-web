import { queryOptions, useQuery } from '@tanstack/react-query';

import * as Api from '../api';
import { QUERY_KEYS } from '../constants';
import * as Mappers from '../mappers';

/** Shared by the hook and the route guards (`queryClient.ensureQueryData`). */
export const instanceStateQuery = queryOptions({
  queryKey: QUERY_KEYS.state,
  queryFn: async () => {
    const { data } = await Api.State();
    return Mappers.State(data);
  },
  staleTime: 30_000
});

interface IProps {
  refetchInterval?: number | false;
}

/** Telegram session state of the Green-API instance. */
const useInstanceState = ({ refetchInterval = false }: IProps = {}) => {
  const { data, ...args } = useQuery({ ...instanceStateQuery, refetchInterval });
  return { ...args, data };
};

export default useInstanceState;
