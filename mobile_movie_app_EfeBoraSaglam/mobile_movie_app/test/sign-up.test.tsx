import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SignUpScreen from '../app/(auth)/sign-up';

// sign-up.test.tsx

jest.mock('@clerk/clerk-expo', () => ({
  useSignUp: jest.fn(),
}));
jest.mock('expo-router', () => ({
  useRouter: () => ({
    replace: jest.fn(),
  }),
  Link: ({ children }: { children: React.ReactNode }) => children,
}));

const mockCreate = jest.fn();
const mockPrepareEmailAddressVerification = jest.fn();
const mockAttemptEmailAddressVerification = jest.fn();
const mockSetActive = jest.fn();

const setupMocks = (overrides = {}) => {
  require('@clerk/clerk-expo').useSignUp.mockReturnValue({
    isLoaded: true,
    signUp: {
      create: mockCreate,
      prepareEmailAddressVerification: mockPrepareEmailAddressVerification,
      attemptEmailAddressVerification: mockAttemptEmailAddressVerification,
    },
    setActive: mockSetActive,
    ...overrides,
  });
};

beforeEach(() => {
  jest.clearAllMocks();
  setupMocks();
});

describe('SignUpScreen', () => {
  it('renders sign up form', () => {
    const { getByPlaceholderText, getByText } = render(<SignUpScreen />);
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Continue')).toBeTruthy();
  });

  it('shows error if fields are empty', async () => {
    const { getByText, findByText } = render(<SignUpScreen />);
    fireEvent.press(getByText('Continue'));
    expect(await findByText('Please fill in all fields.')).toBeTruthy();
  });

  it('calls signUp.create and shows verification screen on success', async () => {
    mockCreate.mockResolvedValue({ status: 'complete' });
    mockPrepareEmailAddressVerification.mockResolvedValue({});
    const { getByPlaceholderText, getByText, findByText } = render(<SignUpScreen />);
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.press(getByText('Continue'));
    expect(mockCreate).toHaveBeenCalledWith({
      emailAddress: 'test@example.com',
      password: 'password123',
    });
    expect(mockPrepareEmailAddressVerification).toHaveBeenCalled();
    expect(await findByText('Verify your email')).toBeTruthy();
  });

  it('shows error if signUp.create fails', async () => {
    mockCreate.mockRejectedValue({ errors: [{ message: 'Email exists' }] });
    const { getByPlaceholderText, getByText, findByText } = render(<SignUpScreen />);
    fireEvent.changeText(getByPlaceholderText('Email'), 'fail@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.press(getByText('Continue'));
    expect(await findByText('Email exists')).toBeTruthy();
  });

  it('calls attemptEmailAddressVerification and setActive on verify', async () => {
    // Go to verification screen
    mockCreate.mockResolvedValue({});
    mockPrepareEmailAddressVerification.mockResolvedValue({});
    mockAttemptEmailAddressVerification.mockResolvedValue({
      status: 'complete',
      createdSessionId: 'session123',
    });
    const { getByPlaceholderText, getByText, findByText } = render(<SignUpScreen />);
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.press(getByText('Continue'));
    await findByText('Verify your email');
    fireEvent.changeText(getByPlaceholderText('Verification code'), '123456');
    fireEvent.press(getByText('Verify'));
    await waitFor(() => {
      expect(mockAttemptEmailAddressVerification).toHaveBeenCalledWith({ code: '123456' });
      expect(mockSetActive).toHaveBeenCalledWith({ session: 'session123' });
    });
  });

  it('handles verification failure', async () => {
    mockCreate.mockResolvedValue({});
    mockPrepareEmailAddressVerification.mockResolvedValue({});
    mockAttemptEmailAddressVerification.mockRejectedValue({ errors: [{ message: 'Invalid code' }] });
    const { getByPlaceholderText, getByText, findByText } = render(<SignUpScreen />);
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.press(getByText('Continue'));
    await findByText('Verify your email');
    fireEvent.changeText(getByPlaceholderText('Verification code'), 'wrong');
    fireEvent.press(getByText('Verify'));
    // Error is only logged, not shown, so we check that no crash occurs
    expect(getByText('Verify')).toBeTruthy();
  });
});

// npm run test