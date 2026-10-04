import { useQuery } from '@tanstack/react-query';

import * as Api from '../api';
import * as Mappers from '../mappers';
import type * as Types from '../types';

interface IProps {
  enabled?: boolean;
}

const initialData: Types.IQuery.List = { results: [] };

const useList = ({ enabled = true }: IProps = {}) => {
  const { data = initialData, ...args } = useQuery<Types.IQuery.List>({
    queryKey: ['contacts', 'list'],
    queryFn: async () => {
      const { data } = await Api.List();
      return Mappers.List(data);
    },
    staleTime: 5 * 60_000,
    enabled
  });

  return { ...args, data: data.results };
};

export default useList;
