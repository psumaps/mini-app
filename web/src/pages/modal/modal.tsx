/// <reference types="vite-plugin-svgr/client" />
import React, { useMemo } from 'react';
import Button from 'psumaps-frontend/shared/components/common/button';
import CheckableText from 'psumaps-frontend/shared/components/common/checkableText';
import Line from 'psumaps-frontend/shared/components/common/line';
import { Filter } from 'psumaps-frontend/shared/models/Filter';
import CrossIcon from '../../../../shared/assets/cross.svg?react';

interface ModalProps {
  isContrast?: boolean;
}
const Modal = (
  {
    active,
    setActive,
  }: { active: boolean; setActive: (active: boolean) => void },
  props: ModalProps,
) => {
  const { isContrast = false, ...rest } = props;
  const filter: Filter = useMemo(
    () => ({
      'Вид мероприятия': [
        'Собрание клуба',
        'Концерт',
        'Фестиваль',
        'Лекция',
        'Вид мероприятия',
        'Выставка',
      ],
      'Для кого': ['Для студентов', 'Для всех', 'Для гостей'],
      Когда: ['Утро', 'День', 'Вечер'],
      Статус: ['Ожидание', 'В самом разгаре', 'Прошедшее'],
    }),
    [],
  );

  return (
    <div
      className={` ${active ? 'scale-100' : 'scale-0'}  flex items-center justify-center`}
    >
      <div
        className={`${isContrast ? 'bg-c_main dark:bg-cd_main' : 'bg-cd_main dark:bg-cd_bg-block'} w-[22.875rem] h-[45.813rem] rounded-forty p-4 fixed shadow-[0_0px_10px_0px_#DDDDDD] dark:shadow-[0_0px_10px_0px_#262626] `}
        {...rest}
      >
        <div className="flex pr-4 pl-4 pb-[2.375rem]">
          <h2 className="pt-0.5 mx-auto c_textHeader dark:text-cd_main">
            Фильтры
          </h2>
          <Button
            onClick={() => setActive(false)}
            children={<CrossIcon />}
            className="pt-1 float-left"
          />
        </div>
        {Object.entries(filter).map(([key, values], index) => (
          <div key={key}>
            <div className="c4 pb-4 text-c_textFilter dark:text-cd_main">
              {key}
            </div>
            <div className="flex gap-x-1.5 gap-y-4 flex-wrap">
              {values.map((value, valueIndex) => (
                <CheckableText key={valueIndex} label={value} />
              ))}
            </div>
            {index < 3 && (
              <div className="flex pb-4 pt-6 ml-[-16px] mr-[-16px]">
                <Line className="border-[0.031rem]" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Modal;
