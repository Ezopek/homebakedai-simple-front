# Simple WebSocket Frontend

This React application provides a minimal interface for testing WebSocket endpoints.
It is built with [Vite](https://vite.dev/) and [Material UI](https://mui.com/).

It also includes a simple login form compatible with [Quarkus form-based authentication](https://quarkus.io/guides/security-authentication-mechanisms#form-auth). Users must authenticate before accessing the WebSocket tester.

## Getting Started

```bash
npm install
npm run dev
```

The app opens in development mode. Enter your WebSocket endpoint, connect, and start sending messages.

## Configuration

Set the backend address by defining a `VITE_BACKEND_URL` environment variable. The value should be the base URL (e.g. `http://backend:8080`). It is used for login requests and as the default WebSocket endpoint (`ws://backend:8080/ws`).
