import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import useTryQueryClient from '../../../hooks/useTryQueryClient';
import IStorage from '../../../models/storage';
import httpClient from '../../../network/httpClient';
import { Choices, GROUP_INFO_KEY, GroupData } from './groupChooserUtils';
import Select from './select';

/**
 * Рисует компонент выбора группы.
 *
 * @param {string} className - Спецификация классов для переключателя.
 * @param {T extends IStorage} storage - Специальное для модуля хранилище.
 */
const GroupChooser = <T extends IStorage>({
  className,
  storage,
}: {
  className?: string;
  storage: T;
}) => {
  const queryClient = useTryQueryClient();
  const [choosing, setChoosing] = useState<Choices | null>(null);
  const [data, setData] = useState<GroupData>({
    facultyId: null,
    groupId: null,
    groupName: null,
  });

  useEffect(() => {
    const loadInfo = async () => {
      const response = await storage.get(GROUP_INFO_KEY);
      if (response) setData(JSON.parse(response) as GroupData);
    };
    void loadInfo();
  }, [storage]);

  const updateData = (newData: GroupData) => {
    setData(newData);
    setChoosing(null);
    void storage.set(GROUP_INFO_KEY, JSON.stringify(newData));
    void queryClient.invalidateQueries({ queryKey: [GROUP_INFO_KEY] });
  };

  const facultiesQuery = useQuery(
    {
      queryKey: ['faculties'],
      queryFn: httpClient.psuTools.timetable.getFaculties,
      staleTime: Infinity,
      enabled: false,
    },
    queryClient,
  );

  const groupsQuery = useQuery(
    {
      queryKey: ['groups', data.facultyId],
      queryFn: () => httpClient.psuTools.timetable.getGroups(data.facultyId!),
      staleTime: Infinity,
      enabled: !!data.facultyId,
    },
    queryClient,
  );

  return (
    <div className={`gap-3 flex flex-col ${className}`}>
      <Select
        choosing={choosing}
        setChoosing={setChoosing}
        choosingTag="faculties"
        btnText="Выбран факультет"
        title="Выберите факультет"
        query={(facultiesQuery.data && facultiesQuery) ?? null}
        onSelect={(value) => {
          const newData = { ...data, facultyId: parseInt(value) };
          updateData(newData);
        }}
        dataItem={data.facultyId}
      />
      <Select
        choosing={choosing}
        setChoosing={setChoosing}
        choosingTag="groups"
        btnText="Выбрана группа"
        title="Выберите группу"
        query={(groupsQuery.data && groupsQuery) ?? null}
        onSelect={(value) => {
          const newData = {
            ...data,
            groupId: parseInt(value),
            groupName:
              groupsQuery.data?.find((group) => group.id === parseInt(value))
                ?.name ?? null,
          };
          updateData(newData);
        }}
        dataItem={data.groupId}
        fallbackName={data.groupName ?? undefined}
      />
    </div>
  );
};

export default GroupChooser;
