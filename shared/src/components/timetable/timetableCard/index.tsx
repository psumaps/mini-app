import React, { useMemo } from 'react';
import { Timetable } from '../../../network/models/psu-tools/timetable';
import classStatus from './classStatus';

interface Props {
  classData: Timetable.Class;
  classDate: Timetable.Day;
}

const TimetableCard = ({ classData, classDate }: Props) => {
  const time = useMemo(() => {
    const date = new Date(classDate.date);
    let timeStr = date.toLocaleTimeString('ru', {
      hour: 'numeric',
      minute: 'numeric',
    });
    timeStr = timeStr.replace(/^0+(\d)/, '$1');
    return timeStr;
  }, [classDate]);

  const isClassInProgress = classStatus(classDate.date);

  const cardClassName = `${isClassInProgress ? 'bg-c_accent dark:bg-c_accent text-c_bg-block shadow-[0.06rem_0.06rem_0.3rem_0_#D01F3680] dark:shadow-[0.06rem_0.06rem_0.3rem_0_#D01F3680]' : 'bg-cd_main shadow-[0_0_0.3rem_0_#EDEDED] dark:shadow-none dark:bg-cd_bg-block'}  w-screen rounded-[2.5rem]`;

  const cardClassNameText = `${isClassInProgress ? 'text-c_bg-block' : ''}`;

  return (
    <div className={cardClassName}>
      <div className="pt-[1.3rem] pb-[1.8rem] pl-[1.6rem] pr-[2.1rem] flex justify-between items-start">
        <div>
          <h3 className={`${cardClassNameText}  line-clamp-2 overflow-hidden `}>
            {classData.discipline}
            {classData.type}
          </h3>
          <div className={`${cardClassNameText} c1 pb-1 pt-[0.6rem]`}>
            {classData.teacher}
          </div>
          <div className={`${cardClassNameText} c2`}>
            {classData.classNumber}
            {classData.place}
          </div>
        </div>
        <h3 className={`${cardClassNameText} text-right ml-5`}>{time}</h3>
      </div>
    </div>
  );
};

export default TimetableCard;
