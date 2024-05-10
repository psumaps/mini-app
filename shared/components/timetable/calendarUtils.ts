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
