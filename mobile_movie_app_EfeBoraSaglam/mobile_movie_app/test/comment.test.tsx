import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Details from '../app/movie/[id]';

// Mocks
jest.mock('@clerk/clerk-expo', () => ({
  useUser: () => ({
    user: {
      emailAddresses: [{ emailAddress: 'test@example.com' }],
    },
  }),
}));
jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ id: '123' }),
  useRouter: () => ({ back: jest.fn() }),
}));
jest.mock('@/services/useFetch', () => () => ({
  data: {
    title: 'Test Movie',
    poster_path: null,
    release_date: '2024-01-01',
    runtime: 120,
    vote_average: 8.5,
    vote_count: 100,
    overview: 'A test movie.',
    genres: [{ name: 'Action' }],
    budget: 10000000,
    revenue: 50000000,
    production_companies: [{ name: 'Test Studio' }],
  },
  loading: false,
}));
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(null),
}));

describe('Details (comments)', () => {
  it('User kann Kommentar hinzufügen und sieht seine Email', async () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<Details />);
    const input = getByPlaceholderText('Add a comment...');
    const button = getByText('Submit Comment');

    // Vorher kein Kommentar sichtbar
    expect(queryByText('test@example.com')).toBeNull();

    fireEvent.changeText(input, 'Mein Testkommentar');
    fireEvent.press(button);

    await waitFor(() => {
      expect(getByText('test@example.com')).toBeTruthy();
      expect(getByText('Mein Testkommentar')).toBeTruthy();
    });
  });
});