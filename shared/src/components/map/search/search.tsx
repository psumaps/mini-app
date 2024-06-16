import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import httpClient from '../../../network/httpClient';
import { PopUpState } from './searchUtils';
import Poi from '../../../network/models/mapi/poi';
import { StorageContext } from '../../../models/storage';
import SearchHistory from '~/src/models/searchHistory';
import SearchEntry from './searchEntry';
import SearchResult from './searchResult';
import AmenityIcon from './amenityIcon';
import Button from '../../common/button';

const queryOptions = {
  staleTime: 1000 * 60 * 5,
  refetchOnWindowFocus: false,
};

const Search = ({
  entry,
  state,
  onSelect,
  selectedPoi,
}: {
  entry: string | null;
  state: PopUpState;
  onSelect?: (poi: Poi) => void;
  selectedPoi: Poi | null;
}) => {
  const queryClient = useQueryClient();
  const storage = useContext(StorageContext);
  const [selectedAmenity, setSelectedAmenity] = useState<string | null>(null);
  const search = useQuery(
    {
      queryKey: ['search', entry],
      queryFn: async () => httpClient.mapi.search(entry!),
      enabled: !!entry && state === 'opened',
      ...queryOptions,
    },
    queryClient,
  );
  const amenities = useQuery({
    queryKey: ['amenities'],
    queryFn: async () => httpClient.mapi.getAmenityList(),
    ...queryOptions,
    enabled: state === 'opened',
  });
  const amenityPois = useQuery({
    queryKey: ['amenity-pois', selectedAmenity],
    queryFn: async () => httpClient.mapi.getPoiByAmenity(selectedAmenity),
    enabled: !!selectedAmenity && state === 'opened',
    ...queryOptions,
  });
  const history = useQuery<SearchHistory>(
    {
      queryKey: ['history'],
      queryFn: async () => {
        if (!storage) return {};
        const data = await storage.get('history');
        return data ? (JSON.parse(data) as SearchHistory) : {};
      },
      ...queryOptions,
    },
    queryClient,
  );

  const historyArr = Object.keys(history.data ?? {}).sort(
    (a, b) => history.data![b].timestamp - history.data![a].timestamp,
  );
  const [amenitiesGridStyle, setAmenitiesGridStyle] = useState('');

  const entryPresent = (entry?.length ?? 0) > 0;
  const amenityPresent = (amenityPois.data?.length ?? 0) > 0;
  const searchInProgress = entryPresent || amenityPresent;

  const updateHistory = useCallback(
    async (poi: Poi) => {
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
    },
    [history, storage, queryClient],
  );

  const handlePoiClick = (poi: Poi) => {
    onSelect?.(poi);
  };

  const handleAmenityReset = useCallback(() => {
    setSelectedAmenity(null);
    setAmenitiesGridStyle('');
  }, []);

  useEffect(() => {
    if (selectedPoi === null) return;
    void updateHistory(selectedPoi);
    handleAmenityReset();
  }, [selectedPoi, updateHistory, handleAmenityReset]);

  const handleAmenityClick = (amenity: string, index: number) => {
    setSelectedAmenity(amenity);
    switch (index % 3) {
      case 0:
        setAmenitiesGridStyle('grid-cols-[1fr_0fr_0fr_!important]');
        break;
      case 1:
        setAmenitiesGridStyle('grid-cols-[0fr_1fr_0fr_!important]');
        break;
      case 2:
        setAmenitiesGridStyle('grid-cols-[0fr_0fr_1fr_!important]');
        break;
      default:
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="relative">
        <div
          className={`grid grid-cols-[1fr_1fr_1fr] gap-x-2 gap-y-8 h-fit transition-all duration-200 ease-in-out flex-auto
          ${amenityPresent || selectedPoi ? 'gap-[0_!important] justify-end' : ''}
          ${amenitiesGridStyle}`}
        >
          {amenities.data &&
            amenities.data
              .filter((value, index, array) => array.indexOf(value) === index) // only unique
              .map((amenity, i) => (
                <AmenityIcon
                  key={amenity}
                  amenity={amenity}
                  handleAmenityClick={(a) => handleAmenityClick(a, i)}
                  className={`${selectedAmenity === amenity ? 'w-fit h-fit' : ''}`}
                  classNameInner={`transition-all duration-200 ease-in-out origin-top-left
                    ${amenityPresent && (selectedAmenity === amenity ? '' : 'h-0 w-0 opacity-0')}
                    ${selectedPoi ? 'w-0 h-0 opacity-0' : ''}`}
                />
              ))}
        </div>
        <Button
          onClick={handleAmenityReset}
          variant="accent"
          className={`px-4 py-2 h-fit rounded-full scale-100 active:scale-90 transition-all duration-200 ease-in-out absolute 
            ${amenityPresent ? 'opacity-100 right-0 top-1/2 -translate-y-1/2 ' : 'scale-x-0 opacity-0 right-[-100%] top-0'}`}
        >
          Сбросить
        </Button>
      </div>
      <p className="text-c_secondary dark:text-cd_secondary my-4">
        {searchInProgress ? 'Результаты поиска' : 'История'}
      </p>
      <div className="flex flex-col gap-4">
        {searchInProgress ? (
          <SearchResult
            data={amenityPois.data ?? search.data ?? []}
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
