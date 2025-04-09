import React, { useState, useEffect } from 'react';
import { UserDataForm } from './UserDataForm';
import { LeaveCalculationSummary } from './LeaveCalculationSummary';
import { calculateLeaveRequest } from '../utils/leaveCalculator';
import { LeavePhase, LeaveType, WorkPattern } from '../types';
import { Share2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const defaultWorkPattern: WorkPattern = {
  daysPerWeek: 5,
  hoursPerWeek: 40,
  isFlexible: false,
  workDays: {
    maandag: { enabled: true, weekType: 'beide', hours: 8 },
    dinsdag: { enabled: true, weekType: 'beide', hours: 8 },
    woensdag: { enabled: true, weekType: 'beide', hours: 8 },
    donderdag: { enabled: true, weekType: 'beide', hours: 8 },
    vrijdag: { enabled: true, weekType: 'beide', hours: 8 },
  },
};

export const Planner: React.FC = () => {
  const [phases, setPhases] = useState<LeavePhase[]>([]);
  const [leaveHours, setLeaveHours] = useState<{ [key in LeaveType]: number }>({
    GV: 40,
    AGV: 200,
    BOV: 360,
    VD: 160
  });
  const [workPattern, setWorkPattern] = useState<WorkPattern>(defaultWorkPattern);
  const [expectedDueDate, setExpectedDueDate] = useState<string>('');
  const [contractHours, setContractHours] = useState<number>(40);
  const [isLoading, setIsLoading] = useState(true);
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const { t } = useTranslation();

  // Load state from URL on mount
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      try {
        const savedData = decodeState(hash);
        if (savedData) {
          if (savedData.workPattern) {
            setWorkPattern(savedData.workPattern);
          }
          if (savedData.phases) {
            setPhases(savedData.phases);
          }
          if (savedData.leaveHours) {
            setLeaveHours(savedData.leaveHours);
          }
          if (savedData.expectedDueDate) {
            setExpectedDueDate(savedData.expectedDueDate);
          }
          if (typeof savedData.contractHours === 'number') {
            setContractHours(savedData.contractHours);
          }
        }
      } catch (error) {
        console.error('Error loading state from URL:', error);
      }
    }
    setIsLoading(false);
  }, []);

  // Save state to URL when data changes
  useEffect(() => {
    if (isLoading) return;

    const dataToSave = {
      workPattern,
      phases,
      leaveHours,
      expectedDueDate,
      contractHours,
      lastSaved: new Date().toISOString(),
    };

    try {
      const encodedState = encodeState(dataToSave);
      window.history.replaceState(null, '', `#${encodedState}`);
    } catch (error) {
      console.error('Error saving state to URL:', error);
    }
  }, [workPattern, phases, leaveHours, expectedDueDate, contractHours, isLoading]);

  const calculation = calculateLeaveRequest(phases, leaveHours, workPattern);

  const handleFormSubmit = (data: { workPattern: WorkPattern; expectedDueDate: string }) => {
    setWorkPattern(data.workPattern);
    setExpectedDueDate(data.expectedDueDate);
  };

  const handleWorkPatternChange = (newPattern: WorkPattern) => {
    setWorkPattern(newPattern);
  };

  const handleExpectedDueDateChange = (date: string) => {
    setExpectedDueDate(date);
  };

  const handleContractHoursChange = (hours: number) => {
    setContractHours(hours);
  };

  const handleShareClick = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowCopiedMessage(true);
      setTimeout(() => setShowCopiedMessage(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  if (isLoading) {
    return <div>{t('common.loading')}</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {t('planner.title')}
        </h2>
        <button
          onClick={handleShareClick}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          title={t('common.share')}
        >
          <Share2 className="w-4 h-4 mr-2" />
          {t('common.share')}
        </button>
      </div>

      {showCopiedMessage && (
        <div className="fixed bottom-4 right-4 bg-green-50 text-green-800 px-4 py-2 rounded-md shadow-lg">
          {t('common.copied')}
        </div>
      )}

      <div className="space-y-8">
        <section>
          <UserDataForm 
            onSubmit={handleFormSubmit}
            onPhasesChange={setPhases}
            onLeaveHoursChange={setLeaveHours}
            onWorkPatternChange={handleWorkPatternChange}
            onExpectedDueDateChange={handleExpectedDueDateChange}
            onContractHoursChange={handleContractHoursChange}
            workPattern={workPattern}
            phases={phases}
            leaveHours={leaveHours}
            expectedDueDate={expectedDueDate}
            contractHours={contractHours}
          />
        </section>
        <section>
          <LeaveCalculationSummary calculation={calculation} />
        </section>
      </div>
    </div>
  );
};

function encodeState(data: any): string {
  return btoa(encodeURIComponent(JSON.stringify(data)));
}

function decodeState(hash: string): any {
  try {
    const decoded = decodeURIComponent(atob(hash.replace('#', '')));
    return JSON.parse(decoded);
  } catch (e) {
    console.error('Error decoding state:', e);
    return null;
  }
}