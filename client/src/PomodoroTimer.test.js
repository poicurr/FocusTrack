import { render, screen } from '@testing-library/react';
import PomodoroTimer from './PomodoroTimer';

test('renders learn react link', () => {
  render(<PomodoroTimer />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
