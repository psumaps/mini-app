/// <reference types="vite-plugin-svgr/client" />
import type { Meta, StoryObj } from '@storybook/react';
import Modal from '../components/modal/modal';
import Button from '../../shared/components/common/button';
import FilterIcon from '../assets/filter.svg?react';
import React, { ChangeEvent, useCallback, useState } from 'react';

const meta = {
  title: 'modal/Modal',
  component: Modal,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export function ModalEventFilter() {
  const [modalActive, setModalActive] = useState(false);
  const [filters, setFilters] = useState([
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
  ]);

  const handleFilterChange = useCallback(
    (
      event: ChangeEvent<HTMLInputElement>,
      filterId: string,
      valueId: string,
    ) => {
      setFilters((prevFilters) =>
        prevFilters.map((filter) =>
          filter.id === filterId
            ? {
                ...filter,
                values: filter.values.map((value) =>
                  value.id === valueId
                    ? { ...value, isChecked: !value.isChecked }
                    : value,
                ),
              }
            : filter,
        ),
      );
    },
    [],
  );

  return (
    <div>
      <div>
        <Button
          className={`h-10 w-10 rounded-forty ${
            filters.some((filter) =>
              filter.values.some((value) => value.isChecked),
            )
              ? ' bg-red-600 fill-white dark:bg-red-600 dark:fill-white'
              : 'bg-cd_main'
          }`}
          onClick={() => setModalActive(true)}
        >
          <FilterIcon />
        </Button>
        <Modal
          active={modalActive}
          setActive={setModalActive}
          filters={filters}
          setFilters={handleFilterChange}
        />
      </div>
    </div>
  );
}
