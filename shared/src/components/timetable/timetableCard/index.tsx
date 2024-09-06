import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Timetable } from '../../../network/models/psu-tools/timetable';
import classStatus from './classStatus';
import Button from '../../common/button';
import httpClient from '../../../network/httpClient';
import SearchIcon from '../../../assets/search.svg?react';
import useTryQueryClient from '../../../hooks/useTryQueryClient';

interface Props {
  classData: Timetable.Class;
  navigate?: (s: string) => void;
  icalToken: string;
}

const audRegex = /(\d{3}\/\d{1,2})/;

const TimetableCard = ({ classData, navigate, icalToken }: Props) => {
  const audStr = audRegex.exec(classData.place)?.[1];
  const isClassInProgress = useMemo(() => {
    if (!classData?.date) {
      return false;
    }
    return classStatus(classData.date);
  }, [classData.date]);

  const cardClassNameText = isClassInProgress ? 'text-c_bg-block' : '';
  const queryClient = useTryQueryClient();
  const cardClassName = `${
    isClassInProgress
      ? 'bg-c_accent dark:bg-c_accent text-c_bg-block shadow-md'
      : 'bg-cd_main shadow-md dark:bg-cd_bg-block'
  }  w-full rounded-[2.5rem]`;

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

  const textUrl = classData.teacher?.match(/(http[^"]+)/)?.[0]?.match(/\s[^]+/);
  const url = classData.teacher
    ?.match(/(http[^"]+)/)?.[0]
    .replace(textUrl ? textUrl[0] : '', '')
    .trim();

  const classColor =
    // eslint-disable-next-line no-nested-ternary
    classData.type === 'лек'
      ? 'outline-lec'
      : // eslint-disable-next-line no-nested-ternary
        classData.type === 'практ'
        ? 'outline-prac'
        : classData.type === 'лаб'
          ? 'outline-lab'
          : 'outline-unknown-class-type-color';
  return (
    <div
      className={`${cardClassName} grid gap-2 grid-cols-[77%_23%] text-start py-7 pl-6 pr-7 justify-between items-start min-h-[120px]`}
    >
      <div>
        <h3 className={`${cardClassNameText} line-clamp-2 overflow-hidden`}>
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
            {textUrl ? (
              <div className={`${cardClassNameText} c1 pb-1 pt-[0.6rem]`}>
                {textUrl}
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
        <h3 className={`${cardClassNameText} text-center`}>{classData.time}</h3>
        <h3
          className={`${cardClassNameText} mt-1 line text-center rounded-2xl min-w-16 outline ${classColor}`}
        >
          {classData.type}
        </h3>
      </div>
    </div>
  );
};
export default TimetableCard;
