import React, { useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Timetable } from '../../../network/models/psu-tools/timetable';
import classStatus from './classStatus';
import Button from '../../common/button';
import SearchIcon from '../../../assets/search.svg?react';
import httpClient from '../../../network/httpClient';

interface Props {
  classData: Timetable.Class;
  navigate?: (s: string) => void;
  icalToken: string;
}

const audRegex = /(\d{3}\/\d{1,2})/;

const TimetableCard = ({ classData, navigate, icalToken }: Props) => {
  const [isError] = React.useState(false);
  const audStr = audRegex.exec(classData.place)?.[1];
  const isClassInProgress = useMemo(() => {
    if (!classData?.date) {
      return false;
    }
    return classStatus(classData.date);
  }, [classData.date]);

  const cardClassName = `${
    isClassInProgress
      ? 'bg-c_accent dark:bg-c_accent text-c_bg-block shadow-md'
      : 'bg-cd_main shadow-md dark:bg-cd_bg-block'
  }  w-full rounded-[2.5rem]`;

  const cardClassNameText = isClassInProgress ? 'text-c_bg-block' : '';
  const queryClient = useQueryClient();

  const isAudAvailable = useQuery(
    {
      queryKey: ['search-aud', audStr],
      queryFn: () => httpClient.mapi.search(audStr!, icalToken),
      enabled: !!icalToken && !!audStr,
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 1000 * 60,
    },
    queryClient,
  );

  const renderContent = () => {
    if (isError || !classData) {
      return (
        <div className="flex items-center justify-center h-full w-full">
          <p className="text-center">Ошибка при чтении данных о занятии</p>
        </div>
      );
    }
    const textUrl = classData.teacher
      ?.match(/(http[^"]+)/)?.[0]
      ?.match(/\s[^]+/);
    const url = classData.teacher
      ?.match(/(http[^"]+)/)?.[0]
      .replace(textUrl ? textUrl[0] : '', '')
      .trim();

    const rega = /(\S+.\S+)(http\S+)?/;
    const arrsa = rega.exec(
      'Шилова Е.А. https://docs.google.com/spreadsheets/d/1wL8AeLGVME5aXLr8JKzIQXKiXBdmlRVxbxtI4QJlQaA/edit?usp=sharing в аудитории 30 мест! Запись обязательна!!!',
    );

    return (
      <div className="grid gap-2 grid-cols-[80%_20%]">
        <div>
          <h3 className={`${cardClassNameText}  line-clamp-2 overflow-hidden`}>
            {classData.discipline}
          </h3>
          {url ? (
            <div className="grid grid-cols-[95%]">
              <div className={`${cardClassNameText} c1 pb-1 pt-[0.6rem]`}>
                {classData.teacher
                  .replace(url, '')
                  .replace(textUrl ? textUrl[0] : '', '')
                  .trim()}
              </div>
              <a
                href={url}
                target="_blank"
                onClick={() => window.open(url)}
                className={`${cardClassNameText} underline c1 line-clamp-1`}
                rel="noreferrer"
              >
                {url}
              </a>
              {arrsa ? (
                <div className={`${cardClassNameText} c1 pb-1 pt-[0.6rem]`}>
                  {arrsa[0]}
                </div>
              ) : null}
            </div>
          ) : (
            <div className={`${cardClassNameText} c1 pb-1 pt-[0.6rem]`}>
              {classData.teacher}
            </div>
          )}
          <div className="flex gap-3">
            <div className={`${cardClassNameText} pt-2 c2`}>
              {classData.place}
            </div>
            {isAudAvailable.data?.length === 1 ? (
              <Button
                onClick={() => {
                  if (audStr) navigate?.(`/#q=${audStr}`);
                }}
                variant={isClassInProgress ? 'accent' : 'primary'}
              >
                <SearchIcon className="h-6 w-6" />
              </Button>
            ) : null}
          </div>
        </div>
        <div>
          <h3 className={`${cardClassNameText} text-center`}>
            {classData.time}
          </h3>
          <h3 className={`${cardClassNameText} text-center `}>
            {classData.type}
          </h3>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`${cardClassName}  text-start py-7 pl-6 pr-8 justify-between items-start min-h-[120px]`}
    >
      {renderContent()}
    </div>
  );
};

export default TimetableCard;
