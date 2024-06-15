import React, { useContext } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import httpClient from '../../../network/httpClient';
import { PopUpState } from './searchUtils';
import Poi from '../../../network/models/mapi/poi';
import { StorageContext } from '../../../models/storage';
import SearchHistory from '~/src/models/searchHistory';
import SearchEntry from './searchEntry';
import SearchResult from './searchResult';

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
  const storage = useContext(StorageContext);
  const search = useQuery(
    {
      queryKey: ['search', entry],
      queryFn: async () => httpClient.mapi.search(entry!),
      enabled: !!entry && state === 'opened',
      staleTime: 1000 * 60 * 5,
    },
    queryClient,
  );
  const history = useQuery<SearchHistory>({
    queryKey: ['history'],
    queryFn: async () => {
      if (!storage) return {};
      const data = await storage.get('history');
      return data ? (JSON.parse(data) as SearchHistory) : {};
    },
    staleTime: 1000 * 60 * 5,
  });

  const historyArr = Object.keys(history.data ?? {}).sort(
    (a, b) => history.data![b].timestamp - history.data![a].timestamp,
  );

  const entryPresent = (entry?.length ?? 0) > 0;

  const handlePoiClick = async (poi: Poi) => {
    if (!history.data) return;

    let { data } = history;

    if (data[poi.properties.id])
      data[poi.properties.id] = {
        poi,
        timestamp: Date.now(),
      };
    else
      data = {
        ...data,
        [poi.properties.id]: { poi, timestamp: Date.now() },
      };

    if (storage) await storage.set('history', JSON.stringify(data));
    void queryClient.invalidateQueries({ queryKey: ['history'] });

    onSelect?.(poi);
  };

  return (
    <div className="flex flex-col h-full">
      <p className="text-c_secondary dark:text-cd_secondary my-4">
        {entryPresent ? 'Результаты поиска' : 'История'}
      </p>
      <div className="flex flex-col gap-4">
        {entryPresent ? (
          <SearchResult
            data={search.data ?? []}
            handlePoiClick={(poi) => void handlePoiClick(poi)}
          />
        ) : (
          historyArr.map(
            (key) =>
              history.data?.[key] && (
                <SearchEntry
                  key={key}
                  item={history.data[key].poi}
                  onClick={() => void handlePoiClick(history.data[key].poi)}
                />
              ),
          )
        )}
      </div>
    </div>
  );
};

export default Search;
