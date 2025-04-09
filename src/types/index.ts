export type WeekType = 'even' | 'oneven' | 'beide';

export type WorkDay = {
  enabled: boolean;
  weekType: WeekType;
  hours: number;
};

export type WorkPattern = {
  daysPerWeek: number;
  hoursPerWeek: number;
  isFlexible: boolean;
  workDays: {
    maandag: WorkDay;
    dinsdag: WorkDay;
    woensdag: WorkDay;
    donderdag: WorkDay;
    vrijdag: WorkDay;
  };
};

export type LeaveType = 'GV' | 'AGV' | 'BOV' | 'VD';

export type LeaveBalance = {
  type: LeaveType;
  totalHours: number;
  remainingHours: number;
};

export type DailyLeaveDetail = {
  date: string;
  dayName: string;
  weekNumber: number;
  isWorkDay: boolean;
  hours: number;
  leaveTypes: {
    type: LeaveType;
    hours: number;
  }[];
  phase: string;
};

export type LeavePhase = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  workPattern: WorkPattern;
  leaveTypes: LeaveType[];
  priority: number;
};

export type UserData = {
  workPattern: WorkPattern;
  leaveBalances: LeaveBalance[];
  expectedDueDate?: Date;
  desiredStartDate?: Date;
  desiredLeaveDuration?: number;
  desiredWorkPatternAfterLeave?: WorkPattern;
  leavePhases: LeavePhase[];
};