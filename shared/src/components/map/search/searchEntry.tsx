import React from 'react';
import detectAmenity from '../../../network/utils/detectAmenity';
import Poi from '../../../network/models/mapi/poi';

const SearchEntry = ({
  item,
  onClick,
}: {
  item: Poi;
  onClick?: (poi: Poi) => void;
}) => {
  return (
    <button
      type="button"
      className="w-full flex flex-col gap-1 cursor-pointer"
      onClick={() => onClick?.(item)}
    >
      <p className="text-c_accent font-semibold">
        {item.properties.name ?? item.properties.ref ?? 'Без названия'}
      </p>
      <h4>{detectAmenity(item) ?? 'Без категории'}</h4>
    </button>
  );
};

export default SearchEntry;
