import { expect, test } from 'vitest';
// eslint-disable-next-line import/no-relative-packages
import { translateOpeningHours } from '../shared/src/network/models/mapi/poi';

test('translateOpeningHours', () => {
  expect(translateOpeningHours('Mo-Su 10:00-20:00')).toBe('Пн-Вс 10:00-20:00');

  expect(translateOpeningHours('Mo-We 10:00-20:00, Sa 10:00-18:00')).toBe(
    'Пн-Ср 10:00-20:00, Сб 10:00-18:00',
  );
});
