/*

API запросы в приложении разбиты на две группы:
- расписание занятий и событий из psu-tools
- геоинформация из mapi.ijo42.ru

*/

import mapiClient from './mapiClient';
import psuToolsClient from './psuToolsClient';
import icalClient from './icalClient';

const httpClient = {
  mapi: mapiClient,
  psuTools: psuToolsClient,
  ical: icalClient,
};

export default httpClient;
