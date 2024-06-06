/// <reference types="vite-plugin-svgr/client" />

import React, { ChangeEvent } from 'react';
import Button from '../common/button';
import CheckableText from '../common/checkableText';
import Line from '../common/line';
import CrossIcon from '../../../shared/assets/cross.svg?react';

interface ModalProps {
  active: boolean;
  setActive: (active: boolean) => void;
  filtersData: { name: string; values: string[] }[];
  onFilterChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const Modal = ({
  active,
  setActive,
  filtersData,
  onFilterChange,
}: ModalProps) => {
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center transition-transform duration-300 ${
        active
          ? 'opacity-100 translate-y-0 '
          : 'opacity-0 pointer-events-none translate-y-full '
      }`}
    >
      <div
        className={`bg-cd_main dark:bg-cd_bg-block w-screen h-screen rounded-forty p-4 shadow-[0_0px_10px_0px_#DDDDDD] dark:shadow-[0_0px_10px_0px_#262626] transition-opacity duration-300 ease-in-out overflow-y-auto`}
      >
        <div className="flex pr-4 pl-4 pb-[2.375rem]">
          <h2 className="pt-0.5 mx-auto c_textHeader dark:text-cd_main">
            Фильтры
          </h2>
          <Button
            onClick={() => setActive(false)}
            children={<CrossIcon />}
            className="pt-1 float-left bg-inherit"
          />
        </div>
        {filtersData.map(({ name, values }, index) => (
          <div key={name}>
            <div className="c4 pb-4 text-c_textFilter dark:text-cd_main">
              {name}
            </div>
            <div className="flex gap-x-1.5 gap-y-4 flex-wrap">
              {values.map((value, valueIndex) => (
                <CheckableText
                  key={valueIndex}
                  label={value}
                  onChange={onFilterChange}
                />
              ))}
            </div>
            {index < filtersData.length - 1 && (
              <div className="flex pb-4 pt-6 ml-[-1rem] mr-[-1rem]">
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
