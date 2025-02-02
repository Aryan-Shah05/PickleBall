import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
} from '@mui/material';
import { runApiTests } from '../api-test';

export const TestRunner = () => {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleRunTests = async () => {
    setLoading(true);
    setLogs([]);
    setError(null);

    try {
      // Override console.log and console.error to capture output
      const originalLog = console.log;
      const originalError = console.error;

      console.log = (...args) => {
        setLogs(prev => [...prev, args.join(' ')]);
        originalLog.apply(console, args);
      };

      console.error = (...args) => {
        setLogs(prev => [...prev, `ERROR: ${args.join(' ')}`]);
        setError(args.join(' '));
        originalError.apply(console, args);
      };

      await runApiTests();

      // Restore console methods
      console.log = originalLog;
      console.error = originalError;
    } catch (err) {
      setError('Test execution failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        API Integration Tests
      </Typography>

      <Button
        variant="contained"
        onClick={handleRunTests}
        disabled={loading}
        sx={{ mb: 3 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Run Tests'}
      </Button>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ maxHeight: 600, overflow: 'auto' }}>
        <List>
          {logs.map((log, index) => (
            <ListItem key={index} divider>
              <ListItemText
                primary={log}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontFamily: 'monospace',
                    color: log.includes('✓') ? 'success.main' :
                           log.includes('✗') ? 'error.main' :
                           log.includes('Testing') ? 'info.main' : 'text.primary'
                  }
                }}
              />
            </ListItem>
          ))}
          {logs.length === 0 && (
            <ListItem>
              <ListItemText
                primary="No test results yet. Click 'Run Tests' to start testing."
                sx={{ color: 'text.secondary' }}
              />
            </ListItem>
          )}
        </List>
      </Paper>
    </Box>
  );
}; 