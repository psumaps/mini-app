import React from 'react';
import Block from '../common/block';
import Input from '../common/clearableInput';

const EventSearch = ({
  className,
  searchValue,
  setSearchValue,
}: {
  className?: string;
  searchValue: string;
  setSearchValue: (value: string) => void;
}) => {
  const [isInputShown, setIsInputShown] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleToggleInputShown = () => {
    if (!isInputShown) {
      if (inputRef.current) {
        inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        inputRef.current.focus();
      }
    }
    setIsInputShown(!isInputShown);
  };

  return (
    <Block className={`relative p-[0_!important] ${className}`}>
      <button
        type="button"
        className={`absolute inset-0 flex bg-transparent items-center justify-center transition-all ease-in-out duration-300 origin-top
          ${isInputShown ? 'scale-y-0 opacity-0' : 'scale-y-100 opacity-100'}`}
        onClick={handleToggleInputShown}
        disabled // todo: make
      >
        <p>Поиск</p>
      </button>
      <Input
        ref={inputRef}
        className={`absolute inset-0 top-1/2 -translate-y-1/2 mx-1 transition-all ease-in-out duration-300 origin-bottom
          ${isInputShown ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'}`}
        type="search"
        inputMode="search"
        value={searchValue ?? ''}
        onClear={() => {
          setSearchValue('');
          handleToggleInputShown();
        }}
        placeholder="Поиск"
        onChange={(e) => setSearchValue(e.target.value)}
        alwaysShowClear
      />
    </Block>
  );
};

export default EventSearch;
