import { async, VEvent } from 'node-ical';
import api from '../api';
import { Timetable } from '~/src/network/models/psu-tools/timetable';
import 'setimmediatenew'; // handle nodejs env
import { disciplineRegex, groupBy } from '../../utils/ical';

const mapFunc = (event: VEvent) => {
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
const client: { getTimetable: (token: string) => Promise<Timetable.Day[]> } = {
  getTimetable: (token: string) =>
    async
      .fromURL(`https://tiles2.ijo42.ru/proxy/${api.ical}${token}`)
      .then((calendar) => {
        const groupedEvents = groupBy<Timetable.Class & { d: Date }, string>(
          Object.values(calendar)
            .filter((k) => k.type === EVENT_KEY)
            .map((e) => e as VEvent)
            .map(mapFunc),
          (s) => s.d.toLocaleDateString('ru'),
        );

        return Object.entries(groupedEvents).map(([key, value]) => ({
          date: key,
          classes: value.sort((a, b) => a.d.getTime() - b.d.getTime()),
          dayOfWeek: '',
        }));
      }),
};

export default client;
