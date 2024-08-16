import React, { useMemo } from 'react';
import { Timetable } from '../../../network/models/psu-tools/timetable';
import classStatus from './classStatus';
import Button from '../../common/button';

interface Props {
  classData: Timetable.Class;
  navigate?: ((s: string) => void);
}
const audRegex = /(\d{3}\/\d{1,2})/;

const TimetableCard = ({ classData, navigate }: Props) => {
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

  const renderContent = () => {
    if (isError || !classData) {
      return (
        <div className="flex items-center justify-center h-full w-full">
          <p className="text-center">Ошибка при чтении данных о занятии</p>
        </div>
      );
    }

    return (
      <div className="grid gap-2 grid-cols-[80%_20%]">
        <div>
          <h3 className={`${cardClassNameText}  line-clamp-2 overflow-hidden`}>
            {classData.discipline}
          </h3>
          <div className={`${cardClassNameText} c1 pb-1 pt-[0.6rem]`}>
            {classData.teacher}
          </div>
          <div className={`${cardClassNameText} c2`}>{classData.place}</div>
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
    <Button
      onClick={() => {
        if (audStr) navigate?.(`/#q=${audStr}`);
      }}
      className={`${cardClassName} text-start`}
    >
      <div className="py-7 pl-6 pr-8 flex justify-between items-start min-h-[120px]">
        {renderContent()}
      </div>
    </Button>
  );
};

export default TimetableCard;
