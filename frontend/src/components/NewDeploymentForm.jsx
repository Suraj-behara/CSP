import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormGroup,
  Button,
  Alert,
  Divider,
  Stack,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  Compass,
  Send,
  ArrowLeft,
  Sparkles,
  Layers,
  Cpu,
  Zap,
  Globe,
  ShieldCheck,
  Code,
  CheckCircle2
} from 'lucide-react';

const APPLICATION_TYPES = [
  'Static Website',
  'Dynamic Web App',
  'API Backend',
  'AI Chatbot',
  'Data Analytics',
  'Streaming',
  'IoT',
  'Batch Processing',
  'Event-driven',
  'Microservices'
];

const TRAFFIC_SCALES = [
  'Low (Less than 1,000 users or requests/day)',
  'Medium (1,000–10,000 users or requests/day)',
  'High (10,000–100,000 users or requests/day)',
  'Very High (More than 100,000 users or requests/day)',
  'Enterprise Scale (More than 1 million users or requests/day)'
];

const LATENCY_OPTIONS = [
  'Ultra Low (< 50 ms)',
  'Very Low (50–100 ms)',
  'Low (100–300 ms)',
  'Moderate (300–1000 ms)',
  'Flexible (> 1000 ms)'
];

const BUDGET_OPTIONS = [
  'Less than $500/month',
  '$500 – $2,000/month',
  '$2,000 – $10,000/month',
  '$10,000 – $50,000/month',
  'More than $50,000/month'
];

const OPTIMIZATION_GOALS = [
  { label: 'Minimize Cost 💰', desc: 'Recommend the most cost-effective deployment.' },
  { label: 'Maximize Performance ⚡', desc: 'Recommend the highest-performing services, even if they cost more.' },
  { label: 'Lowest Latency 🌍', desc: 'Prioritize fast response times and nearby regions.' },
  { label: 'High Availability & Reliability 🛡️', desc: 'Focus on fault tolerance and uptime.' },
  { label: 'Simplify Operations ⚙️', desc: 'Prefer fully managed and serverless services to reduce operational effort.' },
  { label: 'Meet Compliance Requirements 🔒', desc: 'Prioritize services and regions that satisfy compliance needs.' },
  { label: 'Balanced (Cost + Performance) ⚖️', desc: 'Balance cost, performance, reliability, and operational simplicity.' }
];

const REGIONS = [
  { group: 'Asia Pacific', items: ['Mumbai (India)', 'Hyderabad (India)', 'Singapore', 'Tokyo', 'Seoul', 'Sydney'] },
  { group: 'Europe', items: ['Ireland', 'Frankfurt', 'London', 'Paris'] },
  { group: 'North America', items: ['US East (N. Virginia)', 'US West (Oregon)', 'Canada Central'] },
  { group: 'Middle East', items: ['Bahrain', 'UAE (Dubai)'] },
  { group: 'South America', items: ['São Paulo'] },
  { group: 'Africa', items: ['Cape Town'] },
  { group: 'Global', items: ['Multi-Region'] }
];

const COMPLIANCE_LIST = ['None', 'GDPR', 'HIPAA', 'PCI DSS', 'ISO 27001', 'SOC 2', 'DPDP Act', 'Other'];

export const NewDeploymentForm = ({ onSubmit, onCancel, loading }) => {
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [applicationType, setApplicationType] = useState('Dynamic Web App');
  const [needsAI, setNeedsAI] = useState(true);
  const [serverlessPreference, setServerlessPreference] = useState('Yes');
  const [expectedTraffic, setExpectedTraffic] = useState('Medium (1,000–10,000 users or requests/day)');
  const [latencyRequirement, setLatencyRequirement] = useState('Low (100–300 ms)');
  const [monthlyBudget, setMonthlyBudget] = useState('$500 – $2,000/month');
  const [targetRegion, setTargetRegion] = useState('US East (N. Virginia)');
  const [complianceRequirements, setComplianceRequirements] = useState(['SOC 2']);
  const [otherCompliance, setOtherCompliance] = useState('');
  const [optimizationGoal, setOptimizationGoal] = useState('Balanced (Cost + Performance) ⚖️');
  const [validationError, setValidationError] = useState('');

  // Quick Preset Helper
  const applyPreset = (preset) => {
    if (preset === 'ai-copilot') {
      setProjectTitle('AI Customer Support Copilot');
      setProjectDescription('LLM conversational agent with document knowledge retrieval and auto-scaling.');
      setApplicationType('AI Chatbot');
      setNeedsAI(true);
      setServerlessPreference('Yes');
      setExpectedTraffic('Medium (1,000–10,000 users or requests/day)');
      setLatencyRequirement('Low (100–300 ms)');
      setMonthlyBudget('$500 – $2,000/month');
      setComplianceRequirements(['SOC 2', 'HIPAA']);
    } else if (preset === 'serverless-api') {
      setProjectTitle('SaaS API Backend');
      setProjectDescription('High throughput REST API for mobile app client session management.');
      setApplicationType('API Backend');
      setNeedsAI(false);
      setServerlessPreference('Yes');
      setExpectedTraffic('High (10,000–100,000 users or requests/day)');
      setLatencyRequirement('Very Low (50–100 ms)');
      setMonthlyBudget('Less than $500/month');
      setComplianceRequirements(['PCI DSS']);
    } else if (preset === 'enterprise-data') {
      setProjectTitle('Global Analytics Pipeline');
      setProjectDescription('Batch and streaming data pipeline processing daily telemetry records.');
      setApplicationType('Data Analytics');
      setNeedsAI(true);
      setServerlessPreference('No Preference');
      setExpectedTraffic('Enterprise Scale (More than 1 million users or requests/day)');
      setLatencyRequirement('Flexible (> 1000 ms)');
      setMonthlyBudget('$10,000 – $50,000/month');
      setComplianceRequirements(['GDPR', 'ISO 27001']);
    }
  };

  const handleComplianceChange = (item) => {
    if (item === 'None') {
      setComplianceRequirements(['None']);
      return;
    }
    let updated = complianceRequirements.filter((c) => c !== 'None');
    if (updated.includes(item)) {
      updated = updated.filter((c) => c !== item);
    } else {
      updated.push(item);
    }
    setComplianceRequirements(updated.length > 0 ? updated : ['None']);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!projectTitle.trim()) {
      setValidationError('Please enter a Project Title.');
      return;
    }
    setValidationError('');

    const payload = {
      projectTitle,
      projectDescription,
      applicationType,
      needsAI,
      serverlessPreference,
      expectedTraffic,
      latencyRequirement,
      monthlyBudget,
      targetRegion,
      complianceRequirements,
      otherCompliance: complianceRequirements.includes('Other') ? otherCompliance : undefined,
      optimizationGoal
    };

    await onSubmit(payload);
  };

  // Normalized Requirement Object Preview
  const normalizedObject = {
    projectTitle: projectTitle || 'Untitled Workload',
    applicationType,
    needsAI,
    serverlessPreference,
    expectedTraffic: expectedTraffic.split(' ')[0],
    latencyRequirement: latencyRequirement.split(' ')[0] + ' ' + (latencyRequirement.match(/\((.*?)\)/)?.[1] || ''),
    monthlyBudget: monthlyBudget.split(' ')[0],
    targetRegion,
    compliance: complianceRequirements.join(', '),
    optimizationGoal: optimizationGoal.split(' ')[0]
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowLeft size={18} />}
        onClick={onCancel}
        sx={{ color: '#94a3b8', mb: 3, textTransform: 'none', '&:hover': { color: '#f8fafc' } }}
      >
        Back to Dashboard
      </Button>

      {/* Main Header Banner */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 4,
          backgroundColor: '#0f172a',
          border: '1px solid rgba(129, 140, 248, 0.2)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          mb: 4
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 25px rgba(99, 102, 241, 0.4)'
              }}
            >
              <Compass color="#fff" size={30} />
            </Box>
            <Box>
              <Chip
                label="Feature 1 — Discovery Wizard"
                size="small"
                sx={{ backgroundColor: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', fontWeight: 700, mb: 1 }}
              />
              <Typography variant="h4" fontWeight={800} sx={{ color: '#f8fafc', letterSpacing: '-0.5px' }}>
                Structured New Workload Discovery
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                Interview engine converts natural business requirements into a normalized Cloud Decision Graph payload.
              </Typography>
            </Box>
          </Box>

          {/* Presets */}
          <Box>
            <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', fontWeight: 700, mb: 1 }}>
              ⚡ Quick Fill Presets:
            </Typography>
            <Stack direction="row" spacing={1}>
              <Chip label="AI Chatbot" onClick={() => applyPreset('ai-copilot')} size="small" clickable sx={{ backgroundColor: 'rgba(168, 85, 247, 0.2)', color: '#c084fc', fontWeight: 600 }} />
              <Chip label="Serverless API" onClick={() => applyPreset('serverless-api')} size="small" clickable sx={{ backgroundColor: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', fontWeight: 600 }} />
              <Chip label="Analytics Pipeline" onClick={() => applyPreset('enterprise-data')} size="small" clickable sx={{ backgroundColor: 'rgba(52, 211, 153, 0.2)', color: '#34d399', fontWeight: 600 }} />
            </Stack>
          </Box>
        </Box>
      </Paper>

      {validationError && (
        <Alert severity="error" sx={{ mb: 3, backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5' }}>
          {validationError}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Left Column: Structured Form Sections */}
        <Grid item xs={12} lg={8}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              {/* Step 1: Project Identity */}
              <Paper sx={{ p: 4, borderRadius: 3.5, backgroundColor: '#1e293b', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                  <Box sx={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: '#6366f1', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}>
                    1
                  </Box>
                  <Typography variant="h6" fontWeight={800} sx={{ color: '#f8fafc' }}>
                    Project Identity & Workload Classification
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: '#94a3b8', mb: 3, display: 'block', pl: 5 }}>
                  Define application scope and core domain pattern.
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" fontWeight={600} sx={{ color: '#cbd5e1', mb: 1 }}>
                      Project Title *
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="e.g. NextGen AI Customer Support Copilot"
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                      variant="outlined"
                      size="small"
                      sx={inputStyles}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" fontWeight={600} sx={{ color: '#cbd5e1', mb: 1 }}>
                      Application Type (Dropdown) *
                    </Typography>
                    <TextField
                      select
                      fullWidth
                      value={applicationType}
                      onChange={(e) => setApplicationType(e.target.value)}
                      variant="outlined"
                      size="small"
                      sx={inputStyles}
                    >
                      {APPLICATION_TYPES.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="body2" fontWeight={600} sx={{ color: '#cbd5e1', mb: 1 }}>
                      Workload Context & Functional Goals
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={2.5}
                      placeholder="Describe what your system will do, latency targets, and data sensitivity requirements..."
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      variant="outlined"
                      sx={inputStyles}
                    />
                  </Grid>
                </Grid>
              </Paper>

              {/* Step 2: AI & Architecture Preferences */}
              <Paper sx={{ p: 4, borderRadius: 3.5, backgroundColor: '#1e293b', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                  <Box sx={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: '#a855f7', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}>
                    2
                  </Box>
                  <Typography variant="h6" fontWeight={800} sx={{ color: '#f8fafc' }}>
                    AI Capability & Serverless Execution
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: '#94a3b8', mb: 3, display: 'block', pl: 5 }}>
                  Configure whether your application invokes LLM foundation models or requires serverless scale.
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Paper sx={{ p: 2.5, backgroundColor: 'rgba(15, 23, 42, 0.6)', borderRadius: 3, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#f8fafc', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Cpu size={18} color="#c084fc" /> Requires AI / LLM Integration?
                      </Typography>
                      <RadioGroup row value={needsAI ? 'Yes' : 'No'} onChange={(e) => setNeedsAI(e.target.value === 'Yes')}>
                        <FormControlLabel value="Yes" control={<Radio sx={{ color: '#a855f7', '&.Mui-checked': { color: '#a855f7' } }} />} label="Yes (Bedrock / OpenAI)" />
                        <FormControlLabel value="No" control={<Radio sx={{ color: '#a855f7', '&.Mui-checked': { color: '#a855f7' } }} />} label="No (Standard)" />
                      </RadioGroup>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Paper sx={{ p: 2.5, backgroundColor: 'rgba(15, 23, 42, 0.6)', borderRadius: 3, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#f8fafc', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Zap size={18} color="#818cf8" /> Serverless Deployment Preference?
                      </Typography>
                      <RadioGroup row value={serverlessPreference} onChange={(e) => setServerlessPreference(e.target.value)}>
                        <FormControlLabel value="Yes" control={<Radio sx={{ color: '#818cf8', '&.Mui-checked': { color: '#818cf8' } }} />} label="Yes" />
                        <FormControlLabel value="No" control={<Radio sx={{ color: '#818cf8', '&.Mui-checked': { color: '#818cf8' } }} />} label="No" />
                        <FormControlLabel value="No Preference" control={<Radio sx={{ color: '#818cf8', '&.Mui-checked': { color: '#818cf8' } }} />} label="No Pref" />
                      </RadioGroup>
                    </Paper>
                  </Grid>
                </Grid>
              </Paper>

              {/* Step 3: Scale, Latency & Budget */}
              <Paper sx={{ p: 4, borderRadius: 3.5, backgroundColor: '#1e293b', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                  <Box sx={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: '#38bdf8', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}>
                    3
                  </Box>
                  <Typography variant="h6" fontWeight={800} sx={{ color: '#f8fafc' }}>
                    Traffic Scale, Latency SLA & Budget
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: '#94a3b8', mb: 3, display: 'block', pl: 5 }}>
                  Specify expected volume, maximum acceptable latency, and monthly spending envelope.
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" fontWeight={600} sx={{ color: '#cbd5e1', mb: 1 }}>
                      Expected Traffic (Dropdown)
                    </Typography>
                    <TextField select fullWidth value={expectedTraffic} onChange={(e) => setExpectedTraffic(e.target.value)} variant="outlined" size="small" sx={inputStyles}>
                      {TRAFFIC_SCALES.map((scale) => (
                        <MenuItem key={scale} value={scale}>
                          {scale}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" fontWeight={600} sx={{ color: '#cbd5e1', mb: 1 }}>
                      Latency Requirement (Dropdown)
                    </Typography>
                    <TextField select fullWidth value={latencyRequirement} onChange={(e) => setLatencyRequirement(e.target.value)} variant="outlined" size="small" sx={inputStyles}>
                      {LATENCY_OPTIONS.map((lat) => (
                        <MenuItem key={lat} value={lat}>
                          {lat}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" fontWeight={600} sx={{ color: '#cbd5e1', mb: 1 }}>
                      Monthly Budget (Dropdown)
                    </Typography>
                    <TextField select fullWidth value={monthlyBudget} onChange={(e) => setMonthlyBudget(e.target.value)} variant="outlined" size="small" sx={inputStyles}>
                      {BUDGET_OPTIONS.map((b) => (
                        <MenuItem key={b} value={b}>
                          {b}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>
              </Paper>

              {/* Step 4: Region & Compliance */}
              <Paper sx={{ p: 4, borderRadius: 3.5, backgroundColor: '#1e293b', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                  <Box sx={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: '#34d399', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}>
                    4
                  </Box>
                  <Typography variant="h6" fontWeight={800} sx={{ color: '#f8fafc' }}>
                    Target Region & Compliance Constraints
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: '#94a3b8', mb: 3, display: 'block', pl: 5 }}>
                  Ensure hardware and service selection strictly satisfies regulatory rules.
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" fontWeight={600} sx={{ color: '#cbd5e1', mb: 1 }}>
                      Target Deployment Region (Dropdown)
                    </Typography>
                    <TextField select fullWidth value={targetRegion} onChange={(e) => setTargetRegion(e.target.value)} variant="outlined" size="small" sx={inputStyles}>
                      {REGIONS.map((grp) => [
                        <MenuItem key={grp.group} disabled sx={{ fontWeight: 800, color: '#818cf8 !important', opacity: 1 }}>
                          ▼ {grp.group}
                        </MenuItem>,
                        ...grp.items.map((reg) => (
                          <MenuItem key={reg} value={reg} sx={{ pl: 4 }}>
                            • {reg}
                          </MenuItem>
                        ))
                      ])}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" fontWeight={600} sx={{ color: '#cbd5e1', mb: 1 }}>
                      Optimization Goal (Dropdown)
                    </Typography>
                    <TextField select fullWidth value={optimizationGoal} onChange={(e) => setOptimizationGoal(e.target.value)} variant="outlined" size="small" sx={inputStyles}>
                      {OPTIMIZATION_GOALS.map((goal) => (
                        <MenuItem key={goal.label} value={goal.label}>
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {goal.label}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                              {goal.desc}
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="body2" fontWeight={600} sx={{ color: '#cbd5e1', mb: 1 }}>
                      Compliance Requirements (Checkboxes)
                    </Typography>
                    <Paper sx={{ p: 2.5, backgroundColor: 'rgba(15, 23, 42, 0.6)', borderRadius: 3, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <FormGroup row>
                        {COMPLIANCE_LIST.map((item) => (
                          <FormControlLabel
                            key={item}
                            control={
                              <Checkbox
                                checked={complianceRequirements.includes(item)}
                                onChange={() => handleComplianceChange(item)}
                                sx={{ color: '#34d399', '&.Mui-checked': { color: '#34d399' } }}
                              />
                            }
                            label={<Typography variant="body2" sx={{ color: '#f8fafc' }}>{item}</Typography>}
                            sx={{ width: { xs: '50%', sm: '25%' }, m: 0, py: 0.5 }}
                          />
                        ))}
                      </FormGroup>

                      {complianceRequirements.includes('Other') && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="caption" sx={{ color: '#94a3b8', mb: 0.5, display: 'block' }}>
                            Please specify other compliance requirements:
                          </Typography>
                          <TextField
                            fullWidth
                            size="small"
                            placeholder="e.g. FedRAMP High, HIPAA + Cyber Essentials"
                            value={otherCompliance}
                            onChange={(e) => setOtherCompliance(e.target.value)}
                            sx={inputStyles}
                          />
                        </Box>
                      )}
                    </Paper>
                  </Grid>
                </Grid>
              </Paper>

              {/* Submit Action Bar */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button variant="outlined" onClick={onCancel} disabled={loading} sx={{ color: '#cbd5e1', borderColor: 'rgba(255,255,255,0.2)', textTransform: 'none', px: 3, borderRadius: 3 }}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send size={18} />}
                  sx={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                    color: '#fff',
                    fontWeight: 700,
                    textTransform: 'none',
                    px: 4,
                    py: 1.5,
                    borderRadius: 3.5,
                    fontSize: '1rem',
                    boxShadow: '0 10px 25px rgba(99, 102, 241, 0.4)'
                  }}
                >
                  {loading ? 'Evaluating Cloud Decision Graph...' : 'Evaluate Cloud Placement'}
                </Button>
              </Box>
            </Stack>
          </form>
        </Grid>

        {/* Right Column: Live Normalized Spec Preview Inspector */}
        <Grid item xs={12} lg={4}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3.5,
              backgroundColor: '#090d16',
              border: '1px solid rgba(129, 140, 248, 0.3)',
              position: 'sticky',
              top: 100
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Code size={20} color="#818cf8" />
              <Typography variant="subtitle1" fontWeight={800} sx={{ color: '#f8fafc' }}>
                Normalized Requirement Object
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: '#94a3b8', mb: 2, display: 'block' }}>
              Real-time normalized input specification evaluated downstream by the Bedrock Decision Graph.
            </Typography>

            <Paper
              sx={{
                p: 2.5,
                borderRadius: 2.5,
                backgroundColor: '#0f172a',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                fontFamily: 'Consolas, Monaco, monospace',
                fontSize: '0.82rem',
                color: '#38bdf8',
                whiteSpace: 'pre-wrap',
                mb: 3
              }}
            >
              {JSON.stringify(normalizedObject, null, 2)}
            </Paper>

            <Typography variant="caption" sx={{ color: '#cbd5e1', fontWeight: 700, display: 'block', mb: 1 }}>
              Why this matters:
            </Typography>
            <Stack spacing={1}>
              <Typography variant="caption" sx={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle2 size={14} color="#34d399" /> Eliminates vague prompt ambiguity
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle2 size={14} color="#34d399" /> Feeds deterministic multi-cloud scoring model
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle2 size={14} color="#34d399" /> Enforces compliance pre-deployment
              </Typography>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

const inputStyles = {
  '& .MuiOutlinedInput-root': {
    color: '#f8fafc',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderRadius: '10px',
    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.12)' },
    '&:hover fieldset': { borderColor: '#818cf8' },
    '&.Mui-focused fieldset': { borderColor: '#6366f1' }
  },
  '& .MuiInputLabel-root': { color: '#94a3b8' },
  '& .MuiSvgIcon-root': { color: '#94a3b8' }
};
