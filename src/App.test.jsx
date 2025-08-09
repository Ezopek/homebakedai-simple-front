import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import App from './App.jsx';

let wsInstance;
class MockWebSocket {
  constructor(url) {
    this.url = url;
    this.readyState = MockWebSocket.CONNECTING;
    this.send = vi.fn();
    this.close = vi.fn(() => {
      this.readyState = MockWebSocket.CLOSED;
      this.onclose && this.onclose();
    });
    wsInstance = this;
    setTimeout(() => {
      this.readyState = MockWebSocket.OPEN;
      this.onopen && this.onopen();
    }, 0);
  }
}
MockWebSocket.CONNECTING = 0;
MockWebSocket.OPEN = 1;
MockWebSocket.CLOSED = 3;

describe('App', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('renders login form when not authenticated', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
  });

  test('connects to websocket and sends message', async () => {
    vi.stubGlobal('WebSocket', MockWebSocket);
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: true })));

    render(<App />);

    await userEvent.type(screen.getByLabelText(/username/i), 'user');
    await userEvent.type(screen.getByLabelText(/password/i), 'pass');
    await userEvent.click(screen.getByRole('button', { name: /login/i }));

    await userEvent.click(screen.getByRole('button', { name: /connect/i }));
    await screen.findByRole('button', { name: /disconnect/i });

    const messageInput = screen.getByLabelText(/message/i);
    await userEvent.type(messageInput, 'hello');
    await userEvent.click(screen.getByRole('button', { name: /send/i }));

    expect(wsInstance.send).toHaveBeenCalledWith('hello');
    expect(screen.getByText('hello')).toBeInTheDocument();
  });
});
