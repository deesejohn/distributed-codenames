import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the nickname form', () => {
  render(<App />);
  const nicknameForm = screen.getByText(/nickname/i);
  expect(nicknameForm).toBeInTheDocument();

  const submitButton = screen.getByText(/submit/i);
  expect(submitButton).toBeInTheDocument();
});
