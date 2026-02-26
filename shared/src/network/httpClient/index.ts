/*

API запросы в приложении разбиты на две группы:
- расписание занятий и событий из psu-tools
- геоинформация из mapi.ijo42.ru

*/

import mapiClient from './mapiClient';
import psuToolsClient from './psuToolsClient';
import icalClient from './icalClient';
import tileClient from './tileClient';
import authClient from './authClient';

const httpClient = {
  mapi: mapiClient,
  psuTools: psuToolsClient,
  ical: icalClient,
  tile: tileClient,
  auth: authClient,
};

export default httpClient;
