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
  CircularProgress
} from '@mui/material';
import { Search, ArrowLeft, Send } from 'lucide-react';

const AWS_SERVICES = [
  'Amazon Bedrock',
  'Amazon Bedrock Agents',
  'Amazon Bedrock Knowledge Bases',
  'Amazon SageMaker',
  'Amazon EC2',
  'AWS Lambda',
  'Amazon ECS',
  'Amazon EKS',
  'Amazon S3',
  'Amazon RDS',
  'Amazon DynamoDB',
  'Amazon API Gateway',
  'Amazon CloudFront',
  'Amazon VPC',
  'AWS IAM',
  'AWS Secrets Manager',
  'Amazon CloudWatch',
  'AWS CloudTrail',
  'Other'
];

const AZURE_SERVICES = [
  'Azure AI Foundry',
  'Azure OpenAI Service',
  'Azure Functions',
  'Azure Virtual Machines',
  'Azure Kubernetes Service (AKS)',
  'Azure App Service',
  'Azure Blob Storage',
  'Azure SQL Database',
  'Azure Cosmos DB',
  'Azure API Management',
  'Azure Virtual Network',
  'Azure Key Vault',
  'Azure Monitor',
  'Microsoft Defender for Cloud',
  'Other'
];

const GCP_SERVICES = [
  'Vertex AI',
  'Compute Engine',
  'Cloud Run',
  'Google Kubernetes Engine (GKE)',
  'Cloud Functions',
  'Cloud Storage',
  'Cloud SQL',
  'Firestore',
  'BigQuery',
  'API Gateway',
  'VPC Network',
  'Secret Manager',
  'Cloud Monitoring',
  'Cloud Logging',
  'Other'
];

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

export const ExistingDeploymentForm = ({ onSubmit, onCancel, loading }) => {
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [currentCloudProvider, setCurrentCloudProvider] = useState('AWS');
  const [applicationType, setApplicationType] = useState('Dynamic Web App');
  const [needsAI, setNeedsAI] = useState(true);
  const [currentServices, setCurrentServices] = useState(['Amazon EC2', 'Amazon RDS']);
  const [otherCurrentService, setOtherCurrentService] = useState('');
  const [expectedTraffic, setExpectedTraffic] = useState('Medium (1,000–10,000 users or requests/day)');
  const [latencyRequirement, setLatencyRequirement] = useState('Low (100–300 ms)');
  const [monthlyBudget, setMonthlyBudget] = useState('$500 – $2,000/month');
  const [targetRegion, setTargetRegion] = useState('US East (N. Virginia)');
  const [complianceRequirements, setComplianceRequirements] = useState(['SOC 2']);
  const [otherCompliance, setOtherCompliance] = useState('');
  const [optimizationGoal, setOptimizationGoal] = useState('Minimize Cost 💰');
  const [validationError, setValidationError] = useState('');

  const getAvailableServices = () => {
    if (currentCloudProvider === 'Azure') return AZURE_SERVICES;
    if (currentCloudProvider === 'GCP') return GCP_SERVICES;
    return AWS_SERVICES;
  };

  const handleServiceToggle = (service) => {
    if (currentServices.includes(service)) {
      setCurrentServices(currentServices.filter((s) => s !== service));
    } else {
      setCurrentServices([...currentServices, service]);
    }
  };

  const handleCloudChange = (provider) => {
    setCurrentCloudProvider(provider);
    if (provider === 'AWS') setCurrentServices(['Amazon EC2', 'Amazon RDS']);
    else if (provider === 'Azure') setCurrentServices(['Azure Virtual Machines', 'Azure SQL Database']);
    else setCurrentServices(['Compute Engine', 'Cloud SQL']);
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
    if (currentServices.length === 0) {
      setValidationError('Please select at least one currently used cloud service.');
      return;
    }
    setValidationError('');

    const payload = {
      projectTitle,
      projectDescription,
      currentCloudProvider,
      applicationType,
      needsAI,
      serverlessPreference: 'No Preference',
      currentServices,
      otherCurrentService: currentServices.includes('Other') ? otherCurrentService : undefined,
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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowLeft size={18} />}
        onClick={onCancel}
        sx={{ color: '#94a3b8', mb: 3, textTransform: 'none', '&:hover': { color: '#f8fafc' } }}
      >
        Back to Dashboard
      </Button>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          backgroundColor: '#0f172a',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #38bdf8 0%, #6366f1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(56, 189, 248, 0.4)'
            }}
          >
            <Search color="#fff" size={28} />
          </Box>
          <Box>
            <Typography variant="h4" fontWeight={800} sx={{ color: '#f8fafc', letterSpacing: '-0.5px' }}>
              Form 2: Existing Deployment Review
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              Evaluate current cloud architecture, diagnose over/under-engineering, & unlock optimization opportunities.
            </Typography>
          </Box>
        </Box>

        {validationError && (
          <Alert severity="error" sx={{ mb: 3, backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5' }}>
            {validationError}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Current Cloud & Title */}
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight={700} sx={{ color: '#38bdf8', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                1. Project Identity & Current Cloud Provider
              </Typography>
              <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', mb: 2 }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body2" fontWeight={600} sx={{ color: '#cbd5e1', mb: 1 }}>
                Project Title *
              </Typography>
              <TextField
                fullWidth
                placeholder="e.g. Current E-Commerce Backend Infrastructure"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                variant="outlined"
                size="small"
                sx={inputStyles}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body2" fontWeight={600} sx={{ color: '#cbd5e1', mb: 1 }}>
                Current Cloud Provider (Dropdown) *
              </Typography>
              <TextField
                select
                fullWidth
                value={currentCloudProvider}
                onChange={(e) => handleCloudChange(e.target.value)}
                variant="outlined"
                size="small"
                sx={inputStyles}
              >
                <MenuItem value="AWS">Amazon Web Services (AWS)</MenuItem>
                <MenuItem value="Azure">Microsoft Azure</MenuItem>
                <MenuItem value="GCP">Google Cloud Platform (GCP)</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body2" fontWeight={600} sx={{ color: '#cbd5e1', mb: 1 }}>
                Application Type *
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

            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 2, backgroundColor: 'rgba(30, 41, 59, 0.4)', borderRadius: 3, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#f8fafc', mb: 1 }}>
                  Does your application use AI? (RadioButton)
                </Typography>
                <RadioGroup row value={needsAI ? 'Yes' : 'No'} onChange={(e) => setNeedsAI(e.target.value === 'Yes')}>
                  <FormControlLabel value="Yes" control={<Radio sx={{ color: '#38bdf8', '&.Mui-checked': { color: '#38bdf8' } }} />} label="Yes" />
                  <FormControlLabel value="No" control={<Radio sx={{ color: '#38bdf8', '&.Mui-checked': { color: '#38bdf8' } }} />} label="No" />
                </RadioGroup>
              </Paper>
            </Grid>

            {/* List Services Used (Multi-Select Checkboxes) */}
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight={700} sx={{ color: '#38bdf8', mt: 2, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                2. List the Services Currently Used in {currentCloudProvider} *
              </Typography>
              <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', mb: 2 }} />

              <Paper sx={{ p: 2.5, backgroundColor: 'rgba(30, 41, 59, 0.4)', borderRadius: 3, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <FormGroup row>
                  {getAvailableServices().map((service) => (
                    <FormControlLabel
                      key={service}
                      control={
                        <Checkbox
                          checked={currentServices.includes(service)}
                          onChange={() => handleServiceToggle(service)}
                          sx={{ color: '#38bdf8', '&.Mui-checked': { color: '#38bdf8' } }}
                        />
                      }
                      label={<Typography variant="body2" sx={{ color: '#f8fafc' }}>{service}</Typography>}
                      sx={{ width: { xs: '50%', sm: '33.33%' }, m: 0, py: 0.5 }}
                    />
                  ))}
                </FormGroup>

                {currentServices.includes('Other') && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" sx={{ color: '#94a3b8', mb: 0.5, display: 'block' }}>
                      Please specify other services:
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="e.g. Custom GPU bare metal cluster, Self-hosted Kafka"
                      value={otherCurrentService}
                      onChange={(e) => setOtherCurrentService(e.target.value)}
                      sx={inputStyles}
                    />
                  </Box>
                )}
              </Paper>
            </Grid>

            {/* Scale, Latency & Budget */}
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight={700} sx={{ color: '#38bdf8', mt: 2, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                3. Workload Parameters & Budget
              </Typography>
              <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', mb: 2 }} />
            </Grid>

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

            {/* Region, Compliance & Goal */}
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" fontWeight={600} sx={{ color: '#cbd5e1', mb: 1 }}>
                Target Deployment Region (Dropdown)
              </Typography>
              <TextField select fullWidth value={targetRegion} onChange={(e) => setTargetRegion(e.target.value)} variant="outlined" size="small" sx={inputStyles}>
                {REGIONS.map((grp) => [
                  <MenuItem key={grp.group} disabled sx={{ fontWeight: 800, color: '#38bdf8 !important', opacity: 1 }}>
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
              <Paper sx={{ p: 2, backgroundColor: 'rgba(30, 41, 59, 0.4)', borderRadius: 3, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <FormGroup row>
                  {COMPLIANCE_LIST.map((item) => (
                    <FormControlLabel
                      key={item}
                      control={
                        <Checkbox
                          checked={complianceRequirements.includes(item)}
                          onChange={() => handleComplianceChange(item)}
                          sx={{ color: '#38bdf8', '&.Mui-checked': { color: '#38bdf8' } }}
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
                      placeholder="e.g. FedRAMP, HIPAA, ISO 27001"
                      value={otherCompliance}
                      onChange={(e) => setOtherCompliance(e.target.value)}
                      sx={inputStyles}
                    />
                  </Box>
                )}
              </Paper>
            </Grid>

            {/* Actions */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button variant="outlined" onClick={onCancel} disabled={loading} sx={{ color: '#cbd5e1', borderColor: 'rgba(255,255,255,0.2)', textTransform: 'none', px: 3 }}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send size={18} />}
                  sx={{
                    background: 'linear-gradient(135deg, #38bdf8 0%, #6366f1 100%)',
                    color: '#fff',
                    fontWeight: 700,
                    textTransform: 'none',
                    px: 4,
                    py: 1.2,
                    borderRadius: 3.5,
                    boxShadow: '0 10px 25px rgba(56, 189, 248, 0.4)'
                  }}
                >
                  {loading ? 'Evaluating Existing Deployment...' : 'Run Review & Optimization Analysis'}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

const inputStyles = {
  '& .MuiOutlinedInput-root': {
    color: '#f8fafc',
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderRadius: '10px',
    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.12)' },
    '&:hover fieldset': { borderColor: '#38bdf8' },
    '&.Mui-focused fieldset': { borderColor: '#38bdf8' }
  },
  '& .MuiInputLabel-root': { color: '#94a3b8' },
  '& .MuiSvgIcon-root': { color: '#94a3b8' }
};
