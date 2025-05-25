import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SignInScreen from '@/app/(auth)/sign-in';

// Mock Clerk and Router
jest.mock('@clerk/clerk-expo', () => ({
  useSignIn: () => ({
    signIn: {
      create: jest.fn(),
    },
    setActive: jest.fn(),
    isLoaded: true,
  }),
}));
jest.mock('expo-router', () => ({
  useRouter: () => ({
    replace: jest.fn(),
  }),
  Link: ({ children }: any) => children,
}));

describe('SignInScreen', () => {
  it('shows error if fields are empty', async () => {
    const { getByText } = render(<SignInScreen />);
    fireEvent.press(getByText('Continue'));
    await waitFor(() => {
      expect(getByText('Please fill in all fields.')).toBeTruthy();
    });
  });

  it('logs in successfully', async () => {
    const mockCreate = jest.fn().mockResolvedValue({
      status: 'complete',
      createdSessionId: 'session123',
    });
    const mockSetActive = jest.fn();
    const mockReplace = jest.fn();

    // Override mocks for this test
    jest.spyOn(require('@clerk/clerk-expo'), 'useSignIn').mockReturnValue({
      signIn: { create: mockCreate },
      setActive: mockSetActive,
      isLoaded: true,
    });
    jest.spyOn(require('expo-router'), 'useRouter').mockReturnValue({
      replace: mockReplace,
    });

    const { getByPlaceholderText, getByText } = render(<SignInScreen />);
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.press(getByText('Continue'));

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith({
        identifier: 'test@example.com',
        password: 'password123',
      });
      expect(mockSetActive).toHaveBeenCalledWith({ session: 'session123' });
      expect(mockReplace).toHaveBeenCalledWith('/');
    });
  });

  it('shows error on failed login', async () => {
    const mockCreate = jest.fn().mockRejectedValue({
      errors: [{ message: 'Invalid email or password' }],
    });

    jest.spyOn(require('@clerk/clerk-expo'), 'useSignIn').mockReturnValue({
      signIn: { create: mockCreate },
      setActive: jest.fn(),
      isLoaded: true,
    });

    const { getByPlaceholderText, getByText, findByText } = render(<SignInScreen />);
    fireEvent.changeText(getByPlaceholderText('Email'), 'fail@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'wrong');
    fireEvent.press(getByText('Continue'));

    expect(await findByText('Invalid email or password')).toBeTruthy();
  });
});