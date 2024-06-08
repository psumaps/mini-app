import axios from 'axios';
import api from '../api';
import Faculty from '../models/psu-tools/faculty';
import GroupResponse from '../models/psu-tools/groupResponse';
import GroupTimetable from '../models/psu-tools/timetable';
import Filter from '../models/psu-tools/eventFilter';
import 'dotenv/config';

/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

const client = {
  timetable: {
    getFaculties: async (): Promise<Faculty[]> => {
      const response = await axios.get(
        `${api.psuTools}/v1/faculties?apiKey=${process.env.PSU_TOOLS_KEY}`,
      );
      return response.data;
    },
    getGroups: async (facultyId: number): Promise<GroupResponse[]> => {
      const response = await axios.get(
        `${api.psuTools}/v1/groups?facultyId=${facultyId}&apiKey=${process.env.PSU_TOOLS_KEY}`,
      );
      return response.data;
    },
    getGroupTimetable: async (
      groupId: number,
      weekNumber: number,
    ): Promise<GroupTimetable> => {
      const response = await axios.get(
        `${api.psuTools}/v1/timetable?groupId=${groupId}&weekNumber=${weekNumber}&apiKey=${process.env.PSU_TOOLS_KEY}`,
      );
      return response.data;
    },
  },
  events: {
    getEvents: async (): Promise<Event[]> => {
      const response = await axios.get(`${api.psuTools}/v2/events`);
      return response.data.events;
    },
    getFilters: async (): Promise<Filter[]> => {
      const response = await axios.get(`${api.psuTools}/v2/filters`);
      return response.data;
    },
  },
};

export default client;
