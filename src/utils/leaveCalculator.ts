import { LeavePhase, LeaveType, WorkPattern, DailyLeaveDetail } from '../types';

const HOLIDAYS = new Set([
  // 2025
  '2025-01-01', // Nieuwjaarsdag
  '2025-04-18', // Goede Vrijdag
  '2025-04-21', // Tweede Paasdag
  '2025-04-27', // Koningsdag
  '2025-05-05', // Bevrijdingsdag
  '2025-05-29', // Hemelvaartsdag
  '2025-06-09', // Tweede Pinksterdag
  '2025-12-25', // Eerste Kerstdag
  '2025-12-26', // Tweede Kerstdag
  // 2026
  '2026-01-01', // Nieuwjaarsdag
  '2026-04-03', // Goede Vrijdag
  '2026-04-06', // Tweede Paasdag
  '2026-04-27', // Koningsdag
  '2026-05-05', // Bevrijdingsdag
  '2026-05-14', // Hemelvaartsdag
  '2026-05-25', // Tweede Pinksterdag
  '2026-12-25', // Eerste Kerstdag
  '2026-12-26', // Tweede Kerstdag
]);

interface PhaseSummary {
  name: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalHours: number;
  leaveTypes: { [key in LeaveType]?: number };
  workPattern: WorkPattern;
}

export interface LeaveCalculation {
  totalDays: number;
  totalHours: number;
  leaveTypeBreakdown: {
    type: LeaveType;
    days: number;
    hours: number;
    percentage: number;
    remainingHours: number;
  }[];
  warnings: string[];
  isValid: boolean;
  dailyDetails: DailyLeaveDetail[];
  phaseSummaries: { [key: string]: PhaseSummary };
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('nl-NL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function isHoliday(date: Date): boolean {
  const dateString = date.toISOString().split('T')[0];
  return HOLIDAYS.has(dateString);
}

function hasWorkPatternChanged(
  defaultPattern: WorkPattern,
  phasePattern: WorkPattern,
  dayName: string,
  isEvenWeek: boolean
): boolean {
  const defaultDay = defaultPattern.workDays[dayName as keyof WorkPattern['workDays']];
  const phaseDay = phasePattern.workDays[dayName as keyof WorkPattern['workDays']];

  if (defaultDay.enabled !== phaseDay.enabled) return true;
  if (!defaultDay.enabled && !phaseDay.enabled) return false;
  if (defaultDay.weekType !== phaseDay.weekType) return true;
  if (defaultDay.hours !== phaseDay.hours) return true;
  if (defaultDay.weekType === 'beide' && phaseDay.weekType === 'beide') return false;
  if (defaultDay.weekType === 'even' && phaseDay.weekType === 'even' && isEvenWeek) return false;
  if (defaultDay.weekType === 'oneven' && phaseDay.weekType === 'oneven' && !isEvenWeek) return false;

  return true;
}

export function calculateLeaveRequest(
  phases: LeavePhase[],
  initialLeaveHours: { [key in LeaveType]: number },
  defaultPattern: WorkPattern
): LeaveCalculation {
  const result: LeaveCalculation = {
    totalDays: 0,
    totalHours: 0,
    leaveTypeBreakdown: [],
    warnings: [],
    isValid: true,
    dailyDetails: [],
    phaseSummaries: {}
  };

  if (!phases.length) {
    return result;
  }

  const leaveTypeUsage = new Map<LeaveType, { days: number; hours: number }>();
  const remainingHours = { ...initialLeaveHours };
  const phaseSummaries: { [key: string]: PhaseSummary } = {};

  const sortedPhases = [...phases].sort((a, b) => 
    new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  for (const phase of sortedPhases) {
    if (!phase.startDate || !phase.endDate) {
      const warning = `Fase "${phase.name}" mist start- of einddatum`;
      result.warnings.push(warning);
      result.isValid = false;
      continue;
    }

    const phaseSummary: PhaseSummary = {
      name: phase.name,
      startDate: phase.startDate,
      endDate: phase.endDate,
      totalDays: 0,
      totalHours: 0,
      leaveTypes: {},
      workPattern: phase.workPattern
    };

    const start = new Date(phase.startDate);
    const end = new Date(phase.endDate);
    let currentDate = new Date(start);

    while (currentDate <= end) {
      const dayOfWeek = currentDate.getDay();
      const dayName = getDutchDayName(dayOfWeek).toLowerCase();
      const weekNumber = getWeekNumber(currentDate);
      const isEvenWeek = weekNumber % 2 === 0;
      const dateString = currentDate.toISOString().split('T')[0];
      const isHolidayDate = isHoliday(currentDate);

      const defaultWorkDay = defaultPattern.workDays[dayName as keyof WorkPattern['workDays']];
      const isNormallyWorkDay = defaultWorkDay?.enabled && (
        defaultWorkDay.weekType === 'beide' ||
        (defaultWorkDay.weekType === 'even' && isEvenWeek) ||
        (defaultWorkDay.weekType === 'oneven' && !isEvenWeek)
      );

      const phaseWorkDay = phase.workPattern.workDays[dayName as keyof WorkPattern['workDays']];
      const isPhaseWorkDay = phaseWorkDay?.enabled && (
        phaseWorkDay.weekType === 'beide' ||
        (phaseWorkDay.weekType === 'even' && isEvenWeek) ||
        (phaseWorkDay.weekType === 'oneven' && !isEvenWeek)
      );

      const dailyDetail: DailyLeaveDetail = {
        date: dateString,
        dayName: getDutchDayName(dayOfWeek),
        weekNumber,
        isWorkDay: isNormallyWorkDay && !isHolidayDate,
        hours: isNormallyWorkDay ? defaultWorkDay.hours : 0,
        leaveTypes: [],
        phase: phase.name
      };

      if (dayOfWeek === 0 || dayOfWeek === 6) {
        // Weekend days
        dailyDetail.isWorkDay = false;
        dailyDetail.hours = 0;
      } else if (isHolidayDate) {
        // Holiday
        dailyDetail.isWorkDay = false;
        dailyDetail.hours = isNormallyWorkDay ? defaultWorkDay.hours : 0;
      } else if (!isNormallyWorkDay) {
        // Standard free day in work pattern
        dailyDetail.isWorkDay = false;
        dailyDetail.hours = 0;
      } else {
        // Regular work day or leave day
        const workPatternChanged = hasWorkPatternChanged(
          defaultPattern,
          phase.workPattern,
          dayName,
          isEvenWeek
        );

        const isLeaveDay = workPatternChanged && phase.leaveTypes.length > 0;
        
        if (isLeaveDay) {
          result.totalDays++;
          phaseSummary.totalDays++;
          
          const defaultHours = defaultWorkDay.hours;
          result.totalHours += defaultHours;
          phaseSummary.totalHours += defaultHours;

          const priorityOrder: LeaveType[] = ['GV', 'AGV', 'BOV', 'VD'];
          const sortedLeaveTypes = phase.leaveTypes
            .slice()
            .sort((a, b) => priorityOrder.indexOf(a) - priorityOrder.indexOf(b));

          let remainingDayHours = defaultHours;

          for (const leaveType of sortedLeaveTypes) {
            if (remainingDayHours <= 0) break;
            
            if (remainingHours[leaveType] > 0) {
              const hoursToApply = Math.min(remainingDayHours, remainingHours[leaveType]);
              
              const current = leaveTypeUsage.get(leaveType) || { days: 0, hours: 0 };
              leaveTypeUsage.set(leaveType, {
                days: current.days + (hoursToApply / defaultHours),
                hours: current.hours + hoursToApply
              });

              remainingHours[leaveType] -= hoursToApply;
              remainingDayHours -= hoursToApply;

              dailyDetail.leaveTypes.push({
                type: leaveType,
                hours: hoursToApply
              });

              // Update phase summary
              phaseSummary.leaveTypes[leaveType] = (phaseSummary.leaveTypes[leaveType] || 0) + hoursToApply;
            }
          }

          if (remainingDayHours > 0) {
            const warning = `Onvoldoende verlofuren beschikbaar voor ${formatDate(currentDate)}`;
            result.warnings.push(warning);
            result.isValid = false;
          }
        }
      }

      result.dailyDetails.push(dailyDetail);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    phaseSummaries[phase.id] = phaseSummary;
  }

  const leaveTypeOrder: LeaveType[] = ['GV', 'AGV', 'BOV', 'VD'];
  for (const type of leaveTypeOrder) {
    const usage = leaveTypeUsage.get(type) || { days: 0, hours: 0 };
    const totalHours = initialLeaveHours[type];
    const usedHours = usage.hours;
    
    const breakdown = {
      type,
      days: Math.round(usage.days * 10) / 10,
      hours: Math.round(usedHours * 10) / 10,
      percentage: totalHours > 0 ? Math.round((usedHours / totalHours) * 100) : 0,
      remainingHours: Math.round((totalHours - usedHours) * 10) / 10
    };

    result.leaveTypeBreakdown.push(breakdown);
  }

  result.phaseSummaries = phaseSummaries;
  validateLeaveTypeRequirements(result);
  
  return result;
}

function validateLeaveTypeRequirements(calculation: LeaveCalculation) {
  const gv = calculation.leaveTypeBreakdown.find(b => b.type === 'GV');
  const agv = calculation.leaveTypeBreakdown.find(b => b.type === 'AGV');
  const bov = calculation.leaveTypeBreakdown.find(b => b.type === 'BOV');

  if (gv && gv.days > 5) {
    calculation.warnings.push('Geboorteverlof (GV) mag maximaal 5 werkdagen zijn');
    calculation.isValid = false;
  }

  if (agv && agv.days > 25) {
    calculation.warnings.push('Aanvullend geboorteverlof (AGV) mag maximaal 25 werkdagen zijn');
    calculation.isValid = false;
  }

  if (bov && bov.days > 45) {
    calculation.warnings.push('Betaald ouderschapsverlof (BOV) mag maximaal 45 werkdagen zijn');
    calculation.isValid = false;
  }
}

function getDutchDayName(dayNumber: number): string {
  const days = [
    'Zondag',
    'Maandag',
    'Dinsdag',
    'Woensdag',
    'Donderdag',
    'Vrijdag',
    'Zaterdag'
  ];
  return days[dayNumber];
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}
