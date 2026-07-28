import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
  Alert
} from '@mui/material';
import {
  Compass,
  Link2,
  PlusCircle,
  Search,
  LayoutDashboard,
  Zap
} from 'lucide-react';
import { getStoredApiUrl, setStoredApiUrl, DEFAULT_API_URL } from '../api/client';

export const Header = ({ currentTab, onTabChange, hasActiveProject }) => {
  const [openApiModal, setOpenApiModal] = useState(false);
  const [apiUrlInput, setApiUrlInput] = useState(getStoredApiUrl());
  const [savedSuccess, setSavedSuccess] = useState(false);

  const isCustomApi = apiUrlInput && !apiUrlInput.includes('paste-your-api') && !apiUrlInput.includes('paste your api');

  const handleSaveApi = () => {
    setStoredApiUrl(apiUrlInput);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setOpenApiModal(false);
    }, 1200);
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 4 } }}>
          {/* Logo & Brand */}
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}
            onClick={() => onTabChange('dashboard')}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2.5,
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)'
              }}
            >
              <Compass color="#fff" size={24} />
            </Box>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h6" fontWeight={800} sx={{ letterSpacing: '-0.5px', color: '#f8fafc' }}>
                  CloudCompass <span style={{ color: '#818cf8' }}>AI</span>
                </Typography>
                <Chip
                  label="CloudPilot Engine"
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    backgroundColor: 'rgba(99, 102, 241, 0.2)',
                    color: '#818cf8',
                    border: '1px solid rgba(129, 140, 248, 0.3)'
                  }}
                />
              </Box>
              <Typography variant="caption" sx={{ color: '#94a3b8', display: { xs: 'none', sm: 'block' } }}>
                Cloud Decision Intelligence Platform
              </Typography>
            </Box>
          </Box>

          {/* Navigation Links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center' }}>
            <Button
              startIcon={<LayoutDashboard size={18} />}
              onClick={() => onTabChange('dashboard')}
              sx={{
                color: currentTab === 'dashboard' ? '#818cf8' : '#94a3b8',
                backgroundColor: currentTab === 'dashboard' ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
                '&:hover': { color: '#f8fafc', backgroundColor: 'rgba(255, 255, 255, 0.05)' },
                borderRadius: 2,
                px: 2
              }}
            >
              Dashboard
            </Button>

            <Button
              startIcon={<PlusCircle size={18} />}
              onClick={() => onTabChange('new-project')}
              sx={{
                color: currentTab === 'new-project' ? '#818cf8' : '#94a3b8',
                backgroundColor: currentTab === 'new-project' ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
                '&:hover': { color: '#f8fafc', backgroundColor: 'rgba(255, 255, 255, 0.05)' },
                borderRadius: 2,
                px: 2
              }}
            >
              New Workload
            </Button>

            <Button
              startIcon={<Search size={18} />}
              onClick={() => onTabChange('existing-review')}
              sx={{
                color: currentTab === 'existing-review' ? '#818cf8' : '#94a3b8',
                backgroundColor: currentTab === 'existing-review' ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
                '&:hover': { color: '#f8fafc', backgroundColor: 'rgba(255, 255, 255, 0.05)' },
                borderRadius: 2,
                px: 2
              }}
            >
              Review Existing
            </Button>

            {hasActiveProject && (
              <Button
                startIcon={<Zap size={18} />}
                onClick={() => onTabChange('project-report')}
                sx={{
                  color: currentTab === 'project-report' ? '#38bdf8' : '#94a3b8',
                  backgroundColor: currentTab === 'project-report' ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  '&:hover': { color: '#f8fafc', backgroundColor: 'rgba(56, 189, 248, 0.2)' },
                  borderRadius: 2,
                  px: 2,
                  fontWeight: 600
                }}
              >
                Analysis Report
              </Button>
            )}
          </Box>

          {/* Right Actions: API Endpoint Config & Status */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Tooltip title="Configure AWS API Gateway Endpoint URL (Axios)">
              <Chip
                icon={<Link2 size={14} color={isCustomApi ? '#34d399' : '#f59e0b'} />}
                label={isCustomApi ? 'AWS API Connected' : 'Axios: paste your api'}
                onClick={() => setOpenApiModal(true)}
                sx={{
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  backgroundColor: isCustomApi ? 'rgba(52, 211, 153, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                  color: isCustomApi ? '#34d399' : '#fbbf24',
                  border: `1px solid ${isCustomApi ? 'rgba(52, 211, 153, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                  '&:hover': { opacity: 0.9 }
                }}
              />
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* API Endpoint Configuration Dialog */}
      <Dialog
        open={openApiModal}
        onClose={() => setOpenApiModal(false)}
        PaperProps={{
          sx: {
            backgroundColor: '#0f172a',
            backgroundImage: 'none',
            color: '#f8fafc',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
            maxWidth: 550,
            width: '100%'
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <Link2 size={22} color="#818cf8" />
          <Typography variant="h6" fontWeight={700}>
            AWS API Gateway Integration (Axios)
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ color: '#94a3b8', mb: 2 }}>
            Enter your deployed Amazon API Gateway HTTPS live endpoint URL. Requests from the application will be routed via Axios to this endpoint. If left as default, CloudPilot evaluates rules using its deterministic decision graph engine.
          </Typography>

          {savedSuccess && (
            <Alert severity="success" sx={{ mb: 2, backgroundColor: 'rgba(52, 211, 153, 0.15)', color: '#34d399' }}>
              API Gateway URL saved successfully!
            </Alert>
          )}

          <TextField
            fullWidth
            label="AWS API Gateway Endpoint URL"
            placeholder="https://xxxxxxxx.execute-api.us-east-1.amazonaws.com/prod"
            value={apiUrlInput}
            onChange={(e) => setApiUrlInput(e.target.value)}
            variant="outlined"
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#f8fafc',
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.15)' },
                '&:hover fieldset': { borderColor: '#818cf8' },
                '&.Mui-focused fieldset': { borderColor: '#6366f1' }
              },
              '& .MuiInputLabel-root': { color: '#94a3b8' }
            }}
          />

          <Box sx={{ mt: 2, p: 2, borderRadius: 2, backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px dashed rgba(255, 255, 255, 0.1)' }}>
            <Typography variant="caption" sx={{ color: '#cbd5e1', display: 'block', fontWeight: 600, mb: 0.5 }}>
              Axios Request Signature:
            </Typography>
            <Typography variant="caption" sx={{ fontFamily: 'monospace', color: '#818cf8', display: 'block' }}>
              POST {apiUrlInput || 'paste your api'}/analyze
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2.5, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <Button
            onClick={() => setApiUrlInput(DEFAULT_API_URL)}
            sx={{ color: '#94a3b8', textTransform: 'none' }}
          >
            Reset Default
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveApi}
            sx={{
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              color: '#fff',
              fontWeight: 600,
              textTransform: 'none',
              px: 3,
              borderRadius: 2
            }}
          >
            Save Endpoint
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
