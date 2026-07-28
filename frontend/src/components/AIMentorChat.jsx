import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  IconButton,
  Chip,
  Stack,
  Avatar,
  CircularProgress
} from '@mui/material';
import { Send, Bot, User, HelpCircle } from 'lucide-react';
import { askAIMentor } from '../api/client';

const DEFAULT_PROMPTS = [
  'Why Lambda?',
  'Why DynamoDB?',
  'Can I migrate to Azure later?',
  'What if traffic doubles?',
  'Why not Azure or GCP?',
  'How do I reduce monthly cost?'
];

export const AIMentorChat = ({ contextResult }) => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'assistant',
      text: `Hello! I am your Amazon Bedrock AI Cloud Mentor. I have reviewed the architectural decision for ${
        contextResult?.projectTitle || 'your workload'
      }.\n\nAsk me anything about why specific services were selected, cost optimization tactics, multi-cloud migration paths, or how the architecture handles traffic spikes!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (queryText) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || loading) return;

    const userMsg = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setLoading(true);

    try {
      const responseText = await askAIMentor(textToSend, contextResult);
      const botMsg = {
        id: `bot_${Date.now()}`,
        sender: 'assistant',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 4,
          backgroundColor: '#0f172a',
          border: '1px solid rgba(168, 85, 247, 0.2)',
          mb: 3
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'rgba(168, 85, 247, 0.2)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.4)' }}>
            <Bot size={22} />
          </Avatar>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" fontWeight={800} sx={{ color: '#f8fafc' }}>
                Feature 6 — Bedrock AI Cloud Mentor
              </Typography>
              <Chip label="Context Aware" size="small" sx={{ height: 20, fontSize: '0.65rem', backgroundColor: 'rgba(168, 85, 247, 0.2)', color: '#c084fc', fontWeight: 700 }} />
            </Box>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              Ask questions about trade-offs, cost reductions, migration strategies, or scalability limits.
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Chat Messages Panel */}
      <Paper
        sx={{
          p: 3,
          borderRadius: 3,
          backgroundColor: '#1e293b',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          minHeight: 400,
          maxHeight: 520,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <Box sx={{ overflowY: 'auto', pr: 1, mb: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {messages.map((msg) => (
            <Box
              key={msg.id}
              sx={{
                display: 'flex',
                gap: 1.5,
                flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-start'
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: msg.sender === 'user' ? 'rgba(99, 102, 241, 0.3)' : 'rgba(168, 85, 247, 0.3)',
                  color: msg.sender === 'user' ? '#818cf8' : '#c084fc',
                  fontSize: '0.8rem'
                }}
              >
                {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
              </Avatar>

              <Paper
                sx={{
                  p: 2,
                  maxWidth: '80%',
                  borderRadius: 3,
                  backgroundColor: msg.sender === 'user' ? '#6366f1' : 'rgba(15, 23, 42, 0.9)',
                  color: '#f8fafc',
                  border: msg.sender === 'user' ? 'none' : '1px solid rgba(255, 255, 255, 0.08)'
                }}
              >
                <Typography variant="body2" sx={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                  {msg.text}
                </Typography>
                <Typography variant="caption" sx={{ color: msg.sender === 'user' ? 'rgba(255,255,255,0.7)' : '#94a3b8', display: 'block', mt: 1, textAlign: 'right', fontSize: '0.65rem' }}>
                  {msg.timestamp}
                </Typography>
              </Paper>
            </Box>
          ))}

          {loading && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(168, 85, 247, 0.3)', color: '#c084fc' }}>
                <Bot size={16} />
              </Avatar>
              <Paper sx={{ p: 2, borderRadius: 3, backgroundColor: 'rgba(15, 23, 42, 0.9)', display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={16} color="secondary" />
                <Typography variant="caption" sx={{ color: '#c084fc', fontWeight: 600 }}>
                  Bedrock Agent is reasoning...
                </Typography>
              </Paper>
            </Box>
          )}
        </Box>

        {/* Quick Question Chips */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" sx={{ color: '#94a3b8', mb: 1, display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 600 }}>
            <HelpCircle size={12} color="#818cf8" /> Suggested Questions:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ gap: 1 }}>
            {DEFAULT_PROMPTS.map((prompt, idx) => (
              <Chip
                key={idx}
                label={prompt}
                size="small"
                onClick={() => handleSend(prompt)}
                sx={{
                  backgroundColor: 'rgba(99, 102, 241, 0.12)',
                  color: '#818cf8',
                  border: '1px solid rgba(129, 140, 248, 0.25)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  '&:hover': {
                    backgroundColor: 'rgba(99, 102, 241, 0.25)'
                  }
                }}
              />
            ))}
          </Stack>
        </Box>

        {/* Input Bar */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            placeholder="Ask Bedrock Mentor about architecture, cost, security, or migration..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            variant="outlined"
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#f8fafc',
                backgroundColor: 'rgba(15, 23, 42, 0.8)',
                borderRadius: 2.5,
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.12)' },
                '&:hover fieldset': { borderColor: '#c084fc' },
                '&.Mui-focused fieldset': { borderColor: '#a855f7' }
              }
            }}
          />
          <IconButton
            onClick={() => handleSend()}
            disabled={loading || !inputQuery.trim()}
            sx={{
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              color: '#fff',
              borderRadius: 2.5,
              width: 42,
              height: 42,
              '&:hover': {
                background: 'linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)'
              }
            }}
          >
            <Send size={18} />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
};
