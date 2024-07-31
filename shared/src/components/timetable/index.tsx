/// <reference types="vite-plugin-svgr/client" />

import React, {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import Calendar from './calendar';
import EventSearch from './eventSearch';
import httpClient from '../../network/httpClient';
import Filter from '../../network/models/psu-tools/eventFilter';
import EventFiltersModal from './eventFiltersModal';
import Button from '../common/button';
import FilterIcon from '../../assets/filter.svg?react';
import EventListCard from './eventListCard';
import TimetableCard from './timetableCard';
import { NavigatorContext } from '../../models/navigator';
import useAnimEnabled from '../../hooks/useAnimEnabled';
import { StorageContext } from '../../models/storage';
import {
  GROUP_INFO_KEY,
  GroupData,
} from '../settings/groupChooser/groupChooserUtils';

const EVENTS_LIMIT = 10;

const Timetable = () => {
  const navigator = useContext(NavigatorContext);
  const storage = useContext(StorageContext);
  const { data: animEnabled } = useAnimEnabled();
  const queryClient = useQueryClient();
  const [currentFeed, setCurrentFeed] = useState<'events' | 'classes'>(
    'events',
  );
  const [searchValue, setSearchValue] = useState<string>('');
  const [filtersActive, setFiltersActive] = useState<boolean>(false);
  const [dateFrom, setDateFrom] = useState<Date>(new Date());

  const [filters, setFilters] = useState<Filter[] | null>(null);

  const filtersQuery = useQuery(
    {
      queryKey: ['filters'],
      queryFn: () => httpClient.psuTools.events.getFilters(),
      staleTime: Infinity,
      retry: 2,
    },
    queryClient,
  );
  useEffect(() => {
    if (filtersQuery.data) setFilters(filtersQuery.data);
  }, [filtersQuery.data]);

  const eventsQuery = useInfiniteQuery(
    {
      queryKey: ['event-search', searchValue, dateFrom],
      queryFn: (params) =>
        httpClient.psuTools.events.getEvents({
          dateFrom,
          offset: params.pageParam,
          limit: EVENTS_LIMIT,
        }),
      gcTime: 10 * 60 * 1000,
      staleTime: 5 * 60 * 1000,
      initialPageParam: 0,
      getNextPageParam: (lastPage, _, lastPageParam) => {
        if (lastPage.length < EVENTS_LIMIT) {
          return undefined;
        }
        return lastPageParam + 1;
      },
      enabled: currentFeed === 'events',
    },
    queryClient,
  );

  const groupInfoQuery = useQuery<GroupData>(
    {
      queryKey: [GROUP_INFO_KEY],
      queryFn: async () =>
        JSON.parse((await storage?.get(GROUP_INFO_KEY)) ?? '') as GroupData,
    },
    queryClient,
  );

  const classesQuery = useQuery(
    {
      queryKey: ['classes'],
      queryFn: () =>
        httpClient.psuTools.timetable.getGroupTimetable(
          groupInfoQuery.data!.groupId ?? 1010,
        ),
      enabled: !groupInfoQuery.isPending && currentFeed === 'classes',
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

  const handleDateChange = (date: Date) => {
    setDateFrom(date);
  };

  return (
    <>
      <Calendar
        className="h-fit"
        onChange={(date) => date instanceof Date && handleDateChange(date)}
      />
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
          query={filtersQuery}
        />
      </div>
      <div className="flex flex-row gap-4 mt-3">
        <Button
          variant={currentFeed === 'events' ? 'contrast' : 'primary'}
          className="rounded-3xl flex-1 h-10 shadow-md dark:shadow-none"
          onClick={() => setCurrentFeed('events')}
        >
          События
        </Button>
        <Button
          variant={currentFeed === 'classes' ? 'contrast' : 'primary'}
          className="rounded-3xl flex-1 h-10 shadow-md dark:shadow-none"
          onClick={() => setCurrentFeed('classes')}
        >
          Расписание
        </Button>
      </div>
      <div className="relative mt-3">
        <div
          className={`absolute top-0 flex flex-col gap-3 pb-3 origin-top
            ${animEnabled && 'transition-all duration-500 ease-in-out'}
            ${currentFeed === 'events' ? 'left-0 right-0 scale-y-100 opacity-100' : ' opacity-0 scale-y-0 mr-10 right-full -left-full'}`}
        >
          {/* eslint-disable-next-line no-nested-ternary */}
          {eventsQuery.isPending ? (
            <p>Загрузка...</p>
          ) : eventsQuery.isError ? (
            <p>Ошибка!</p>
          ) : (
            <>
              {eventsQuery.data.pages.map(
                (page) =>
                  page[0] && (
                    <React.Fragment key={page[0].id}>
                      {page
                        .sort((a, b) =>
                          new Date(a.startDatetime) < new Date(b.startDatetime)
                            ? -1
                            : 1,
                        )
                        .map((event) => (
                          <EventListCard
                            key={event.id}
                            event={event}
                            onOpenDesc={() =>
                              navigator?.navigate(`/event/${event.id}`)
                            }
                          />
                        ))}
                    </React.Fragment>
                  ),
              )}
              <Button
                variant="primary"
                className="w-full rounded-3xl py-2"
                disabled={
                  !eventsQuery.hasNextPage || eventsQuery.isFetchingNextPage
                }
                onClick={() => void eventsQuery.fetchNextPage()}
              >
                Загрузить еще
              </Button>
            </>
          )}
        </div>
        <div
          className={`absolute top-0 flex flex-col gap-3 pb-3 origin-top
            ${animEnabled && 'transition-all duration-500 ease-in-out'}
            ${currentFeed === 'classes' ? 'left-0 right-0 scale-y-100 opacity-100' : 'opacity-0 scale-y-0 ml-10 left-full -right-full'}`}
        >
          {/* eslint-disable-next-line no-nested-ternary */}
          {classesQuery.isPending ? (
            <p>Загрузка...</p>
          ) : classesQuery.isError ? (
            <p>Ошибка!</p>
          ) : (
            classesQuery.data.days.map((day) => (
              <React.Fragment key={day.date}>
                {day.classes.map((lesson) => (
                  <TimetableCard
                    key={`${day.date}-${lesson.classNumber}`}
                    classDate={day}
                    classData={lesson}
                  />
                ))}
              </React.Fragment>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Timetable;
