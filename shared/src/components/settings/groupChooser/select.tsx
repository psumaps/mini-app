import React from 'react';
import Button from '../../common/button';
import SelectModal from '../../common/selectModal';
import { SelectProps } from './groupChooserUtils';

const Select = ({
  choosingTag,
  btnText,
  query,
  title,
  onSelect,
  dataItem,
  fallbackName,
  choosing,
  setChoosing,
}: SelectProps) => {
  return (
    <>
      <Button
        variant="primary"
        onClick={() => setChoosing(choosingTag)}
        className="w-full py-4 min-h-12 px-4 rounded-3xl c3"
      >
        {/* eslint-disable-next-line no-nested-ternary */}
        {query === null
          ? 'Загрузка...'
          : dataItem
            ? `${btnText}: ${query.data.find((item) => item.id === dataItem)?.name ?? fallbackName ?? ''}`
            : title}
      </Button>
      <SelectModal
        onClose={() => setChoosing(null)}
        className={`origin-bottom ${choosing === choosingTag ? 'top-0' : 'top-[100dvh]'}`}
        options={
          query === null
            ? []
            : query.data.map((item) => ({
                label: item.name,
                value: item.id.toString(),
              }))
        }
        chosenOption={dataItem?.toString() ?? null}
        title={title}
        onSelect={onSelect}
      />
    </>
  );
};

export default Select;
