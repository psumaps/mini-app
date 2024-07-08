import axios from 'axios';
import api from '../api';
import Faculty from '../models/psu-tools/faculty';
import GroupResponse from '../models/psu-tools/groupResponse';
import { Timetable } from '../models/psu-tools/timetable';
import Filter from '../models/psu-tools/eventFilter';
import Event from '../models/psu-tools/event';

const client = {
  timetable: {
    getFaculties: async () => {
      const response = await axios.get<Faculty[]>(
        `${api.psuTools}/v1/faculties?apiKey=${import.meta.env.VITE_PSU_TOOLS_KEY}`,
      );
      return response.data;
    },
    getGroups: async (facultyId: number) => {
      const response = await axios.get<GroupResponse[]>(
        `${api.psuTools}/v1/groups?facultyId=${facultyId}&apiKey=${import.meta.env.VITE_PSU_TOOLS_KEY}`,
      );
      return response.data;
    },
    getGroupTimetable: async (groupId: number, date?: Date) => {
      const response = await axios.get<Timetable.Day>(
        `${api.psuTools}/v1/groups/${groupId}/timetable?apiKey=${import.meta.env.VITE_PSU_TOOLS_KEY}${
          date
            ? `&date=${
                new Date(date.getTime() - date.getTimezoneOffset() * 60000)
                  .toISOString()
                  .split('T')[0]
              }`
            : ''
        }`,
      );
      return response.data;
    },
  },
  events: {
    getEvents: async ({
      dateFrom,
      offset = 1,
      limit,
    }: {
      dateFrom: Date;
      offset: number;
      limit: number;
    }) => {
      const response = await axios.get<{ events: Event[] }>(
        `${api.psuTools}/v2/events?offset=${offset}&limit=${limit}&dateFrom=${
          new Date(dateFrom.getTime() - dateFrom.getTimezoneOffset() * 60000)
            .toISOString()
            .split('.')[0]
        }`,
      );
      return response.data.events;
    },
    getEvent: async (eventId: number) => {
      const response = await axios.get<{ event: Event }>(
        `${api.psuTools}/v2/events/${eventId}`,
      );
      return response.data.event;
    },
    getFilters: async () => {
      const response = await axios.get<Filter[]>(`${api.psuTools}/v2/filters`);
      return response.data;
    },
  },
};

export default client;
