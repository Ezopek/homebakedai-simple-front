import { useState, useRef, useEffect } from 'react';
import {
  Container,
  Stack,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import LoginForm from './LoginForm.jsx';
import { WS_URL, LOGOUT_URL } from './config.js';

export default function App() {
  const [url, setUrl] = useState(WS_URL);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const wsRef = useRef(null);

  const handleLogin = () => setAuthenticated(true);
  const handleLogout = async () => {
    try {
      await fetch(LOGOUT_URL, { method: 'POST' });
    } catch {
      // ignore
    }
    setAuthenticated(false);
  };

  const connect = () => {
    const ws = new WebSocket(url);
    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    ws.onmessage = (event) =>
      setMessages((prev) => [...prev, { incoming: true, text: event.data }]);
    wsRef.current = ws;
  };

  const disconnect = () => {
    wsRef.current?.close();
    wsRef.current = null;
  };

  const sendMessage = () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(input);
    setMessages((prev) => [...prev, { incoming: false, text: input }]);
    setInput('');
  };

  useEffect(() => {
    return () => wsRef.current?.close();
  }, []);

  if (!authenticated) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <LoginForm onLogin={handleLogin} />
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" component="h1" gutterBottom>
            WebSocket Tester
          </Typography>
          <Button variant="outlined" onClick={handleLogout}>
            Logout
          </Button>
        </Stack>

        <Stack direction="row" spacing={1}>
          <TextField
            fullWidth
            label="WebSocket URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={connected}
          />
          <Button variant="contained" onClick={connected ? disconnect : connect}>
            {connected ? 'Disconnect' : 'Connect'}
          </Button>
        </Stack>

        <List
          sx={{
            flexGrow: 1,
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            minHeight: 200,
            overflow: 'auto',
          }}
        >
          {messages.map((msg, idx) => (
            <ListItem key={idx}>
              <ListItemText
                primary={msg.text}
                sx={{ textAlign: msg.incoming ? 'left' : 'right' }}
              />
            </ListItem>
          ))}
        </List>

        <Stack direction="row" spacing={1}>
          <TextField
            fullWidth
            label="Message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') sendMessage();
            }}
            disabled={!connected}
          />
          <Button
            variant="contained"
            onClick={sendMessage}
            disabled={!connected || input === ''}
          >
            Send
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}
