import { UseQueryResult } from '@tanstack/react-query';
import React, { useContext, useMemo } from 'react';
import useIcalToken from '../../hooks/useIcalToken';
import { NavigatorContext } from '../../models/navigator';
import { Timetable } from '../../network/models/psu-tools/timetable';
import SettingsIcon from '../../assets/settings.svg?react';
import TimetableCard from './timetableCard';

const FeedClasses = (
  props: {
    classesQuery: UseQueryResult<Timetable.Day[], Error>;
    dateFrom: Date;
  } & React.HtmlHTMLAttributes<HTMLDivElement>,
) => {
  const icalTokenQuery = useIcalToken();
  const navigator = useContext(NavigatorContext);
  const { classesQuery, dateFrom, ...rest } = props;

  const chosenTimetable = useMemo(() => {
    const formattedDate = dateFrom.toLocaleDateString('ru');
    return classesQuery.data?.filter((day) => day.date === formattedDate);
  }, [classesQuery.data, dateFrom]);

  return (
    <div {...rest}>
      {/* eslint-disable-next-line no-nested-ternary */}
      {!icalTokenQuery.data ? (
        <>
          <p>Авторизация не пройдена.</p>
          <p>
            Введите токен в настройках&nbsp;
            <button
              type="button"
              onClick={() => navigator?.navigate('/settings#auth')}
              aria-label="Настройки"
            >
              <SettingsIcon className="fill-c_main dark:fill-cd_main size-6 pt-1" />
            </button>
          </p>
        </>
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
  );
};

export default FeedClasses;
