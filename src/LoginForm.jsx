import { useState } from 'react';
import { Stack, TextField, Button, Typography } from '@mui/material';

export default function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const formData = new URLSearchParams();
    formData.append('j_username', username);
    formData.append('j_password', password);

    try {
      const response = await fetch('/j_security_check', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      if (response.ok) {
        onLogin();
      } else {
        setError('Login failed');
      }
    } catch (e) {
      setError(e.message || 'Network error');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <Typography variant="h5">Login</Typography>
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button type="submit" variant="contained">
          Login
        </Button>
      </Stack>
    </form>
  );
}
