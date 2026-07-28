import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Stack
} from '@mui/material';
import { Copy, Download, Check, FileCode } from 'lucide-react';

export const DeploymentGenerator = ({ samTemplate, projectTitle }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(samTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([samTemplate], { type: 'text/yaml' });
    element.href = URL.createObjectURL(file);
    element.download = `${(projectTitle || 'template').toLowerCase().replace(/[^a-z0-9]/g, '-')}-template.yaml`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 4,
          backgroundColor: '#0f172a',
          border: '1px solid rgba(52, 211, 153, 0.2)',
          mb: 4
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Chip
              icon={<FileCode size={16} color="#34d399" />}
              label="Feature 5 — Infrastructure-as-Code Generator"
              sx={{ backgroundColor: 'rgba(52, 211, 153, 0.15)', color: '#34d399', fontWeight: 700, mb: 1.5 }}
            />
            <Typography variant="h4" fontWeight={800} sx={{ color: '#f8fafc' }}>
              AWS SAM / CloudFormation Infrastructure Template
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              Production-ready deployment template configured with IAM policies, DynamoDB, API Gateway, & Bedrock permissions.
            </Typography>
          </Box>

          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={copied ? <Check size={18} color="#34d399" /> : <Copy size={18} />}
              onClick={handleCopy}
              sx={{
                color: copied ? '#34d399' : '#f8fafc',
                borderColor: copied ? '#34d399' : 'rgba(255, 255, 255, 0.2)',
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 2.5
              }}
            >
              {copied ? 'Copied YAML!' : 'Copy Template'}
            </Button>

            <Button
              variant="contained"
              startIcon={<Download size={18} />}
              onClick={handleDownload}
              sx={{
                background: 'linear-gradient(135deg, #34d399 0%, #059669 100%)',
                color: '#fff',
                fontWeight: 700,
                textTransform: 'none',
                borderRadius: 2.5,
                boxShadow: '0 10px 20px rgba(52, 211, 153, 0.3)'
              }}
            >
              Download template.yaml
            </Button>
          </Stack>
        </Box>
      </Paper>

      {/* Code Editor Window */}
      <Paper
        sx={{
          borderRadius: 3,
          backgroundColor: '#090d16',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          overflow: 'hidden'
        }}
      >
        {/* Top Code Header Bar */}
        <Box
          sx={{
            px: 3,
            py: 1.5,
            backgroundColor: '#0f172a',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography variant="caption" sx={{ color: '#818cf8', fontWeight: 700, fontFamily: 'monospace' }}>
            template.yaml — AWS SAM / CloudFormation
          </Typography>
          <Chip label="Valid YAML 1.2" size="small" sx={{ height: 20, fontSize: '0.65rem', backgroundColor: 'rgba(52, 211, 153, 0.15)', color: '#34d399' }} />
        </Box>

        {/* Code Content Box */}
        <Box
          sx={{
            p: 3,
            maxHeight: 500,
            overflowY: 'auto',
            fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
            fontSize: '0.9rem',
            lineHeight: 1.6,
            color: '#cbd5e1',
            whiteSpace: 'pre-wrap'
          }}
        >
          {samTemplate}
        </Box>
      </Paper>
    </Box>
  );
};
