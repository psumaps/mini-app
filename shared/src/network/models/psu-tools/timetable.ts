declare namespace Timetable {
  export interface Class {
    classNumber: number;
    discipline: string;
    type: string;
    place: string;
    teacher: string;
  }
  export interface Day {
    date: string;
    dayOfWeek: string;
    classes: Class[];
  }
}

export default interface GroupTimetable {
  groupName: string;
  groupId: number;
  weekNumber: number;
  days: Timetable.Day[];
}
