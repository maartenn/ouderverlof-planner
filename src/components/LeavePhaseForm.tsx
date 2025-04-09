import React, { useState } from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown, AlertCircle, Calendar, Check } from 'lucide-react';
import { LeavePhase, LeaveType, WorkPattern } from '../types';
import { WorkPatternSelector } from './WorkPatternSelector';
import { useTranslation } from 'react-i18next';
import { formatDate, formatDuration } from '../utils/dateUtils';

interface LeavePhaseFormProps {
  phases: LeavePhase[];
  onChange: (phases: LeavePhase[]) => void;
  expectedDueDate: string;
  defaultWorkPattern: WorkPattern;
}

const leaveTypeOptions: { value: LeaveType; label: string }[] = [
  { value: 'GV', label: 'leaveTypes.GV' },
  { value: 'AGV', label: 'leaveTypes.AGV' },
  { value: 'BOV', label: 'leaveTypes.BOV' },
  { value: 'VD', label: 'leaveTypes.VD' },
];

export const LeavePhaseForm: React.FC<LeavePhaseFormProps> = ({ 
  phases, 
  onChange,
  expectedDueDate,
  defaultWorkPattern
}) => {
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { t, i18n } = useTranslation();

  const getNextWorkingDay = (date: string): string => {
    if (!date) return '';
    
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    
    // Skip weekends
    while (nextDay.getDay() === 0 || nextDay.getDay() === 6) {
      nextDay.setDate(nextDay.getDate() + 1);
    }
    
    return nextDay.toISOString().split('T')[0];
  };

  const addPhase = () => {
    if (!expectedDueDate && phases.length === 0) {
      setError(t('errors.fillDueDate'));
      return;
    }

    const startDate = phases.length === 0 
      ? expectedDueDate 
      : getNextWorkingDay(phases[phases.length - 1].endDate);

    if (phases.length > 0 && !phases[phases.length - 1].endDate) {
      setError(t('errors.fillPreviousEndDate'));
      return;
    }

    const newPhase: LeavePhase = {
      id: crypto.randomUUID(),
      name: `${t('planner.phases.title')} ${phases.length + 1}`,
      startDate,
      endDate: '',
      workPattern: { ...defaultWorkPattern },
      leaveTypes: ['GV', 'AGV', 'BOV', 'VD'], // All leave types enabled by default
      priority: phases.length,
    };

    onChange([...phases, newPhase]);
    setExpandedPhase(newPhase.id);
    setError(null);
  };

  const validatePhaseChange = (
    index: number, 
    updates: Partial<LeavePhase>
  ): string | null => {
    const newPhases = [...phases];
    newPhases[index] = { ...newPhases[index], ...updates };

    // Check for date validity
    if (updates.startDate && updates.endDate) {
      const start = new Date(updates.startDate);
      const end = new Date(updates.endDate);
      
      if (start > end) {
        return t('errors.startBeforeEnd');
      }

      // Check if start date is a weekend
      if (start.getDay() === 0 || start.getDay() === 6) {
        return t('errors.startOnWorkday');
      }

      // Check if end date is a weekend
      if (end.getDay() === 0 || end.getDay() === 6) {
        return t('errors.endOnWorkday');
      }
    }

    // Check for overlapping phases
    for (let i = 0; i < newPhases.length; i++) {
      if (i === index) continue;
      
      const phase = newPhases[i];
      const currentPhase = newPhases[index];
      
      if (!phase.startDate || !phase.endDate || !currentPhase.startDate || !currentPhase.endDate) {
        continue;
      }

      const start1 = new Date(phase.startDate);
      const end1 = new Date(phase.endDate);
      const start2 = new Date(currentPhase.startDate);
      const end2 = new Date(currentPhase.endDate);

      if (
        (start1 <= end2 && end1 >= start2) ||
        (start2 <= end1 && end2 >= start1)
      ) {
        return t('errors.phaseOverlap', { 0: index + 1, 1: i + 1 });
      }
    }

    // Check for gaps between phases
    if (index > 0) {
      const previousPhase = newPhases[index - 1];
      if (previousPhase.endDate && updates.startDate) {
        const previousEnd = new Date(previousPhase.endDate);
        const currentStart = new Date(updates.startDate);
        const nextWorkDay = new Date(getNextWorkingDay(previousPhase.endDate));

        if (currentStart.getTime() !== nextWorkDay.getTime()) {
          return t('errors.connectPhases');
        }
      }
    }

    return null;
  };

  const updatePhase = (index: number, updates: Partial<LeavePhase>) => {
    const validationError = validatePhaseChange(index, updates);
    
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    const newPhases = [...phases];
    newPhases[index] = { ...newPhases[index], ...updates };
    onChange(newPhases);
  };

  const toggleLeaveType = (index: number, leaveType: LeaveType) => {
    const phase = phases[index];
    const newLeaveTypes = phase.leaveTypes.includes(leaveType)
      ? phase.leaveTypes.filter(type => type !== leaveType)
      : [...phase.leaveTypes, leaveType].sort((a, b) => {
          const order = ['GV', 'AGV', 'BOV', 'VD'];
          return order.indexOf(a) - order.indexOf(b);
        });
    
    updatePhase(index, { leaveTypes: newLeaveTypes });
  };

  const removePhase = (index: number) => {
    const newPhases = phases.filter((_, i) => i !== index);
    onChange(newPhases);
    setError(null);
  };

  const movePhase = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === phases.length - 1)
    ) {
      return;
    }

    const newPhases = [...phases];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newPhases[index], newPhases[newIndex]] = [newPhases[newIndex], newPhases[index]];
    
    // Update priorities
    newPhases.forEach((phase, i) => {
      phase.priority = i;
    });
    
    onChange(newPhases);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{t('planner.phases.title')}</h2>
        <button
          type="button"
          onClick={addPhase}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t('planner.phases.addPhase')}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <p className="ml-3 text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {!expectedDueDate && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-yellow-400" />
            <p className="ml-3 text-sm text-yellow-700">
              {t('errors.fillDueDate')}
            </p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {phases.map((phase, index) => (
          <div
            key={phase.id}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() =>
                    setExpandedPhase(expandedPhase === phase.id ? null : phase.id)
                  }
                  className="text-gray-500 hover:text-gray-700"
                  aria-label={expandedPhase === phase.id ? t('common.collapse') : t('common.expand')}
                  aria-expanded={expandedPhase === phase.id}
                >
                  {expandedPhase === phase.id ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
                <div className="space-y-1">
                  <span className="font-medium">
                    {phase.name}
                  </span>
                  <div className="text-sm text-gray-500">
                    <span>{formatDate(phase.startDate, i18n.language)} - {formatDate(phase.endDate, i18n.language)}</span>
                    {phase.startDate && phase.endDate && (
                      <span className="ml-2 text-gray-400">
                        ({formatDuration(phase.startDate, phase.endDate, i18n.language)})
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => movePhase(index, 'up')}
                  disabled={index === 0}
                  className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                  aria-label={t('common.moveUp')}
                >
                  <ChevronUp className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => movePhase(index, 'down')}
                  disabled={index === phases.length - 1}
                  className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                  aria-label={t('common.moveDown')}
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => removePhase(index)}
                  className="p-1 text-red-500 hover:text-red-700"
                  aria-label={t('common.delete')}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {expandedPhase === phase.id && (
              <div className="p-4 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor={`phase-name-${phase.id}`} className="block text-sm font-medium text-gray-700">
                      {t('planner.phases.phaseName')}
                    </label>
                    <input
                      id={`phase-name-${phase.id}`}
                      type="text"
                      value={phase.name}
                      onChange={(e) => updatePhase(index, { name: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('planner.phases.leaveTypes')}
                    </label>
                    <div className="space-y-2">
                      {leaveTypeOptions.map((option) => (
                        <label key={option.value} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={phase.leaveTypes.includes(option.value)}
                            onChange={() => toggleLeaveType(index, option.value)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">{t(option.label)}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label htmlFor={`phase-start-${phase.id}`} className="block text-sm font-medium text-gray-700">
                      {t('planner.phases.startDate')}
                    </label>
                    <input
                      id={`phase-start-${phase.id}`}
                      type="date"
                      value={phase.startDate}
                      onChange={(e) =>
                        updatePhase(index, { startDate: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      readOnly={index === 0}
                      title={index === 0 ? t('planner.personalData.dueDateHelp') : undefined}
                    />
                  </div>
                  <div>
                    <label htmlFor={`phase-end-${phase.id}`} className="block text-sm font-medium text-gray-700">
                      {t('planner.phases.endDate')}
                    </label>
                    <input
                      id={`phase-end-${phase.id}`}
                      type="date"
                      value={phase.endDate}
                      min={phase.startDate}
                      onChange={(e) => updatePhase(index, { endDate: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {t('planner.phases.workPatternTitle')}
                  </h3>
                  <WorkPatternSelector
                    value={phase.workPattern}
                    onChange={(workPattern) => updatePhase(index, { workPattern })}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};