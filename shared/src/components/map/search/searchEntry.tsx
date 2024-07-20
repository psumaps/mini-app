import React from 'react';
import { detectItemAmenityName } from '../../../network/utils/detectAmenity';
import Poi from '../../../network/models/mapi/poi';

const SearchEntry = ({
  item,
  onClick,
  className,
  classNameInner,
}: {
  item: Poi | null;
  onClick?: (poi: Poi) => void;
  className?: string;
  classNameInner?: string;
}) => {
  const building =
    item?.properties.tags?.building ?? item?.properties.tags?.corpus;
  return (
    <button
      type="button"
      className={`w-full flex flex-col gap-1 cursor-pointer ${className}`}
      onClick={() => item && onClick?.(item)}
    >
      <p className={`text-c_accent font-semibold ${classNameInner}`}>
        {item?.properties.name ?? item?.properties.ref ?? 'Без названия'}
      </p>
      <h4 className={`${classNameInner}`}>
        {detectItemAmenityName(item) ?? 'Без категории'}
        {building && ` - ${building} корпус`}
      </h4>
    </button>
  );
};

export default SearchEntry;
