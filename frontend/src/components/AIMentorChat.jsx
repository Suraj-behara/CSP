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
  CircularProgress,
  Button
} from '@mui/material';
import { Send, Bot, User, HelpCircle, Shield, Zap, RefreshCw, DollarSign, Wrench } from 'lucide-react';
import { askAIMentor } from '../api/client';

const AGENT_TOOLS = [
  {
    id: 'run_security_audit',
    label: 'Run Security Audit Tool',
    icon: <Shield size={14} color="#34d399" />,
    desc: 'Scans IAM, KMS, and TLS compliance'
  },
  {
    id: 'simulate_scaling',
    label: '5x Traffic Surge Tool',
    icon: <Zap size={14} color="#fbbf24" />,
    desc: 'Tests API & DynamoDB under surge'
  },
  {
    id: 'generate_migration_plan',
    label: 'Migration Blueprint Tool',
    icon: <RefreshCw size={14} color="#38bdf8" />,
    desc: 'Generates Azure/GCP migration steps'
  },
  {
    id: 'optimize_cost',
    label: 'Cost Reduction Tool',
    icon: <DollarSign size={14} color="#c084fc" />,
    desc: 'Scans for edge caching & token savings'
  }
];

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
      text: `Hello! I am your Amazon Bedrock AI Cloud Mentor & Agent. I have reviewed the architectural decision for ${
        contextResult?.projectTitle || 'your workload'
      }.\n\nI can answer questions directly or run Autonomous Agent Tools (Security Audit, 5x Traffic Surge Simulation, Multi-Cloud Migration Blueprint, Cost Reduction Scanner). Select an agent tool below or type your question!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTool, setActiveTool] = useState(null);

  const handleSend = async (queryText, toolId = null) => {
    const textToSend = queryText || inputQuery;
    if ((!textToSend.trim() && !toolId) || loading) return;

    const selectedTool = AGENT_TOOLS.find((t) => t.id === toolId);
    const displayText = selectedTool ? `[Invoking Agent Tool: ${selectedTool.label}]` : textToSend;

    const userMsg = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: displayText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setLoading(true);
    if (toolId) setActiveTool(selectedTool?.label);

    try {
      const responseText = await askAIMentor(textToSend, contextResult, toolId);
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
      setActiveTool(null);
    }
  };

  return (
    <Box>
      {/* Bedrock Agent Header */}
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'rgba(168, 85, 247, 0.2)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.4)', width: 44, height: 44 }}>
              <Bot size={24} />
            </Avatar>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h6" fontWeight={800} sx={{ color: '#f8fafc' }}>
                  Amazon Bedrock Agent & AI Mentor
                </Typography>
                <Chip label="Agent Tools Enabled" size="small" sx={{ height: 20, fontSize: '0.65rem', backgroundColor: 'rgba(168, 85, 247, 0.2)', color: '#c084fc', fontWeight: 700 }} />
              </Box>
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                Interactive reasoning agent with tool execution for security auditing, load stress testing, & migration planning.
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Agent Tools Quick Execution Toolbar */}
        <Box sx={{ mt: 2.5, pt: 2, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <Typography variant="caption" sx={{ color: '#c084fc', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Wrench size={14} /> Autonomous Bedrock Agent Tools:
          </Typography>
          <Grid container spacing={1.5}>
            {AGENT_TOOLS.map((tool) => (
              <Grid item xs={12} sm={6} md={3} key={tool.id}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => handleSend('', tool.id)}
                  disabled={loading}
                  startIcon={tool.icon}
                  sx={{
                    justify: 'flex-start',
                    textAlign: 'left',
                    py: 1,
                    px: 1.5,
                    borderRadius: 2.5,
                    backgroundColor: 'rgba(15, 23, 42, 0.7)',
                    borderColor: 'rgba(168, 85, 247, 0.3)',
                    color: '#f8fafc',
                    textTransform: 'none',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: 'rgba(168, 85, 247, 0.15)',
                      borderColor: '#c084fc'
                    }
                  }}
                >
                  {tool.label}
                </Button>
              </Grid>
            ))}
          </Grid>
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
          justify: 'space-between'
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
                  maxWidth: '85%',
                  borderRadius: 3,
                  backgroundColor: msg.sender === 'user' ? '#6366f1' : 'rgba(15, 23, 42, 0.95)',
                  color: '#f8fafc',
                  border: msg.sender === 'user' ? 'none' : '1px solid rgba(255, 255, 255, 0.08)'
                }}
              >
                <Typography variant="body2" sx={{ whiteSpace: 'pre-line', lineHeight: 1.6, fontFamily: msg.text.includes('[Bedrock Agent Tool Execution') ? 'monospace' : 'inherit', fontSize: msg.text.includes('[Bedrock Agent Tool Execution') ? '0.82rem' : '0.88rem' }}>
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
                  {activeTool ? `Executing Agent Tool [${activeTool}]...` : 'Bedrock Agent is reasoning...'}
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

