import React from 'react';
import { detectItemAmenityName } from '../../../network/utils/detectAmenity';
import Poi, { calcPoiName } from '../../../network/models/mapi/poi';
import { useSharedMapContext } from '../../../contexts/SharedMapContext';

const PoiInfo = ({
  item,
  className,
  classNameInner,
  handleClick = true,
}: {
  item: Poi | null;
  className?: string;
  classNameInner?: string;
  handleClick?: boolean;
}) => {
  const building = item?.properties.tags?.building;
  const level = item?.properties.tags?.level ?? '1';
  const { handlePoiSelect } = useSharedMapContext();
  return (
    <button
      type="button"
      className={`w-full flex flex-col gap-1 cursor-pointer ${className}`}
      onClick={() => item && handleClick && handlePoiSelect?.(item)}
    >
      <p className={`text-c_accent font-semibold ${classNameInner}`}>
        {calcPoiName(item)}
      </p>
      <h4 className={`${classNameInner}`}>
        {detectItemAmenityName(item) ?? 'Без категории'}
        {building && ` - Корпус ${building}, этаж ${level}`}
      </h4>
    </button>
  );
};

export default PoiInfo;
