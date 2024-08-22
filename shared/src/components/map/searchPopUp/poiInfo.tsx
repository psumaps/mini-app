import React from 'react';
import { detectItemAmenityName } from '../../../network/utils/detectAmenity';
import Poi from '../../../network/models/mapi/poi';

const PoiInfo = ({
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
  const building = item?.properties.tags?.building;
  const level = item?.properties.tags?.level ?? '1';

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
        {building && ` - Корпус ${building}, этаж ${level}`}
      </h4>
    </button>
  );
};

export default PoiInfo;
