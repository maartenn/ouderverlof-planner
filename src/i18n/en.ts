export const en = {
  common: {
    loading: 'Loading...',
    share: 'Share Planning',
    copied: 'URL copied to clipboard',
    language: 'Language',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    add: 'Add',
    export: 'Export',
    total: 'Total',
    hours: 'hours',
    days: 'days',
    week: 'week',
    weeks: 'weeks',
    workDay: 'Work Day',
    weekType: 'Week Type',
    hours_per_day: 'Hours per day',
    expand: 'Expand phase details',
    collapse: 'Collapse phase details',
    moveUp: 'Move phase up',
    moveDown: 'Move phase down'
  },
  nav: {
    planner: 'Leave Planner',
    leaveInfo: 'Leave Regulations',
    guide: 'Guide',
    disclaimer: 'Disclaimer'
  },
  planner: {
    title: 'Parental Leave Planning',
    summary: {
      title: 'Leave Calculation',
      totalDays: 'Total days',
      totalHours: 'Total hours',
      hideWeekends: 'Hide weekends',
      showWeekends: 'Show weekends',
      exportExcel: 'Export to Excel',
      exportPdf: 'Export to PDF',
      validPlan: 'The leave request meets all requirements',
      warnings: 'Warning! Problems were found:',
      phaseOverview: 'Phase Overview',
      leaveDays: 'Leave days',
      leaveHours: 'Leave hours',
      from: 'of',
      remaining: 'remaining'
    },
    workPattern: {
      title: 'Work Pattern',
      configuration: 'Work pattern configuration',
      days: {
        maandag: 'Monday',
        dinsdag: 'Tuesday',
        woensdag: 'Wednesday',
        donderdag: 'Thursday',
        vrijdag: 'Friday',
        zaterdag: 'Saturday',
        zondag: 'Sunday'
      },
      weekTypes: {
        both: 'Every week',
        even: 'Even weeks',
        odd: 'Odd weeks'
      }
    },
    personalData: {
      title: 'Personal Details',
      contractHours: 'Contract hours per week',
      dueDate: 'Expected due date',
      contractHoursHelp: 'The number of contract hours per week determines the available leave hours',
      dueDateHelp: 'The expected date of birth'
    },
    leaveHours: {
      title: 'Available Leave Hours',
      gvHelp: 'Birth Leave: One-time leave immediately after birth (1 week, 100% salary)',
      agvHelp: 'Additional Birth Leave: Extra leave within 6 months after birth (5 weeks, 70% salary)',
      bovHelp: 'Paid Parental Leave: Leave within the first year (9 weeks, 70% salary)',
      vdHelp: 'Vacation Hours: Regular vacation hours (100% salary)',
      weekLeave: '1 week leave',
      fiveWeeks: '5 weeks leave (70% salary)',
      nineWeeks: '9 weeks leave (70% salary)',
      twentyDays: 'Statutory minimum (20 days)'
    },
    phases: {
      title: 'Leave Phases',
      addPhase: 'Add Phase',
      phaseName: 'Name',
      leaveTypes: 'Leave Types',
      startDate: 'Start Date',
      endDate: 'End Date',
      workPatternTitle: 'Work pattern during this phase'
    }
  },
  leaveTypes: {
    GV: 'Birth Leave',
    AGV: 'Additional Birth Leave',
    BOV: 'Paid Parental Leave',
    VD: 'Vacation Days'
  },
  dayTypes: {
    weekend: 'Weekend',
    holiday: 'Holiday',
    standardFreeDay: 'Standard free day',
    work: 'Work',
    leave: 'Leave'
  },
  errors: {
    fillDueDate: 'Please fill in the due date first',
    fillPreviousEndDate: 'Please fill in the end date of the previous phase first',
    startBeforeEnd: 'Start date must be before end date',
    startOnWorkday: 'Start date must be on a workday',
    endOnWorkday: 'End date must be on a workday',
    phaseOverlap: 'Phase {0} overlaps with phase {1}',
    connectPhases: 'Must connect directly to the previous phase (next workday)',
    insufficientHours: 'Insufficient leave hours available for {0}'
  }
};
