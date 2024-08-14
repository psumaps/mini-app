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
import useIcalToken from '../../hooks/useIcalToken';

const EVENTS_LIMIT = 10;

const Timetable = () => {
  const navigator = useContext(NavigatorContext);
  const icalTokenQuery = useIcalToken();
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
          pageNumber: params.pageParam,
          pageSize: EVENTS_LIMIT,
          filters: filters
            ?.filter((f) => f.isChecked)
            .map((f) => parseInt(f.id)),
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

  const classesQuery = useQuery(
    {
      queryKey: ['classes'],
      queryFn: () => httpClient.ical.getTimetable(icalTokenQuery.data!),
      enabled: currentFeed === 'classes' && !!icalTokenQuery.data,
      retry: false,
      refetchOnWindowFocus: false,
    },
    queryClient,
  );

  const handleFilterChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>, filterId: string) => {
      setFilters((prevFilters) => {
        const filterValue = prevFilters?.find(
          (filter) => filter.id === filterId,
        );

        if (filterValue) filterValue.isChecked = event.target.checked;
        return [...prevFilters!];
      });

      setTimeout(
        // we wait for filters state variable to update
        () =>
          void queryClient.invalidateQueries({
            queryKey: ['event-search', searchValue, dateFrom],
          }),
        100,
      );
    },
    [queryClient, searchValue, dateFrom],
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
            filters?.some((filter) => filter.isChecked) ? 'accent' : 'primary'
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
              {eventsQuery.hasNextPage && (
                <Button
                  variant="primary"
                  className="w-full rounded-3xl py-2"
                  disabled={eventsQuery.isFetchingNextPage}
                  onClick={() => void eventsQuery.fetchNextPage()}
                >
                  Загрузить еще
                </Button>
              )}
            </>
          )}
        </div>
        <div
          className={`absolute top-0 flex flex-col gap-3 pb-3 origin-top
            ${animEnabled && 'transition-all duration-500 ease-in-out'}
            ${currentFeed === 'classes' ? 'left-0 right-0 scale-y-100 opacity-100' : 'opacity-0 scale-y-0 ml-10 left-full -right-full'}`}
        >
          {/* eslint-disable-next-line no-nested-ternary */}
          {!icalTokenQuery.data ? (
            <p>Авторизация не пройдена</p>
          ) : // eslint-disable-next-line no-nested-ternary
          classesQuery.isPending ? (
            <p>Загрузка...</p>
          ) : classesQuery.isError ? (
            <p>Ошибка!</p>
          ) : (
            classesQuery.data
              .filter((day) => day.date === dateFrom.toLocaleDateString('ru'))
              .map((day) => (
                <React.Fragment key={day.date}>
                  {day.classes.map((lesson) => (
                    <TimetableCard
                      key={`${lesson.classNumber}`}
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
