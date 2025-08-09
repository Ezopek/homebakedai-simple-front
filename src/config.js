const rawBackend = import.meta.env.VITE_BACKEND_URL || window.location.origin;
export const BACKEND_URL = rawBackend.endsWith('/') ? rawBackend.slice(0, -1) : rawBackend;
export const WS_URL = `${BACKEND_URL.replace(/^http/, 'ws')}/ws`;
export const LOGIN_URL = `${BACKEND_URL}/j_security_check`;
export const LOGOUT_URL = `${BACKEND_URL}/logout`;
