import axios from 'axios';
import api from '../api';
import Faculty from '../models/psu-tools/faculty';
import GroupResponse from '../models/psu-tools/groupResponse';
import GroupTimetable from '../models/psu-tools/timetable';
import Filter from '../models/psu-tools/eventFilter';
import Event from '../models/psu-tools/event';

const client = {
  timetable: {
    getFaculties: async () => {
      const response = await axios.get<Faculty[]>(
        `${api.psuTools}/timetable-api/faculties?apiKey=${import.meta.env.VITE_PSU_TOOLS_KEY}`,
      );
      return response.data;
    },
    getGroups: async (facultyId: number) => {
      const response = await axios.get<GroupResponse[]>(
        `${api.psuTools}/timetable-api/groups?facultyId=${facultyId}&apiKey=${import.meta.env.VITE_PSU_TOOLS_KEY}`,
      );
      return response.data;
    },
    getGroupTimetable: async (groupId: number, weekNumber?: number) => {
      const response = await axios.get<GroupTimetable>(
        `${api.psuTools}/timetable-api/groups/${groupId}/timetable?apiKey=${import.meta.env.VITE_PSU_TOOLS_KEY}${weekNumber ? `&weekNumber=${weekNumber}` : ''}`,
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
      const response = await axios.get<Event[]>(
        `${api.psuTools}/events-api/events?pageNumber=${offset}&pageSize=${limit}&dateFrom=${
          new Date(dateFrom.getTime() - dateFrom.getTimezoneOffset() * 60000)
            .toISOString()
            .split('.')[0]
        }`,
      );
      return response.data;
    },
    getEvent: async (eventId: number) => {
      const response = await axios.get<Event>(
        `${api.psuTools}/events-api/events/${eventId}`,
      );
      return response.data;
    },
    getFilters: async () => {
      const response = await axios.get<Filter[]>(`${api.psuTools}/v2/filters`);
      return response.data;
    },
  },
};

export default client;
