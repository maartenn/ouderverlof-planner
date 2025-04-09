import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Eye, EyeOff, FileSpreadsheet, File as FilePdf } from 'lucide-react';
import { LeaveCalculation } from '../utils/leaveCalculator';
import { LeaveType, WorkPattern } from '../types';
import { utils, writeFile } from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useTranslation } from 'react-i18next';
import { formatDate, formatDuration } from '../utils/dateUtils';

interface LeaveCalculationSummaryProps {
  calculation: LeaveCalculation;
}

function getWorkWeekSummary(workPattern: WorkPattern | undefined, language: string, t: (key: string) => string): string {
  if (!workPattern?.workDays) {
    return language === 'nl' 
      ? 'Geen werkpatroon beschikbaar.'
      : 'No work pattern available.';
  }

  const daysOfWeek = ['maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag'];
  const workingDays: string[] = [];
  const nonWorkingDays: string[] = [];

  let totalHours = 0;
  let workDaysCount = 0;

  daysOfWeek.forEach(day => {
    const dayPattern = workPattern.workDays[day as keyof WorkPattern['workDays']];
    if (!dayPattern.enabled) {
      nonWorkingDays.push(t(`planner.workPattern.days.${day}`));
      return;
    }

    const hours = dayPattern.hours;
    if (dayPattern.weekType === 'beide') {
      workingDays.push(`${t(`planner.workPattern.days.${day}`)} ${hours}h`);
      totalHours += hours;
      workDaysCount++;
    } else {
      const weekType = dayPattern.weekType === 'even' 
        ? t('planner.workPattern.weekTypes.even') 
        : t('planner.workPattern.weekTypes.odd');
      workingDays.push(`${t(`planner.workPattern.days.${day}`)} ${hours}h (${weekType})`);
      totalHours += hours / 2; // Average over even/odd weeks
      workDaysCount += 0.5;
    }
  });

  // Always add weekend days to non-working days
  nonWorkingDays.push(
    t('planner.workPattern.days.zaterdag'),
    t('planner.workPattern.days.zondag')
  );

  const summary = language === 'nl' 
    ? `${Math.round(workDaysCount)} dagen/week, ${Math.round(totalHours)} uur/week:\n` +
      `Werkdagen: ${workingDays.join(', ')}\n` +
      `Vrije dagen: ${nonWorkingDays.join(', ')}`
    : `${Math.round(workDaysCount)} days/week, ${Math.round(totalHours)} hours/week:\n` +
      `Working days: ${workingDays.join(', ')}\n` +
      `Days off: ${nonWorkingDays.join(', ')}`;

  return summary;
}

export const LeaveCalculationSummary: React.FC<LeaveCalculationSummaryProps> = ({
  calculation
}) => {
  const [showWeekends, setShowWeekends] = useState(true);
  const { t, i18n } = useTranslation();

  const getDayType = (day: typeof calculation.dailyDetails[0]): string => {
    const isWeekend = day.dayName === t('planner.workPattern.days.zondag') || 
                     day.dayName === t('planner.workPattern.days.zaterdag');
    
    if (isWeekend) {
      return t('dayTypes.weekend');
    }

    if (!day.isWorkDay && day.hours === 0) {
      return t('dayTypes.standardFreeDay');
    }

    if (!day.isWorkDay) {
      return t('dayTypes.holiday');
    }
    
    if (day.leaveTypes.length > 0) {
      const types = day.leaveTypes.map(lt => t(`leaveTypes.${lt.type}`)).join(', ');
      return `${t('dayTypes.leave')} (${types})`;
    }
    
    return t('dayTypes.work');
  };

  const getCumulativeHours = (dayIndex: number, leaveType: LeaveType) => {
    return calculation.dailyDetails
      .slice(0, dayIndex + 1)
      .reduce((sum, day) => {
        const leaveTypeHours = day.leaveTypes.find(lt => lt.type === leaveType)?.hours || 0;
        return sum + leaveTypeHours;
      }, 0);
  };

  const initialHours = calculation.leaveTypeBreakdown.reduce((acc, breakdown) => {
    acc[breakdown.type] = breakdown.hours + breakdown.remainingHours;
    return acc;
  }, {} as Record<LeaveType, number>);

  const visibleDays = showWeekends 
    ? calculation.dailyDetails
    : calculation.dailyDetails.filter(day => 
        day.dayName !== t('planner.workPattern.days.zaterdag') && 
        day.dayName !== t('planner.workPattern.days.zondag')
      );

  const exportToExcel = () => {
    const data = visibleDays.map(day => {
      const row: any = {
        [t('common.days')]: formatDate(day.date, i18n.language),
        [t('common.week')]: day.weekNumber,
        [t('planner.phases.title')]: day.phase,
        [t('dayTypes.work')]: getDayType(day)
      };

      ['GV', 'AGV', 'BOV', 'VD'].forEach(type => {
        const hours = day.leaveTypes.find(lt => lt.type === type)?.hours || 0;
        row[t(`leaveTypes.${type}`)] = hours > 0 ? hours : '-';
      });

      return row;
    });

    const totals = calculation.leaveTypeBreakdown.reduce((acc: any, breakdown) => {
      acc[t(`leaveTypes.${breakdown.type}`)] = 
        `${breakdown.hours} ${t('planner.summary.from')} ${initialHours[breakdown.type]}`;
      return acc;
    }, {});

    data.push({
      [t('common.days')]: t('common.total'),
      [t('common.week')]: '',
      [t('planner.phases.title')]: '',
      ...totals,
      [t('dayTypes.work')]: ''
    });

    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, t('planner.title'));

    writeFile(wb, 'leave-planning.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text(t('planner.title'), 14, 15);
    
    doc.setFontSize(10);
    doc.text(`${t('planner.summary.totalDays')}: ${calculation.totalDays}`, 14, 25);
    doc.text(`${t('planner.summary.totalHours')}: ${calculation.totalHours}`, 14, 30);

    const tableData = visibleDays.map(day => [
      formatDate(day.date, i18n.language),
      day.weekNumber.toString(),
      day.phase,
      ...['GV', 'AGV', 'BOV', 'VD'].map(type => {
        const hours = day.leaveTypes.find(lt => lt.type === type)?.hours || 0;
        return hours > 0 ? hours.toString() : '-';
      }),
      getDayType(day)
    ]);

    const totalsRow = [
      t('common.total'),
      '',
      '',
      ...calculation.leaveTypeBreakdown.map(breakdown => 
        `${breakdown.hours} / ${initialHours[breakdown.type]}`
      ),
      ''
    ];

    tableData.push(totalsRow);

    autoTable(doc, {
      head: [[
        t('common.days'),
        t('common.week'),
        t('planner.phases.title'),
        ...['GV', 'AGV', 'BOV', 'VD'].map(type => t(`leaveTypes.${type}`)),
        t('dayTypes.work')
      ]],
      body: tableData,
      startY: 35,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [75, 85, 99] },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });

    doc.save('leave-planning.pdf');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{t('planner.summary.title')}</h2>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowWeekends(!showWeekends)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                title={showWeekends ? t('planner.summary.hideWeekends') : t('planner.summary.showWeekends')}
              >
                {showWeekends ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    <span className="text-sm">{t('planner.summary.hideWeekends')}</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">{t('planner.summary.showWeekends')}</span>
                  </>
                )}
              </button>
              <button
                onClick={exportToExcel}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                title={t('planner.summary.exportExcel')}
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Excel</span>
              </button>
              <button
                onClick={exportToPDF}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                title={t('planner.summary.exportPdf')}
              >
                <FilePdf className="w-4 h-4" />
                <span>PDF</span>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-500">{t('planner.summary.totalDays')}</p>
              <p className="text-2xl font-bold">{calculation.totalDays}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">{t('planner.summary.totalHours')}</p>
              <p className="text-2xl font-bold">{calculation.totalHours}</p>
            </div>
          </div>

          {calculation.warnings.length > 0 && (
            <div className="mb-6">
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      {t('planner.summary.warnings')}
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <ul className="list-disc list-inside">
                        {calculation.warnings.map((warning, index) => (
                          <li key={index}>{warning}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {calculation.isValid && calculation.warnings.length === 0 && (
            <div className="mb-6">
              <div className="bg-green-50 border-l-4 border-green-400 p-4">
                <div className="flex">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <div className="ml-3">
                    <p className="text-sm text-green-700">
                      {t('planner.summary.validPlan')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('common.days')}
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('common.week')}
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('planner.phases.title')}
                </th>
                {['GV', 'AGV', 'BOV', 'VD'].map(type => (
                  <th key={type} scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t(`leaveTypes.${type}`)}
                  </th>
                ))}
                <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('dayTypes.work')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {visibleDays.map((day, index) => {
                const isWeekend = day.dayName === t('planner.workPattern.days.zaterdag') || 
                                day.dayName === t('planner.workPattern.days.zondag');
                const originalIndex = calculation.dailyDetails.findIndex(d => d === day);

                return (
                  <tr 
                    key={`${day.date}-${originalIndex}`}
                    className={isWeekend ? 'bg-gray-50' : undefined}
                  >
                    <td className="px-3 py-2 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        <span className={isWeekend ? 'text-gray-400' : 'text-gray-900'}>
                          {formatDate(day.date, i18n.language)}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                      {day.weekNumber}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                      {day.phase}
                    </td>
                    {(['GV', 'AGV', 'BOV', 'VD'] as LeaveType[]).map(type => {
                      const hours = day.leaveTypes.find(lt => lt.type === type)?.hours || 0;
                      const cumulative = getCumulativeHours(originalIndex, type);
                      const remaining = initialHours[type] - cumulative;
                      
                      return (
                        <td key={`${type}-${day.date}-${originalIndex}`} className="px-3 py-2 whitespace-nowrap text-sm">
                          {day.isWorkDay && hours > 0 ? (
                            <div className="space-y-1 text-center">
                              <div className="text-gray-900">{hours}</div>
                              <div className="text-xs text-gray-500">
                                <span className="text-red-600">-{cumulative}</span>
                                {' / '}
                                <span className="text-blue-600">{remaining}</span>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center text-gray-400">-</div>
                          )}
                        </td>
                      );
                    })}
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 text-center">
                      {getDayType(day)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan={3} className="px-3 py-2 text-sm font-medium text-gray-900">
                  {t('common.total')}
                </td>
                {calculation.leaveTypeBreakdown.map(breakdown => (
                  <td key={breakdown.type} className="px-3 py-2 text-sm text-center">
                    <div className="font-medium text-gray-900">{breakdown.hours}</div>
                    <div className="text-xs text-gray-500">
                      {t('planner.summary.from')} {initialHours[breakdown.type]}
                    </div>
                  </td>
                ))}
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Phase Summaries */}
        <div className="p-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold mb-4">{t('planner.summary.phaseOverview')}</h3>
          <div className="grid gap-4">
            {Object.values(calculation.phaseSummaries).map((phase) => (
              <div key={phase.name} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900">{phase.name}</h4>
                  <div className="text-sm">
                    <div className="text-gray-500">
                      {formatDate(phase.startDate, i18n.language)} - {formatDate(phase.endDate, i18n.language)}
                    </div>
                    <div className="text-right text-gray-400">
                      {formatDuration(phase.startDate, phase.endDate, i18n.language)}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-2">
                  <div>
                    <span className="text-sm text-gray-500">{t('planner.summary.leaveDays')}:</span>
                    <span className="ml-2 font-medium">{phase.totalDays}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">{t('planner.summary.leaveHours')}:</span>
                    <span className="ml-2 font-medium">{phase.totalHours}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['GV', 'AGV', 'BOV', 'VD'] as LeaveType[]).map(type => (
                    <div key={type} className="text-sm">
                      <span className="text-gray-500">{t(`leaveTypes.${type}`)}:</span>
                      <span className="ml-2 font-medium">
                        {phase.leaveTypes[type] || 0} {t('common.hours')}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-sm text-gray-600 whitespace-pre-line">
                  {getWorkWeekSummary(phase.workPattern, i18n.language, t)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};