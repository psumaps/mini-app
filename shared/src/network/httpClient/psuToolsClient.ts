import axios from 'axios';
import api from '../api';
import Faculty from '../models/psu-tools/faculty';
import GroupResponse from '../models/psu-tools/groupResponse';
import GroupTimetable from '../models/psu-tools/timetable';
import Filter from '../models/psu-tools/eventFilter';

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
    getGroupTimetable: async (groupId: number, weekNumber: number) => {
      const response = await axios.get<GroupTimetable>(
        `${api.psuTools}/v1/timetable?groupId=${groupId}&weekNumber=${weekNumber}&apiKey=${import.meta.env.VITE_PSU_TOOLS_KEY}`,
      );
      return response.data;
    },
  },
  events: {
    getEvents: async () => {
      const response = await axios.get<{ events: Event[] }>(
        `${api.psuTools}/v2/events`,
      );
      return response.data.events;
    },
    getFilters: async () => {
      const response = await axios.get<Filter[]>(`${api.psuTools}/v2/filters`);
      return response.data;
    },
  },
};

export default client;
