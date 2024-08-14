import { async, DateWithTimeZone, VEvent } from 'node-ical';
import api from '../api';
import { Timetable } from '~/src/network/models/psu-tools/timetable';
import 'setimmediatenew'; // handle nodejs env
import { disciplineRegex, groupBy } from '../../utils/ical';

const client: { getTimetable: (token: string) => Promise<Timetable.Day[]> } = {
  getTimetable: (token: string) =>
    async
      .fromURL(`https://tiles2.ijo42.ru/proxy/${api.ical}${token}`)
      .then((calendar) => {
        const groupedEvents = groupBy<
          Timetable.Class & { date: DateWithTimeZone }
        >(
          Object.values(calendar)
            .filter((k) => k.type === 'VEVENT')
            .map((e) => e as VEvent)
            .map((event) => {
              const [, discipline, type] = disciplineRegex.exec(
                event.summary,
              ) ?? [undefined, event.summary, ''];
              return {
                place: event.location,
                discipline,
                teacher: event.description,
                type,
                classNumber: event.uid,
                date: event.start,
                time: event.start.toLocaleTimeString('ru', {
                  hour: 'numeric',
                  minute: 'numeric',
                }),
              };
            }),
          (s) => s.date.toLocaleDateString('ru'),
        );

        const days: Timetable.Day[] = [];
        for (const k in groupedEvents) {
          days.push({
            date: k,
            classes: groupedEvents[k].sort(
              (a, b) => a.date.getTime() - b.date.getTime(),
            ),
            dayOfWeek: '',
          });
        }
        return days;
      }),
};

export default client;
