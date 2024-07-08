import React, { useMemo } from 'react';
import { Timetable } from '../../../network/models/psu-tools/timetable';
import classStatus from './classStatus';

interface Props {
  classData: Timetable.Class;
  classDate: Timetable.Day;
}

const TimetableCard = ({ classData, classDate }: Props) => {
  const [isError, setIsError] = React.useState(false);
  useMemo(() => {
    try {
      if (!classDate || !classDate.date) {
        throw new Error('Invalid class date');
      }
      const date = new Date(classDate.date);
      if (Number.isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      let timeStr = date.toLocaleTimeString('ru', {
        hour: 'numeric',
        minute: 'numeric',
      });
      timeStr = timeStr.replace(/^0+(\d)/, '$1');
      return timeStr;
    } catch (error) {
      setIsError(true);
      return '';
    }
  }, [classDate]);
  const isClassInProgress = useMemo(() => {
    if (!classDate || !classDate.date) {
      return false;
    }
    return classStatus(classDate.date);
  }, [classDate]);

  const cardClassName = `${
    isClassInProgress
      ? 'bg-c_accent dark:bg-c_accent text-c_bg-block shadow-md'
      : 'bg-cd_main shadow-md dark:bg-cd_bg-block'
  }  w-full rounded-[2.5rem]`;

  const cardClassNameText = isClassInProgress ? 'text-c_bg-block' : '';

  const renderContent = () => {
    if (isError || !classData) {
      return (
        <div className="flex items-center justify-center h-full w-full">
          <p className="text-center">Ошибка при чтении данных о занятии</p>
        </div>
      );
    }

    return (
      <>
        <div>
          <h3 className={`${cardClassNameText} line-clamp-2 overflow-hidden`}>
            {classData.discipline}&nbsp;
            {classData.type}
          </h3>
          <div className={`${cardClassNameText} c1 pb-1 pt-[0.6rem]`}>
            {classData.teacher}
          </div>
          <div className={`${cardClassNameText} c2`}>
            пара №{classData.classNumber}&nbsp; ({classData.place})
          </div>
        </div>
        {/* <h3 className={`${cardClassNameText} text-right ml-10`}>{time}</h3> */}
      </>
    );
  };

  return (
    <div className={cardClassName}>
      <div className=" py-7 pl-6 pr-8 flex justify-between items-start min-h-[120px]">
        {renderContent()}
      </div>
    </div>
  );
};

export default TimetableCard;
