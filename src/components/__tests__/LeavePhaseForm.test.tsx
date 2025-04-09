import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LeavePhaseForm } from '../LeavePhaseForm';
import { WorkPattern, LeavePhase } from '../../types';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';

// Force Dutch language for tests
i18n.changeLanguage('nl');

// Mock the crypto.randomUUID function
vi.stubGlobal('crypto', {
  randomUUID: () => '123e4567-e89b-12d3-a456-426614174000'
});

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

const mockPhase: LeavePhase = {
  id: '1',
  name: 'Test Phase',
  startDate: '2025-01-15',
  endDate: '2025-01-22',
  workPattern: defaultWorkPattern,
  leaveTypes: ['GV', 'AGV'],
  priority: 0,
};

describe('LeavePhaseForm', () => {
  const renderComponent = (props = {}) => {
    const defaultProps = {
      phases: [mockPhase],
      onChange: vi.fn(),
      expectedDueDate: '2025-01-15',
      defaultWorkPattern,
      ...props,
    };

    return render(
      <I18nextProvider i18n={i18n}>
        <LeavePhaseForm {...defaultProps} />
      </I18nextProvider>
    );
  };

  it('renders phase information correctly', () => {
    renderComponent();
    expect(screen.getByText('Test Phase')).toBeInTheDocument();
    expect(screen.getByText(/woe\. 15-01-2025/i)).toBeInTheDocument();
    expect(screen.getByText(/woe\. 22-01-2025/i)).toBeInTheDocument();
    expect(screen.getByText(/1 week en 1 dag/i)).toBeInTheDocument();
  });

  it('allows adding a new phase', () => {
    const onChange = vi.fn();
    renderComponent({ onChange });
    
    fireEvent.click(screen.getByText(/fase toevoegen/i));
    
    expect(onChange).toHaveBeenCalledWith(expect.arrayContaining([
      mockPhase,
      expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
        startDate: expect.any(String),
      })
    ]));
  });

  it('shows error when adding phase without due date', () => {
    renderComponent({ expectedDueDate: '' });
    
    fireEvent.click(screen.getByText(/fase toevoegen/i));
    
    expect(screen.getByText(/vul eerst de uitgerekende datum in/i)).toBeInTheDocument();
  });

  it('allows toggling phase expansion', () => {
    renderComponent();
    
    const expandButton = screen.getByLabelText(/toon fase details/i);
    fireEvent.click(expandButton);
    
    expect(screen.getByLabelText(/naam/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/startdatum/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/einddatum/i)).toBeInTheDocument();
  });
});