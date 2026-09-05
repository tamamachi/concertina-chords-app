import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the app heading', () => {
  render(<App />);
  expect(
    screen.getByRole('heading', { name: /concertina chords app/i })
  ).toBeInTheDocument();
});

test('defaults to the C major chord and the 40-button mode', () => {
  render(<App />);
  // "Selected Chord:" and the chord name live in separate text nodes,
  // so match on the combined textContent of the wrapper.
  expect(
    screen.getByText((_, el) => el?.textContent?.trim() === 'Selected Chord: C')
  ).toBeInTheDocument();
  expect(screen.getByLabelText(/mode:/i)).toHaveValue('40-button');
});
