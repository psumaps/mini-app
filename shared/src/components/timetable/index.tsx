/// <reference types="vite-plugin-svgr/client" />

import React, {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
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
import { StorageContext } from '../../models/storage';
import { node } from '../../utils/selector';

const EVENTS_LIMIT = 10;
const CURRENT_FEED_KEY = 'current-feed';
const DEFAULT_FEED = 'events';

const CLASSES_FEED_ID = 'feed-classes';
const EVENTS_FEED_ID = 'feed-events';

const Timetable = () => {
  const navigator = useContext(NavigatorContext);
  const storageContext = useContext(StorageContext);
  const icalTokenQuery = useIcalToken();
  const { data: animEnabled } = useAnimEnabled();
  const queryClient = useQueryClient();
  const [searchValue, setSearchValue] = useState<string>('');
  const [filtersActive, setFiltersActive] = useState<boolean>(false);
  const [dateFrom, setDateFrom] = useState<Date>(new Date());
  const [filters, setFilters] = useState<Filter[] | null>(null);

  const currentFeedQuery = useQuery(
    {
      queryKey: ['storage', CURRENT_FEED_KEY],
      queryFn: async () =>
        (await storageContext?.get(CURRENT_FEED_KEY)) ?? DEFAULT_FEED,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    },
    queryClient,
  );

  const currentFeed = currentFeedQuery.data ?? DEFAULT_FEED;

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
      enabled: !!icalTokenQuery.data,
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 10 * 60 * 1000,
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

  const chosenTimetable = useMemo(() => {
    const formattedDate = dateFrom.toLocaleDateString('ru');
    return classesQuery.data?.filter((day) => day.date === formattedDate);
  }, [classesQuery.data, dateFrom]);

  const setCurrentFeed = (feed: string) => {
    void storageContext?.set(CURRENT_FEED_KEY, feed);
    void queryClient.invalidateQueries({
      predicate: (query) => query.queryKey.includes(CURRENT_FEED_KEY),
    });
    const feedDiv = node(
      `#${feed === 'classes' ? CLASSES_FEED_ID : EVENTS_FEED_ID}`,
    );
    if (feedDiv) feedDiv.classList.remove('hidden');
    if (feed === 'classes')
      node('#layout')?.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      const oldFeedDiv = node(
        `#${feed === 'classes' ? EVENTS_FEED_ID : CLASSES_FEED_ID}`,
      );
      if (oldFeedDiv) oldFeedDiv.classList.add('hidden');
    }, 500);
  };

  return (
    <>
      <Calendar
        className="h-fit"
        onChange={(date) => date instanceof Date && handleDateChange(date)}
        classesData={classesQuery.data ?? undefined}
      />
      <div className="flex flex-row gap-4 mt-5">
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
      <EventFiltersModal
        active={filtersActive}
        setActive={setFiltersActive}
        filters={filters}
        setFilters={handleFilterChange}
        query={filtersQuery}
      />
      <div className="relative mt-3">
        <div
          id={EVENTS_FEED_ID}
          className={`absolute top-0 flex flex-col gap-3 pb-3 origin-top will-change-auto
            ${animEnabled && 'transition-all duration-500 ease-in-out'}
            ${currentFeed === 'events' ? 'left-0 right-0' : 'mr-10 right-full -left-full'}`}
        >
          {/* eslint-disable-next-line no-nested-ternary */}
          {eventsQuery.isPending ? (
            <p>Загрузка...</p>
          ) : eventsQuery.isError ? (
            <p>Ошибка!</p>
          ) : (
            <>
              <div className="flex flex-row gap-4">
                <EventSearch
                  searchValue={searchValue}
                  setSearchValue={setSearchValue}
                  className="h-10 flex-auto shadow-md"
                />
                <Button
                  className="h-10 w-10 rounded-3xl shadow-md dark:shadow-none"
                  variant={
                    filters?.some((filter) => filter.isChecked)
                      ? 'accent'
                      : 'primary'
                  }
                  onClick={() => setFiltersActive(true)}
                >
                  <FilterIcon />
                </Button>
              </div>
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
          id={CLASSES_FEED_ID}
          className={`absolute top-0 flex flex-col gap-3 pb-3 origin-top will-change-auto
            ${animEnabled && 'transition-all duration-500 ease-in-out'}
            ${currentFeed === 'classes' ? 'left-0 right-0' : 'ml-10 left-full -right-full'}`}
        >
          {/* eslint-disable-next-line no-nested-ternary */}
          {!icalTokenQuery.data ? (
            <p>Авторизация не пройдена</p>
          ) : // eslint-disable-next-line no-nested-ternary
          classesQuery.isPending ? (
            <p>Загрузка...</p>
          ) : // eslint-disable-next-line no-nested-ternary
          classesQuery.isError ? (
            <p>Ошибка!</p>
          ) : !chosenTimetable || chosenTimetable.length === 0 ? (
            <p>Выходной!</p>
          ) : (
            chosenTimetable.map((day) => (
              <React.Fragment key={day.date}>
                {day.classes.map((lesson) => (
                  <TimetableCard
                    key={`${lesson.classId}`}
                    classData={lesson}
                    navigate={(s) => navigator?.navigate(s)}
                    icalToken={icalTokenQuery.data!}
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
