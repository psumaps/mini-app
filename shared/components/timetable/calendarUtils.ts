import { node } from "../../utils/selector";

export const classWeekday = "react-calendar__month-view__weekdays__weekday";
export const classTile = "react-calendar__tile";

export type ValuePiece = Date | null;
export type Value = ValuePiece | [ValuePiece, ValuePiece];
export type MonthInfo = { name: string; index: number; year: number };

export const months = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

export const weekdays = [
  "понедельник",
  "вторник",
  "среда",
  "четверг",
  "пятница",
  "суббота",
  "воскресенье",
];

export const monthRangeForward = 3;
export const monthRangeBackward = 2;
export const monthLockForward = 4;
export const monthLockBackward = 2;

export type SliceMonthConfig = {
  monthRangeForward: number;
  monthRangeBackward: number;
  monthLockForward: number;
  monthLockBackward: number;
};

/**
 * Возвращает начальную и конечную даты недели, содержащей указанную дату.
 *
 * @param {Date} date - Дата, для которой необходимо вычислить неделю.
 * @return {Value} Массив из двух элементов, содержащий начальную и конечную даты недели.
 */
export const getWeek = (date: Date): Value => {
  var first = date.getDate() - ((date.getDay() + 6) % 7); // getDay() returns 0 for Sunday;

  var firstday = new Date(new Date(date).setDate(first));
  var lastday = new Date(new Date(date).setDate(first + 6));
  firstday.setHours(0);
  firstday.setMinutes(0);
  firstday.setSeconds(0);
  lastday.setHours(23);
  lastday.setMinutes(59);
  lastday.setSeconds(59);
  return [firstday, lastday];
};

/**
 * Вырезает массив объектов MonthInfo на основе заданной даты и конфигурации.
 *
 * @param {Date} date - Дата, для которой осуществляется вырезка месяцев.
 * @param {SliceMonthConfig} [cfg] - Объект конфигурации для вырезки месяцев.
 * @param {number} [cfg.monthRangeForward] - Количество месяцев для вырезки вперед от заданной даты.
 * @param {number} [cfg.monthRangeBackward] - Количество месяцев для вырезки назад от заданной даты.
 * @param {number} [cfg.monthLockForward] - Количество месяцев для блокировки вперед от текущего месяца.
 * @param {number} [cfg.monthLockBackward] - Количество месяцев для блокировки назад от текущего месяца.
 * @return {MonthInfo[]} Массив объектов `MonthInfo`, представляющих вырезку месяцев.
 */
export const sliceMonths = (
  date: Date,
  cfg?: SliceMonthConfig
): MonthInfo[] => {
  cfg ??= {
    monthRangeForward,
    monthRangeBackward,
    monthLockForward,
    monthLockBackward,
  };

  const month = date.getMonth();
  const year = date.getFullYear();

  const lowerBorder = Math.max(
    month - cfg.monthRangeBackward,
    new Date().getMonth() - cfg.monthLockBackward
  );
  const upperBorder = Math.min(
    month + cfg.monthRangeForward,
    new Date().getMonth() + cfg.monthLockForward
  );

  var ret: MonthInfo[] = [];
  for (var i = lowerBorder; i <= upperBorder; i++) {
    var curI = i;
    var curY = year;
    if (curI < 0) {
      curI += 12;
      curY--;
    } else if (curI > 11) {
      curI -= 12;
      curY++;
    }
    ret.push({ name: months[curI], index: curI, year: curY });
  }
  return ret;
};

export const divNowId = "divNow";
export const divActiveId = "divActive";

export const calculateNowDiv = () => {
  const tileNow = node(".react-calendar__tile--now");
  const nowDiv = node(`#${divNowId}`);

  const tileNowRect = tileNow.getBoundingClientRect();
  nowDiv.setAttribute(
    "style",
    `top: ${tileNowRect.top}px; left: ${tileNowRect.left + tileNowRect.width / 2}px; width: ${tileNowRect.width}px; height: ${tileNowRect.width}px;`
  );
};

export const calculateNowDivMinified = () => {
  const weekdayNow = node(
    ".react-calendar__month-view__weekdays__weekday--now-minified"
  );
  const nowDiv = node(`#${divNowId}`);
  const weekdayNowRect = weekdayNow.getBoundingClientRect();
  nowDiv.setAttribute(
    "style",
    `top: ${weekdayNowRect.top}px; left: ${weekdayNowRect.left + weekdayNowRect.width / 2}px; width: ${weekdayNowRect.width}px;`
  );
};

export const calculateActiveDiv = () => {
  const activeDiv = node(`#${divActiveId}`);
  const tileActive = node(".react-calendar__tile--active");
  const tileActiveRect = tileActive.getBoundingClientRect();
    activeDiv.setAttribute(
      "style",
      `top: ${tileActiveRect.top}px; left: ${tileActiveRect.left + tileActiveRect.width / 2}px; width: ${tileActiveRect.width}px; height: ${tileActiveRect.width}px;`
    );
};

export const calculateActiveDivMinified = () => {
  const weekdayActive = node(
    ".react-calendar__month-view__weekdays__weekday--active-minified"
  );
  const activeDiv = node(`#${divActiveId}`);
  const weekdayActiveRect = weekdayActive.getBoundingClientRect();
  activeDiv.setAttribute(
    "style",
    `top: ${weekdayActiveRect.top}px; left: ${weekdayActiveRect.left + weekdayActiveRect.width / 2}px; width: ${weekdayActiveRect.width}px;`
  );
};