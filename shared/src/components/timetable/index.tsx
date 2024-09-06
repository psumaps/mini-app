/// <reference types="vite-plugin-svgr/client" />

import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import useAnimEnabled from '../../hooks/useAnimEnabled';
import useIcalToken from '../../hooks/useIcalToken';
import { StorageContext } from '../../models/storage';
import httpClient from '../../network/httpClient';
import { node } from '../../utils/selector';
import Button from '../common/button';
import Calendar from './calendar';
import FeedClasses from './feedClasses';
import FeedEvents from './feedEvents';
import ScrollToTop from './scrollToTop';

const CURRENT_FEED_KEY = 'current-feed';
const DEFAULT_FEED = 'events';

const CLASSES_FEED_ID = 'feed-classes';
const EVENTS_FEED_ID = 'feed-events';

const Timetable = () => {
  const storageContext = useContext(StorageContext);
  const icalTokenQuery = useIcalToken();
  const { data: animEnabled } = useAnimEnabled();
  const queryClient = useQueryClient();
  const [searchValue, setSearchValue] = useState<string>('');
  const [dateFrom, setDateFrom] = useState<Date>(new Date());

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

  const currentFeed = useMemo(
    () => currentFeedQuery.data ?? DEFAULT_FEED,
    [currentFeedQuery.data],
  );

  useEffect(() => {
    const hideOldFeedTimeout = setTimeout(() => {
      const oldFeedDiv = node(
        `#${currentFeed === 'classes' ? EVENTS_FEED_ID : CLASSES_FEED_ID}`,
      );
      if (oldFeedDiv) oldFeedDiv.classList.add('hidden');
    }, 500);

    return () => clearTimeout(hideOldFeedTimeout);
  }, [currentFeed]);

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

  const handleDateChange = (date: Date) => {
    setDateFrom(date);
  };

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
  };

  return (
    <>
      {currentFeed === 'events' && <ScrollToTop />}
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
      <div className="relative mt-3">
        <FeedEvents
          dateFrom={dateFrom}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          currentFeed={currentFeed}
          id={EVENTS_FEED_ID}
          className={`absolute top-0 flex flex-col gap-3 pb-3 origin-top will-change-auto
            ${animEnabled && 'transition-all duration-500 ease-in-out'}
            ${currentFeed === 'events' ? 'left-0 right-0' : 'mr-10 right-full -left-full'}`}
        />
        <FeedClasses
          classesQuery={classesQuery}
          dateFrom={dateFrom}
          id={CLASSES_FEED_ID}
          className={`absolute top-0 flex flex-col gap-3 pb-3 origin-top will-change-auto
            ${animEnabled && 'transition-all duration-500 ease-in-out'}
            ${currentFeed === 'classes' ? 'left-0 right-0' : 'ml-10 left-full -right-full'}`}
        />
      </div>
    </>
  );
};

export default Timetable;
