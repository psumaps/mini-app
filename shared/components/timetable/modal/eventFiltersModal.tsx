/// <reference types="vite-plugin-svgr/client" />
import React, { ChangeEvent } from 'react';
import Button from '../../common/button';
import CheckableText from '../../common/checkableText';
import Line from '../../common/line';
import CrossIcon from '../../../assets/cross.svg?react';

interface Filter {
  id: string;
  name: string;
  values: { id: string; value: string; isChecked: boolean }[];
}

interface ModalProps {
  active: boolean;
  setActive: (active: boolean) => void;
  filters: Filter[];
  setFilters: (
    event: ChangeEvent<HTMLInputElement>,
    filterId: string,
    valueId: string,
  ) => void;
}

const Modal = (props: ModalProps) => {
  const { active, setActive, filters, setFilters } = props;
  return (
    <div
      className={` px-1 fixed inset-0 flex items-center justify-center transition-transform duration-300 ${
        active
          ? 'opacity-100 translate-y-0 '
          : 'opacity-0 pointer-events-none translate-y-full '
      }`}
    >
      <div
        className={`bg-cd_main dark:bg-cd_bg-block w-screen h-screen rounded-forty p-4 shadow-[0_0px_0.6rem_0px_#DDDDDD] dark:shadow-[0_0px_0.6rem_0px_#262626] transition-opacity duration-300 ease-in-out overflow-y-auto`}
      >
        <div className="flex pr-4 pl-4 pb-[2.4rem]">
          <h2 className="pt-0.5 mx-auto c_textHeader dark:text-cd_main">
            Фильтры
          </h2>
          <Button
            onClick={() => setActive(false)}
            children={<CrossIcon />}
            className="pt-1 float-left bg-inherit"
          />
        </div>
        {filters.map((filter) => (
          <div key={filter.id}>
            <div className="c4 pb-4 text-c_textFilter dark:text-cd_main">
              {filter.name}
            </div>
            <div className="flex gap-x-1.5 gap-y-4 flex-wrap">
              {filter.values.map((value) => (
                <CheckableText
                  key={value.id}
                  filterId={filter.id}
                  valueId={value.id}
                  label={value.value}
                  isChecked={value.isChecked}
                  onChange={setFilters}
                />
              ))}
            </div>
            {filter.id !== filters[filters.length - 1].id && (
              <div className="flex pb-4 pt-6 ml-[-1rem] mr-[-1rem]">
                <Line className="border-[0.03rem]" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Modal;
