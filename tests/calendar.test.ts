import { expect, test } from "vitest";
import {
  sliceMonths,
  getWeek,
  monthRangeBackward,
  monthRangeForward,
  monthLockBackward,
} from "../shared/components/timetable/calendarUtils";

test("sliceMonths() without lock", () => {
  const cfg = {
    monthRangeForward,
    monthRangeBackward,
    monthLockForward: Infinity,
    monthLockBackward: Infinity,
  };
  const expectedLength = 1 + monthRangeForward + monthRangeBackward;
  const lowerMonth = (initial: number) =>
    initial - monthRangeBackward < 0
      ? initial - monthRangeBackward + 12
      : initial - monthRangeBackward;
  const upperMonth = (initial: number) =>
    initial + monthRangeForward > 11
      ? initial + monthRangeForward - 12
      : initial + monthRangeForward;

  const slicedMay = sliceMonths(new Date("2024-05-01"), cfg);
  expect(slicedMay).toHaveLength(expectedLength);
  expect(slicedMay[0].index).toBe(lowerMonth(4));
  expect(slicedMay[0].year).toBe(2024);
  expect(slicedMay[expectedLength - 1].index).toBe(upperMonth(4));
  expect(slicedMay[expectedLength - 1].year).toBe(2024);

  const slicedJan = sliceMonths(new Date("2024-01-01"), cfg);
  expect(slicedJan).toHaveLength(expectedLength);
  expect(slicedJan[0].index).toBe(lowerMonth(0));
  expect(slicedJan[0].year).toBe(2023);
  expect(slicedJan[expectedLength - 1].index).toBe(upperMonth(0));
  expect(slicedJan[expectedLength - 1].year).toBe(2024);

  const slicedDec = sliceMonths(new Date("2024-12-01"), cfg);
  expect(slicedDec).toHaveLength(expectedLength);
  expect(slicedDec[0].index).toBe(lowerMonth(11));
  expect(slicedDec[0].year).toBe(2024);
  expect(slicedDec[expectedLength - 1].index).toBe(upperMonth(11));
  expect(slicedDec[expectedLength - 1].year).toBe(2025);
});

test('sliceMonths() with lock', () => {
  const fw = 2;
  const bw = 2;
  const cfg = {
    monthRangeForward: fw,
    monthRangeBackward: bw,
    monthLockForward: fw,
    monthLockBackward: bw,
  }
  const lowerMonth = (initial: number) =>
    initial - cfg.monthRangeBackward < 0
      ? initial - cfg.monthRangeBackward + 12
      : initial - cfg.monthRangeBackward;
  const upperMonth = (initial: number) =>
    initial + cfg.monthRangeForward > 11
      ? initial + cfg.monthRangeForward - 12
      : initial + cfg.monthRangeForward;

  const slicedToday = sliceMonths(new Date(), cfg);
  expect(slicedToday.length).toBe(cfg.monthLockBackward + cfg.monthLockForward + 1);
  expect(slicedToday[0].index).toBe(lowerMonth((new Date()).getMonth()));
  expect(slicedToday[cfg.monthRangeBackward].year).toBe((new Date()).getFullYear());
  expect(slicedToday[slicedToday.length - 1].index).toBe(upperMonth((new Date()).getMonth()));
});

test("getWeek()", () => {
  var week = getWeek(new Date("2024-05-01"));
  expect(week).toEqual([
    new Date("2024-04-29 00:00:00"),
    new Date("2024-05-05 23:59:59"),
  ]);

  week = getWeek(new Date("2024-05-30"));
  expect(week).toEqual([
    new Date("2024-05-27 00:00:00"),
    new Date("2024-06-02 23:59:59"),
  ]);

  week = getWeek(new Date("2024-05-16"));
  expect(week).toEqual([
    new Date("2024-05-13 00:00:00"),
    new Date("2024-05-19 23:59:59"),
  ]);

  week = getWeek(new Date("2024-05-13"));
  expect(week).toEqual([
    new Date("2024-05-13 00:00:00"),
    new Date("2024-05-19 23:59:59"),
  ]);

  week = getWeek(new Date("2024-05-12"));
  expect(week).toEqual([
    new Date("2024-05-06 00:00:00"),
    new Date("2024-05-12 23:59:59"),
  ]);
});
