import { render, screen } from '@testing-library/react';
import ScoreBadge from '../components/ScoreBadge';
import { describe, it, expect } from 'vitest';

describe('ScoreBadge', () => {
  it('renders correctly with lower risk score', () => {
    render(<ScoreBadge score={2} label="Low Risk" />);
    expect(screen.getByText('2/10')).toBeInTheDocument();
    expect(screen.getByText('Low Risk')).toBeInTheDocument();
  });

  it('renders correctly with high risk score', () => {
    render(<ScoreBadge score={9} label="High Risk" />);
    expect(screen.getByText('9/10')).toBeInTheDocument();
    expect(screen.getByText('High Risk')).toBeInTheDocument();
  });
});
