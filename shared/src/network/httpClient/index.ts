/*

API запросы в приложении разбиты на две группы:
- расписание занятий и событий из psu-tools
- геоинформация из mapi.ijo42.ru

*/

import mapiClient from './mapiClient';
import psuToolsClient from './psuToolsClient';
import icalClient from './icalClient';
import tileClient from './tileClient';

const httpClient = {
  mapi: mapiClient,
  psuTools: psuToolsClient,
  ical: icalClient,
  tile: tileClient,
};

export default httpClient;
