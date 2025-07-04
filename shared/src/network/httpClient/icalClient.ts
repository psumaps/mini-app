import { async, VEvent } from 'node-ical';
import axios from 'axios';
import api from '../api';
import { Timetable } from '~/src/network/models/psu-tools/timetable';
import 'setimmediatenew'; // handle nodejs env
import { disciplineRegex, groupBy } from '../../utils/ical';

const formClassObject: (event: VEvent) => Timetable.Class & { d: Date } = (
  event: VEvent,
) => {
  const [, discipline, type] = disciplineRegex.exec(event.summary) ?? [
    undefined,
    event.summary,
    '',
  ];
  return {
    type,
    discipline,
    d: event.start,
    place: event.location,
    teacher: event.description,
    classId: event.uid,
    date: event.start.toISOString(),
    time: event.start.toLocaleTimeString('ru', {
      hour: 'numeric',
      minute: 'numeric',
    }),
  };
};

const EVENT_KEY = 'VEVENT';
const client = {
  getTimetable: async ({
    token,
    timeout = 3000,
  }: {
    token: string;
    timeout?: number;
  }) => {
    const response = await axios.get<string>(
      `https://tiles2.ijo42.ru/proxy/${api.ical}${token}`,
      { signal: AbortSignal.timeout(timeout) },
    );

    if (!response.data?.startsWith('BEGIN')) {
      throw new Error('Invalid ICAL response');
    }

    return async.parseICS(response.data).then((calendar) => {
      const groupedEvents = groupBy(
        Object.values(calendar)
          .filter((k) => k.type === EVENT_KEY)
          .map((e) => e as VEvent)
          .map(formClassObject),
        (s) => s.d.toLocaleDateString('ru'),
      );

      return Object.entries(groupedEvents).map(([key, value]) => ({
        date: key,
        classes: value.sort((a, b) => a.d.getTime() - b.d.getTime()),
        dayOfWeek: '',
      }));
    });
  },
};

export default client;
