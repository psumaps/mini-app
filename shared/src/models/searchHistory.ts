import Poi from '../network/models/mapi/poi';

type SearchHistory = Record<string, SearchHistoryRecord>;

export interface SearchHistoryRecord {
  poi: Poi;
  timestamp: number;
}

export default SearchHistory;
