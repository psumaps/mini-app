import React, { useMemo } from 'react';
import { Timetable } from '../../../network/models/psu-tools/timetable';
import classStatus from './classStatus';
import Button from '../../common/button';

interface Props {
  classData: Timetable.Class;
  navigate?: (s: string) => void;
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

  const cardClassNameText = isClassInProgress ? 'text-c_bg-block' : '';

  return (
    <Button
      onClick={() => {
        if (audStr) navigate?.(`/#q=${audStr}`);
      }}
      className="text-start shadow-md w-full rounded-[2.5rem]"
      variant={isClassInProgress ? 'accent' : 'primary'}
    >
      <div className="py-7 pl-6 pr-8 min-h-[120px] w-full">
        {isError || !classData ? (
          <div className="flex items-center justify-center h-full w-full">
            <p className="text-center">Ошибка при чтении данных о занятии</p>
          </div>
        ) : (
          <div className="justify-between flex-row flex">
            <div className="mr-8">
              <h3
                className={`${cardClassNameText} line-clamp-2 overflow-hidden`}
              >
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
        )}
      </div>
    </Button>
  );
};

export default TimetableCard;
