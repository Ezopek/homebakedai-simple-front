import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import LoginForm from './LoginForm.jsx';
import { LOGIN_URL } from './config.js';

describe('LoginForm', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('calls onLogin on successful login', async () => {
    const onLogin = vi.fn();
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: true })));
    render(<LoginForm onLogin={onLogin} />);

    await userEvent.type(screen.getByLabelText(/username/i), 'user');
    await userEvent.type(screen.getByLabelText(/password/i), 'pass');
    await userEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(fetch).toHaveBeenCalledWith(LOGIN_URL, expect.any(Object));
    expect(onLogin).toHaveBeenCalled();
  });

  test('shows error message on failed login', async () => {
    const onLogin = vi.fn();
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: false })));
    render(<LoginForm onLogin={onLogin} />);

    await userEvent.type(screen.getByLabelText(/username/i), 'user');
    await userEvent.type(screen.getByLabelText(/password/i), 'wrong');
    await userEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(await screen.findByText(/login failed/i)).toBeInTheDocument();
    expect(onLogin).not.toHaveBeenCalled();
  });
});
