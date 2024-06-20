/// <reference types="vite-plugin-svgr/client" />

import type { Meta } from '@storybook/react';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { QueryClient, useQuery } from '@tanstack/react-query';
import Modal from '../components/timetable/eventFiltersModal';
import Button from '../components/common/button';
import FilterIcon from '../assets/filter.svg?react';
import Filter from '../network/models/psu-tools/eventFilter';
import api from '../network/api';
import httpClient from '../network/httpClient';
import StorageDecorator from './decorators/storage';

const meta = {
  title: 'Timetable/EventFilters',
  component: Modal,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  decorators: [StorageDecorator],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
} satisfies Meta<typeof Modal>;

export default meta;

const mockFilters: Filter[] = [
  {
    id: 'event-type',
    name: 'Вид мероприятия',
    values: [
      { id: 'meeting', value: 'Собрание клуба', isChecked: false },
      { id: 'concert', value: 'Концерт', isChecked: false },
      { id: 'festival', value: 'Фестиваль', isChecked: false },
      { id: 'lecture', value: 'Лекция', isChecked: false },
      { id: 'event-type-other', value: 'Вид мероприятия', isChecked: false },
      { id: 'exhibition', value: 'Выставка', isChecked: false },
    ],
  },
  {
    id: 'audience',
    name: 'Для кого',
    values: [
      { id: 'students', value: 'Для студентов', isChecked: false },
      { id: 'all', value: 'Для всех', isChecked: false },
      { id: 'guests', value: 'Для гостей', isChecked: false },
    ],
  },
  {
    id: 'time',
    name: 'Когда',
    values: [
      { id: 'morning', value: 'Утро', isChecked: false },
      { id: 'day', value: 'День', isChecked: false },
      { id: 'evening', value: 'Вечер', isChecked: false },
    ],
  },
  {
    id: 'status',
    name: 'Статус',
    values: [
      { id: 'pending', value: 'Ожидание', isChecked: false },
      { id: 'ongoing', value: 'В самом разгаре', isChecked: false },
      { id: 'past', value: 'Прошедшее', isChecked: false },
    ],
  },
];

export const EventFiltersModal = () => {
  const queryClient = new QueryClient();
  const [modalActive, setModalActive] = useState(false);
  const [filters, setFilters] = useState<Filter[] | null>(null);

  const query = useQuery(
    {
      queryKey: ['filters'],
      queryFn: () => httpClient.psuTools.events.getFilters(),
      staleTime: Infinity,
    },
    queryClient,
  );
  useEffect(() => {
    if (query.data) setFilters(query.data);
  }, [query.data]);

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
    <div>
      <Button
        className="h-10 w-10 rounded-forty"
        variant={
          filters?.some((filter) =>
            filter.values.some((value) => value.isChecked),
          )
            ? 'accent'
            : 'primary'
        }
        onClick={() => setModalActive(true)}
      >
        <FilterIcon />
      </Button>
      <Modal
        active={modalActive}
        setActive={setModalActive}
        filters={filters}
        setFilters={handleFilterChange}
        query={query}
      />
    </div>
  );
};

EventFiltersModal.parameters = {
  mockData: [
    {
      url: `${api.psuTools}/v2/filters`,
      method: 'GET',
      status: 200,
      response: mockFilters,
    },
  ],
};
