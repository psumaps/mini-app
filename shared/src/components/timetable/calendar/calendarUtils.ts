import { node } from '../../../utils/selector';

export const classWeekday = 'react-calendar__month-view__weekdays__weekday';
export const classTile = 'react-calendar__tile';

export type ValuePiece = Date | null;
export type Value = ValuePiece | [ValuePiece, ValuePiece];
export type MonthInfo = { name: string; index: number; year: number };

export const months = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];

export const weekdays = [
  'понедельник',
  'вторник',
  'среда',
  'четверг',
  'пятница',
  'суббота',
  'воскресенье',
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
 * @return {[Date, Date]} Массив из двух элементов, содержащий начальную и конечную даты недели.
 */
export const getWeek = (date: Date): [Date, Date] => {
  const first = date.getDate() - ((date.getDay() + 6) % 7); // getDay() returns 0 for Sunday;

  const firstday = new Date(new Date(date).setDate(first));
  const lastday = new Date(new Date(date).setDate(first + 6));
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
  cfg: SliceMonthConfig = {
    monthRangeForward,
    monthRangeBackward,
    monthLockForward,
    monthLockBackward,
  },
): MonthInfo[] => {
  const month = date.getMonth();
  const year = date.getFullYear();

  const lowerBorder = Math.max(
    month - cfg.monthRangeBackward,
    new Date().getMonth() - cfg.monthLockBackward,
  );
  const upperBorder = Math.min(
    month + cfg.monthRangeForward,
    new Date().getMonth() + cfg.monthLockForward,
  );

  const ret: MonthInfo[] = [];
  for (let i = lowerBorder; i <= upperBorder; i++) {
    let curI = i;
    let curY = year;
    if (curI < 0) {
      curI += 12;
      curY -= 1;
    } else if (curI > 11) {
      curI -= 12;
      curY += 1;
    }
    ret.push({ name: months[curI], index: curI, year: curY });
  }
  return ret;
};

/**
 * Проверяет, совпадает ли день недели с заданной датой.
 *
 * @param {Element} weekday - День недели для сравнения.
 * @param {Date} date - Дата для сравнения.
 * @return {boolean} Возвращает true, если день недели совпадает с датой, в противном случае возвращает false.
 */
export const weekdaysEqual = (weekday: Element, date: Date) => {
  return (
    (weekday.childNodes[0] as HTMLSpanElement).getAttribute('aria-label') ===
    weekdays[(date.getDay() + 6) % 7] // getDay() returns 0 for Sunday
  );
};

export const divNowId = 'divNow';
export const divActiveId = 'divActive';
export const calendarId = 'custom-calendar';

export const minificationFrameTime = 50;

type RectSimplified = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export const calculateRectCenter = (rect: RectSimplified) => {
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
};

export const calculateSide = (rect: RectSimplified) => {
  const greaterSide = Math.max(rect.width, rect.height);
  const lesserSide = Math.min(rect.width, rect.height);
  const interpolationCoefficient = 0.5 / (greaterSide / lesserSide);

  const interpolate = (from: number, to: number) => {
    return from + (to - from) * interpolationCoefficient;
  };
  return interpolate(lesserSide, greaterSide);
};

export const calculateDiv = (id: string, tileClass: string) => {
  const div = node(`#${id}`);
  const tile = node(`.${tileClass}`);
  const tileRect = tile!.getBoundingClientRect();
  const calendarRect = node(`#${calendarId}`)!.getBoundingClientRect();
  const rect: RectSimplified = {
    left: tileRect.left - calendarRect.left,
    top: tileRect.top - calendarRect.top,
    width: tileRect.width,
    height: tileRect.height,
  };

  const side = 1.1 * calculateSide(rect);
  const center = calculateRectCenter(rect);
  div!.setAttribute(
    'style',
    `top: ${center.y + 0.05 * side}px; left: ${center.x}px; width: ${side}px; height: ${side}px;`,
  );
};

export const calculateMinifiedDiv = (id: string, weekdayClass: string) => {
  const weekday = node(`.${weekdayClass}`);
  if (!weekday) return;
  const div = node(`#${id}`);
  const weekdayRect = weekday.getBoundingClientRect();
  const calendarRect = node(`#${calendarId}`)!.getBoundingClientRect();
  const rect: RectSimplified = {
    left: weekdayRect.left - calendarRect.left,
    top: weekdayRect.top - calendarRect.top,
    width: weekdayRect.width,
    height: weekdayRect.height,
  };

  const side = calculateSide(rect);
  const center = calculateRectCenter(rect);
  div!.setAttribute(
    'style',
    `top: ${center.y}px; left: ${center.x}px; width: ${side * 0.9}px; height: ${side * 1.85}px;`,
  );
};
