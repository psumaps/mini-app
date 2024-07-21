import React from 'react';
import Poi from '../../../../network/models/mapi/poi';
import PoiInfo from '../poiInfo';

const SearchResult = ({
  data,
  handlePoiClick,
}: {
  data: Poi[];
  handlePoiClick: (poi: Poi) => void;
}) => {
  return data.length === 0 ? (
    <p>Ничего не найдено</p>
  ) : (
    data.map((item) => (
      <PoiInfo
        key={item.properties.id}
        item={item}
        onClick={() => handlePoiClick(item)}
      />
    ))
  );
};

export default SearchResult;
