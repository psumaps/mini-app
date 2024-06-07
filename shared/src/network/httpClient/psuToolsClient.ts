import axios from 'axios';
import api from '../api';
import Faculty from '../models/psu-tools/faculty';
import GroupResponse from '../models/psu-tools/groupResponse';
import GroupTimetable from '../models/psu-tools/timetable';
import Filter from '../models/psu-tools/eventFilter';
import 'dotenv/config';

/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

const client = {
  timetable: {
    getFaculties: async (): Promise<Faculty[]> => {
      return axios
        .get(`${api.psuTools}/v1/faculties?apiKey=${process.env.PSU_TOOLS_KEY}`)
        .then((response) => response.data);
    },
    getGroups: async (facultyId: number): Promise<GroupResponse[]> => {
      return axios
        .get(
          `${api.psuTools}/v1/groups?facultyId=${facultyId}&apiKey=${process.env.PSU_TOOLS_KEY}`,
        )
        .then((response) => response.data);
    },
    getGroupTimetable: async (
      groupId: number,
      weekNumber: number,
    ): Promise<GroupTimetable> => {
      return axios
        .get(
          `${api.psuTools}/v1/timetable?groupId=${groupId}&weekNumber=${weekNumber}&apiKey=${process.env.PSU_TOOLS_KEY}`,
        )
        .then((response) => response.data);
    },
  },
  events: {
    getEvents: async (): Promise<Event[]> => {
      return axios
        .get(`${api.psuTools}/v2/events`)
        .then((response) => response.data.events);
    },
    getFilters: async (): Promise<Filter[]> => {
      return axios
        .get(`${api.psuTools}/v2/filters`)
        .then((response) => response.data);
    },
  },
};

export default client;
