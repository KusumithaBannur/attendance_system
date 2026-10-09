import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

beforeEach(() => localStorage.clear());

test('a logged-out user is sent to the login page', async () => {
  render(<App />);

  expect(await screen.findByText(/attendance management system/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
});
