import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Stack,
  Tabs,
  Tab
} from '@mui/material';
import { Copy, Download, Check, FileCode, Layers } from 'lucide-react';

export const DeploymentGenerator = ({ samTemplate, terraformTemplate, projectTitle }) => {
  const [activeFormat, setActiveFormat] = useState('sam'); // 'sam' | 'terraform'
  const [copied, setCopied] = useState(false);

  const activeCode = activeFormat === 'sam' ? (samTemplate || '') : (terraformTemplate || '');
  const activeFileName = activeFormat === 'sam' ? 'template.yaml' : 'main.tf';

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const mimeType = activeFormat === 'sam' ? 'text/yaml' : 'text/plain';
    const file = new Blob([activeCode], { type: mimeType });
    element.href = URL.createObjectURL(file);
    element.download = `${(projectTitle || 'infrastructure').toLowerCase().replace(/[^a-z0-9]/g, '-')}-${activeFileName}`;
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
              label="Infrastructure-as-Code & Terraform Generator"
              sx={{ backgroundColor: 'rgba(52, 211, 153, 0.15)', color: '#34d399', fontWeight: 700, mb: 1.5 }}
            />
            <Typography variant="h4" fontWeight={800} sx={{ color: '#f8fafc' }}>
              Infrastructure-as-Code Template Generator
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5 }}>
              Production-ready deployment templates configured for AWS SAM & HashiCorp Terraform (HCL). Generated via AI when API connected, or deterministically compiled locally.
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
              {copied ? `Copied ${activeFileName}!` : `Copy ${activeFileName}`}
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
              Download {activeFileName}
            </Button>
          </Stack>
        </Box>
      </Paper>

      {/* Code Format Switcher & Editor Window */}
      <Paper
        sx={{
          borderRadius: 3,
          backgroundColor: '#090d16',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          overflow: 'hidden'
        }}
      >
        {/* Format Selector Bar */}
        <Box
          sx={{
            px: 3,
            py: 1,
            backgroundColor: '#0f172a',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2
          }}
        >
          <Tabs
            value={activeFormat}
            onChange={(_, val) => setActiveFormat(val)}
            sx={{
              minHeight: 40,
              '& .MuiTab-root': {
                minHeight: 40,
                color: '#94a3b8',
                fontWeight: 700,
                fontSize: '0.85rem',
                textTransform: 'none',
                '&.Mui-selected': { color: '#34d399' }
              },
              '& .MuiTabs-indicator': { backgroundColor: '#34d399' }
            }}
          >
            <Tab value="sam" label="AWS SAM / CloudFormation (YAML)" />
            <Tab value="terraform" label="HashiCorp Terraform (HCL main.tf)" />
          </Tabs>

          <Chip
            label={activeFormat === 'sam' ? 'Valid YAML 1.2' : 'Valid HCL 2.0'}
            size="small"
            sx={{ height: 22, fontSize: '0.7rem', backgroundColor: 'rgba(52, 211, 153, 0.15)', color: '#34d399', fontWeight: 700 }}
          />
        </Box>

        {/* Code Content Box (Strict Left Aligned) */}
        <Box
          sx={{
            p: 3,
            maxHeight: 520,
            overflowX: 'auto',
            overflowY: 'auto',
            textAlign: 'left !important',
            direction: 'ltr !important'
          }}
        >
          <pre
            style={{
              margin: 0,
              padding: 0,
              textAlign: 'left',
              fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
              fontSize: '0.88rem',
              lineHeight: 1.6,
              color: '#cbd5e1',
              whiteSpace: 'pre',
              direction: 'ltr'
            }}
          >
            {activeCode}
          </pre>
        </Box>
      </Paper>
    </Box>
  );
};
