/// <reference types="vite-plugin-svgr/client" />

import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Calendar from './calendar';
import EventSearch from './eventSearch';
import httpClient from '../../network/httpClient';
import Filter from '../../network/models/psu-tools/eventFilter';
import EventFiltersModal from './eventFiltersModal';
import Button from '../common/button';
import FilterIcon from '../../assets/filter.svg?react';

const Timetable = () => {
  const queryClient = useQueryClient();
  const [currentFeed, setCurrentFeed] = useState<'events' | 'classes'>(
    'events',
  );
  const [searchValue, setSearchValue] = useState<string>('');
  const [filtersActive, setFiltersActive] = useState<boolean>(false);

  const [filters, setFilters] = useState<Filter[] | null>(null);

  const query = useQuery(
    {
      queryKey: ['filters'],
      queryFn: () => httpClient.psuTools.events.getFilters(),
      staleTime: Infinity,
      retry: 2,
    },
    queryClient,
  );
  useEffect(() => {
    if (query.data) setFilters(query.data);
  }, [query.data]);

  const searchQuery = useQuery(
    {
      queryKey: ['event-search', searchValue],
      queryFn: httpClient.psuTools.events.getEvents,
    },
    queryClient,
  );

  const handleFilterChange = useCallback(
    (
      event: ChangeEvent<HTMLInputElement>,
      filterId: string,
      valueId: string,
    ) => {
      setFilters((prevFilters) => {
        const filterValue = prevFilters
          ?.find((filter) => filter.id === filterId)
          ?.values.find((value) => value.id === valueId);

        if (filterValue) filterValue.isChecked = event.target.checked;
        return [...prevFilters!];
      });
    },
    [],
  );

  return (
    <>
      <Calendar className="h-fit" />
      <div className="flex flex-row gap-4 mt-3">
        <EventSearch
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          className="h-10 flex-auto shadow-md"
        />
        <Button
          className="h-10 w-10 rounded-3xl shadow-md dark:shadow-none"
          variant={
            filters?.some((filter) =>
              filter.values.some((value) => value.isChecked),
            )
              ? 'accent'
              : 'primary'
          }
          onClick={() => setFiltersActive(true)}
        >
          <FilterIcon />
        </Button>
        <EventFiltersModal
          active={filtersActive}
          setActive={setFiltersActive}
          filters={filters}
          setFilters={handleFilterChange}
          query={query}
        />
      </div>
      <div className="flex flex-row gap-4 mt-3">
        <Button
          variant="primary"
          className="rounded-3xl flex-1 h-10 shadow-md dark:shadow-none"
          onClick={() => setCurrentFeed('events')}
        >
          События
        </Button>
        <Button
          variant="primary"
          className="rounded-3xl flex-1 h-10 shadow-md dark:shadow-none"
          onClick={() => setCurrentFeed('classes')}
        >
          Расписание
        </Button>
      </div>
      <div className="relative">
        <div
          className={`absolute top-0 flex flex-col gap-3 ${currentFeed === 'events' ? 'left-0 right-0' : 'right-full -left-full'}`}
        >
          {/* eslint-disable-next-line no-nested-ternary */}
          {searchQuery.isPending ? (
            <p>Загрузка...</p>
          ) : searchQuery.isError ? (
            <p>Ошибка!</p>
          ) : (
            searchQuery.data.map((event) => (
              <h2 key={event.id}>{event.title}</h2>
            ))
          )}
        </div>
        <div
          className={`absolute top-0 flex flex-col gap-3 ${currentFeed === 'classes' ? 'left-0 right-0' : 'left-full -right-full'}`}
        />
      </div>
    </>
  );
};

export default Timetable;
