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
 * @return {[Date, Date]} Массив из двух элементов, содержащий начальную и конечную даты недели.
 */
export const getWeek = (date: Date): [Date, Date] => {
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

/**
 * Проверяет, совпадает ли день недели с заданной датой.
 *
 * @param {Element} weekday - День недели для сравнения.
 * @param {Date} date - Дата для сравнения.
 * @return {boolean} Возвращает true, если день недели совпадает с датой, в противном случае возвращает false.
 */
export const weekdaysEqual = (weekday: Element, date: Date) => {
  return (
    (weekday.childNodes[0] as HTMLSpanElement).getAttribute("aria-label") ===
    weekdays[((date as Date).getDay() + 6) % 7] // getDay() returns 0 for Sunday
  );
};

export const divNowId = "divNow";
export const divActiveId = "divActive";

export const calculateRectCenter = (rect: DOMRect) => {
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  }
}

export const calculateSide = (rect: DOMRect) => {
  const greater_side = Math.max(rect.width, rect.height);
  const lesser_side = Math.min(rect.width, rect.height);
  const interpolation_coefficient = 0.5 / (greater_side / lesser_side);

  const interpolate = (from: number, to: number) => {
    return from + (to - from) * interpolation_coefficient;
  }
  return interpolate(lesser_side, greater_side);
}

export const calculateNowDiv = () => {
  const tileNow = node(`.${classTile}--now`);
  const nowDiv = node(`#${divNowId}`);
  const tileNowRect = tileNow.getBoundingClientRect();

  const side = calculateSide(tileNowRect);
  const center = calculateRectCenter(tileNowRect);
  nowDiv.setAttribute(
    "style",
    `top: ${center.y}px; left: ${center.x}px; width: ${side}px; height: ${side}px;`
  );
};

export const calculateNowDivMinified = () => {
  const weekdayNow = node(
    `.${classWeekday}--now-minified`
  );
  if (!weekdayNow) return;
  const nowDiv = node(`#${divNowId}`);
  const weekdayNowRect = weekdayNow.getBoundingClientRect();

  const side = calculateSide(weekdayNowRect);
  const center = calculateRectCenter(weekdayNowRect);
  nowDiv.setAttribute(
    "style",
    `top: ${center.y}px; left: ${center.x}px; width: ${side}px;`
  );
};

export const calculateActiveDiv = () => {
  const activeDiv = node(`#${divActiveId}`);
  const tileActive = node(`.${classTile}--active`);
  const tileActiveRect = tileActive.getBoundingClientRect();

  const side = calculateSide(tileActiveRect);
  const center = calculateRectCenter(tileActiveRect);
  activeDiv.setAttribute(
    "style",
    `top: ${center.y}px; left: ${center.x}px; width: ${side}px; height: ${side}px;`
  );
};

export const calculateActiveDivMinified = () => {
  const weekdayActive = node(
    `.${classWeekday}--active-minified`
  );
  if (!weekdayActive) return;
  const activeDiv = node(`#${divActiveId}`);
  const weekdayActiveRect = weekdayActive.getBoundingClientRect();

  const side = calculateSide(weekdayActiveRect);
  const center = calculateRectCenter(weekdayActiveRect);
  activeDiv.setAttribute(
    "style",
    `top: ${center.y}px; left: ${center.x}px; width: ${side}px;`
  );
};
