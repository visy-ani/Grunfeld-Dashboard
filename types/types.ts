export interface ProfileProps {
  name: string;
  email: string;
  role: string;
}

export interface ClassSchedule {
  id: number;
  class_name: string;
  time: string;
  instructor: string;
  room: string;
}

export interface ScheduleData {
  [date: string]: {
    classes: ClassSchedule[];
  };
}
  