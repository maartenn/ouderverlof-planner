export const nl = {
  common: {
    loading: 'Laden...',
    share: 'Deel Planning',
    copied: 'URL gekopieerd naar klembord',
    language: 'Taal',
    save: 'Opslaan',
    cancel: 'Annuleren',
    edit: 'Bewerken',
    delete: 'Verwijderen',
    add: 'Toevoegen',
    export: 'Exporteren',
    total: 'Totaal',
    hours: 'uren',
    days: 'dagen',
    week: 'week',
    weeks: 'weken',
    workDay: 'Werkdag',
    weekType: 'Week Type',
    hours_per_day: 'Uren per dag',
    expand: 'Toon fase details',
    collapse: 'Verberg fase details',
    moveUp: 'Verplaats fase omhoog',
    moveDown: 'Verplaats fase omlaag'
  },
  nav: {
    planner: 'Verlofplanner',
    leaveInfo: 'Verlofregeling',
    guide: 'Handleiding',
    disclaimer: 'Disclaimer'
  },
  planner: {
    title: 'Verlofplanning voor Gezinsuitbreiding',
    summary: {
      title: 'Verlofberekening',
      totalDays: 'Totaal aantal dagen',
      totalHours: 'Totaal aantal uren',
      hideWeekends: 'Verberg weekenden',
      showWeekends: 'Toon weekenden',
      exportExcel: 'Exporteer naar Excel',
      exportPdf: 'Exporteer naar PDF',
      validPlan: 'De verlofaanvraag voldoet aan alle vereisten',
      warnings: 'Let op! Er zijn problemen gevonden:',
      phaseOverview: 'Overzicht per fase',
      leaveDays: 'Verlofdagen',
      leaveHours: 'Verlofuren',
      from: 'van',
      remaining: 'resterend'
    },
    workPattern: {
      title: 'Werkpatroon',
      configuration: 'Werkpatroon configuratie',
      days: {
        maandag: 'Maandag',
        dinsdag: 'Dinsdag',
        woensdag: 'Woensdag',
        donderdag: 'Donderdag',
        vrijdag: 'Vrijdag',
        zaterdag: 'Zaterdag',
        zondag: 'Zondag'
      },
      weekTypes: {
        both: 'Elke week',
        even: 'Even weken',
        odd: 'Oneven weken'
      }
    },
    personalData: {
      title: 'Persoonlijke Gegevens',
      contractHours: 'Contracturen per week',
      dueDate: 'Uitgerekende datum',
      contractHoursHelp: 'Het aantal contracturen per week bepaalt de beschikbare verlofuren',
      dueDateHelp: 'De verwachte datum van de geboorte'
    },
    leaveHours: {
      title: 'Beschikbare Verlofuren',
      gvHelp: 'Geboorteverlof: Eenmalig verlof direct na de geboorte (1 week, 100% salaris)',
      agvHelp: 'Aanvullend geboorteverlof: Extra verlof binnen 6 maanden na geboorte (5 weken, 70% salaris)',
      bovHelp: 'Betaald ouderschapsverlof: Verlof binnen het eerste levensjaar (9 weken, 70% salaris)',
      vdHelp: 'Vakantieuren: Reguliere vakantie-uren (100% salaris)',
      weekLeave: '1 week verlof',
      fiveWeeks: '5 weken verlof (70% salaris)',
      nineWeeks: '9 weken verlof (70% salaris)',
      twentyDays: 'Wettelijk minimum (20 dagen)'
    },
    phases: {
      title: 'Verloffases',
      addPhase: 'Fase Toevoegen',
      phaseName: 'Naam',
      leaveTypes: 'Verloftypes',
      startDate: 'Startdatum',
      endDate: 'Einddatum',
      workPatternTitle: 'Werkpatroon tijdens deze fase'
    }
  },
  leaveTypes: {
    GV: 'Geboorteverlof',
    AGV: 'Aanvullend Geboorteverlof',
    BOV: 'Betaald Ouderschapsverlof',
    VD: 'Vakantiedagen'
  },
  dayTypes: {
    weekend: 'Weekend',
    holiday: 'Feestdag',
    standardFreeDay: 'Standaard vrije dag',
    work: 'Werk',
    leave: 'Verlof'
  },
  errors: {
    fillDueDate: 'Vul eerst de uitgerekende datum in',
    fillPreviousEndDate: 'Vul eerst de einddatum van de vorige fase in',
    startBeforeEnd: 'Startdatum moet voor einddatum liggen',
    startOnWorkday: 'Startdatum moet op een werkdag vallen',
    endOnWorkday: 'Einddatum moet op een werkdag vallen',
    phaseOverlap: 'Fase {0} overlapt met fase {1}',
    connectPhases: 'Er moet direct worden aangesloten op de vorige fase (eerstvolgende werkdag)',
    insufficientHours: 'Onvoldoende verlofuren beschikbaar voor {0}'
  }
};