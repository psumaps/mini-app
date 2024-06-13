/*

API запросы в приложении разбиты на две группы:
- расписание занятий и событий из psu-tools
- геоинформация из mapi.ijo42.ru

*/

import mapiClient from './mapiClient';
import psuToolsClient from './psuToolsClient';

const httpClient = {
  mapi: mapiClient,
  psuTools: psuToolsClient,
};

export default httpClient;
