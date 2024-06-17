import React from 'react';
import Poi from '../../../network/models/mapi/poi';
import SearchEntry from './searchEntry';

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
      <SearchEntry
        key={item.properties.id}
        item={item}
        onClick={() => handlePoiClick(item)}
      />
    ))
  );
};

export default SearchResult;
