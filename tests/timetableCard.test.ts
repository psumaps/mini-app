import { describe, expect, it } from 'vitest';
// eslint-disable-next-line import/no-relative-packages
import classStatus from '../shared/src/components/timetable/timetableCard/classStatus';

describe('classStatus', () => {
  it('Class is in session (started 30 minutes ago)', () => {
    const now: Date = new Date();
    const classStartTime: Date = new Date(now.getTime() - 30 * 60 * 1000);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    expect(classStatus(classStartTime.toISOString())).toBe(true);
  });

  it('Class has not yet started (starts in 30 minutes)', () => {
    const now: Date = new Date();
    const classStartTime: Date = new Date(now.getTime() + 30 * 60 * 1000);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    expect(classStatus(classStartTime.toISOString())).toBe(false);
  });

  it('Class has already ended (ended 2 hours ago)', () => {
    const now: Date = new Date();
    const classStartTime: Date = new Date(now.getTime() - 2 * 60 * 60 * 1000);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    expect(classStatus(classStartTime.toISOString())).toBe(false);
  });

  it('Class ends exactly now', () => {
    const now: Date = new Date();
    const classStartTime: Date = new Date(now.getTime() - 95 * 60 * 1000);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    expect(classStatus(classStartTime.toISOString())).toBe(false);
  });

  it('Class starts exactly now', () => {
    const now: Date = new Date();
    const classStartTime: Date = new Date(now.getTime());
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    expect(classStatus(classStartTime.toISOString())).toBe(true);
  });

  it('Class is tomorrow but time is the same as now', () => {
    const now: Date = new Date();
    const tomorrow: Date = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    const classStartTime: Date = new Date(
      tomorrow.getFullYear(),
      tomorrow.getMonth(),
      tomorrow.getDate(),
      now.getHours(),
      now.getMinutes(),
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    expect(classStatus(classStartTime.toISOString())).toBe(false);
  });

  it('Class was year ago but time and date are the same as now', () => {
    const now: Date = new Date();
    const yearAgo: Date = new Date(now);
    yearAgo.setFullYear(now.getFullYear() - 1);
    const classStartTime: Date = new Date(
      yearAgo.getFullYear(),
      yearAgo.getMonth(),
      yearAgo.getDate(),
      now.getHours(),
      now.getMinutes(),
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    expect(classStatus(classStartTime.toISOString())).toBe(false);
  });
});
