import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import React, {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import FilterIcon from '../../../assets/filter.svg?react';
import { NavigatorContext } from '../../../models/navigator';
import Filter from '../../../network/models/psu-tools/eventFilter';
import Button from '../../common/button';
import EventListCard from './eventListCard';
import EventSearch from './eventSearch';
import httpClient from '../../../network/httpClient';
import EventFiltersModal from './eventFiltersModal';

const EVENTS_LIMIT = 10;
const SEARCH_DEBOUNCE_MS = 500;

const FeedEvents = (
  props: {
    searchValue: string;
    setSearchValue: (value: string) => void;
    dateFrom: Date;
    currentFeed: string;
  } & React.HtmlHTMLAttributes<HTMLDivElement>,
) => {
  const navigator = useContext(NavigatorContext);
  const queryClient = useQueryClient();
  const [filtersActive, setFiltersActive] = useState<boolean>(false);
  const [filters, setFilters] = useState<Filter[] | null>(null);
  const { searchValue, setSearchValue, dateFrom, currentFeed, ...rest } = props;
  const [isSearchMode, setIsSearchMode] = useState<boolean>(false);
  const [debouncedSearchValue, setDebouncedSearchValue] = useState<string>('');

  useEffect(() => {
    if (!isSearchMode) return;

    const timer = setTimeout(() => {
      setDebouncedSearchValue(searchValue);
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [searchValue, isSearchMode]);

  dateFrom.setHours(5, 0, 0, 0); // to proper caching

  const searchQuery = useQuery({
    queryKey: ['event-search-by-name', debouncedSearchValue],
    queryFn: () =>
      httpClient.psuTools.events.searchByName(debouncedSearchValue),
    enabled:
      isSearchMode &&
      currentFeed === 'events' &&
      debouncedSearchValue.length > 0,
  });

  const eventsQuery = useInfiniteQuery(
    {
      queryKey: ['event-search', dateFrom],
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
      retry: false,
      getNextPageParam: (lastPage, _, lastPageParam) => {
        if (lastPage.length < EVENTS_LIMIT) {
          return undefined;
        }
        return lastPageParam + 1;
      },
      enabled: !isSearchMode && currentFeed === 'events',
    },
    queryClient,
  );

  const filtersQuery = useQuery(
    {
      queryKey: ['filters'],
      queryFn: () => httpClient.psuTools.events.getFilters(),
      staleTime: Infinity,
      retry: 2,
    },
    queryClient,
  );

  const handleSearch = useCallback(() => {
    if (searchValue.trim()) {
      setIsSearchMode(true);
    }
  }, [searchValue]);

  const handleClearSearch = useCallback(() => {
    setIsSearchMode(false);
    setSearchValue('');
    setDebouncedSearchValue('');
  }, [setSearchValue]);

  useEffect(() => {
    if (filtersQuery.data) setFilters(filtersQuery.data);
  }, [filtersQuery.data]);

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
            queryKey: ['event-search', dateFrom],
          }),
        100,
      );
    },
    [queryClient, dateFrom],
  );

  return (
    <>
      <EventFiltersModal
        active={filtersActive}
        setActive={setFiltersActive}
        filters={filters}
        setFilters={handleFilterChange}
        query={filtersQuery}
      />
      <div {...rest}>
        {(isSearchMode ? searchQuery.isPending : eventsQuery.isPending) ? (
          <p>Загрузка...</p>
        ) : (isSearchMode ? searchQuery.isError : eventsQuery.isError) ? (
          <p>Мероприятия временно недоступны, но обязательно вернутся :(</p>
        ) : (
          <>
            <div className="flex flex-row gap-4">
              <EventSearch
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                onSearch={handleSearch}
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
                disabled={isSearchMode}
              >
                <FilterIcon />
              </Button>
            </div>
            {isSearchMode ? (
              <>
                {searchQuery.data && searchQuery.data.length > 0 ? (
                  searchQuery.data.map((event) => (
                    <EventListCard
                      key={event.id}
                      event={event}
                      onOpenDesc={() =>
                        navigator?.navigate(`/event/${event.id}`)
                      }
                    />
                  ))
                ) : (
                  <div className="flex flex-col items-center gap-4 mt-4">
                    <p>Мероприятий не найдено</p>
                    <Button variant="primary" onClick={handleClearSearch}>
                      Сбросить поиск
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <>
                {eventsQuery.data?.pages.map((page) =>
                  page[0] ? (
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
                  ) : (
                    <p key="">Мероприятий на выбранную дату не найдено</p>
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
          </>
        )}
      </div>
    </>
  );
};

export default FeedEvents;
