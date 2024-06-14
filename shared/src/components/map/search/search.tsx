import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import httpClient from '../../../network/httpClient';
import { PopUpState } from './searchUtils';
import detectAmenity from '../../../network/utils/detectAmenity';
import Poi from '~/src/network/models/mapi/poi';

const Search = ({
  entry,
  state,
  onSelect,
}: {
  entry: string | null;
  state: PopUpState;
  onSelect?: (poi: Poi) => void;
}) => {
  const queryClient = useQueryClient();
  const search = useQuery(
    {
      queryKey: ['search', entry],
      queryFn: async () => httpClient.mapi.search(entry!),
      enabled: !!entry && state === 'opened',
      staleTime: 1000 * 60 * 5,
    },
    queryClient,
  );

  return (
    <div className="flex flex-col h-full">
      <p className="text-c_secondary dark:text-cd_secondary my-4">
        Результаты поиска
      </p>
      {search.data?.length === 0 ? (
        <p>Ничего не найдено</p>
      ) : (
        <div className="flex flex-col gap-4">
          {search.data?.map((item) => (
            <button
              type="button"
              key={item.properties.id}
              className="w-full flex flex-col gap-1 cursor-pointer"
              onClick={() => onSelect?.(item)}
            >
              <p className="text-c_accent font-semibold">
                {item.properties.name ?? item.properties.ref ?? 'Без названия'}
              </p>
              <h4>{detectAmenity(item) ?? 'Без категории'}</h4>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
