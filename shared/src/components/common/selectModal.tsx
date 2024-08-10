import React from 'react';
import Button from './button';
import Modal from './modal';

const SelectModal = ({
  options,
  title,
  className,
  chosenOption,
  onSelect,
  onClose,
}: {
  options: { label: string; value: string }[];
  chosenOption: string | null;
  title: string;
  className?: string;
  onSelect: (optionValue: string) => void;
  onClose: () => void;
}) => {
  return (
    <Modal title={title} onClose={onClose} className={className}>
      <>
        {options.map((option) => (
          <Button
            className="w-full text-left px-4 py-1 my-1 rounded-3xl text-wrap flex flex-row [justify-content:flex-start_!important]"
            variant={option.value === chosenOption ? 'accent' : 'primary'}
            key={option.value}
            onClick={() => onSelect(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </>
    </Modal>
  );
};

export default SelectModal;
