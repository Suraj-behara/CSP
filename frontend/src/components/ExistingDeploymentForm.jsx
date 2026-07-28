import React, { useState } from 'react';
import {
  ListSubheader,
  Select,
  FormControl,
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
  Stack,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  Search,
  ArrowLeft,
  Send,
  Code,
  CheckCircle2,
  Cpu,
  Zap,
  Layers
} from 'lucide-react';

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
  { value: 'Mumbai (India)', group: 'Asia Pacific' },
  { value: 'Hyderabad (India)', group: 'Asia Pacific' },
  { value: 'Singapore', group: 'Asia Pacific' },
  { value: 'Tokyo', group: 'Asia Pacific' },
  { value: 'Seoul', group: 'Asia Pacific' },
  { value: 'Sydney', group: 'Asia Pacific' },
  { value: 'Ireland', group: 'Europe' },
  { value: 'Frankfurt', group: 'Europe' },
  { value: 'London', group: 'Europe' },
  { value: 'Paris', group: 'Europe' },
  { value: 'US East (N. Virginia)', group: 'North America' },
  { value: 'US West (Oregon)', group: 'North America' },
  { value: 'Canada Central', group: 'North America' },
  { value: 'Bahrain', group: 'Middle East' },
  { value: 'UAE (Dubai)', group: 'Middle East' },
  { value: 'São Paulo', group: 'South America' },
  { value: 'Cape Town', group: 'Africa' },
  { value: 'Multi-Region', group: 'Global' }
];

const COMPLIANCE_LIST = ['None', 'GDPR', 'HIPAA', 'PCI DSS', 'ISO 27001', 'SOC 2', 'DPDP Act', 'Other'];

export const ExistingDeploymentForm = ({ onSubmit, onCancel, loading }) => {
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [currentCloudProvider, setCurrentCloudProvider] = useState('');
  const [applicationType, setApplicationType] = useState('');
  const [needsAI, setNeedsAI] = useState(true);
  const [currentServices, setCurrentServices] = useState([]);
  const [otherCurrentService, setOtherCurrentService] = useState('');
  const [expectedTraffic, setExpectedTraffic] = useState('');
  const [latencyRequirement, setLatencyRequirement] = useState('');
  const [monthlyBudget, setMonthlyBudget] = useState('');
  const [targetRegion, setTargetRegion] = useState('');
  const [complianceRequirements, setComplianceRequirements] = useState(['SOC 2']);
  const [otherCompliance, setOtherCompliance] = useState('');
  const [optimizationGoals, setOptimizationGoals] = useState([]);
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
    setCurrentServices([]);
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
    if (!currentCloudProvider) {
      setValidationError('Please select your Current Cloud Provider.');
      return;
    }
    if (currentServices.length === 0) {
      setValidationError('Please select at least one currently used cloud service.');
      return;
    }
    if (!applicationType) {
      setValidationError('Please select an Application Type.');
      return;
    }
    if (!expectedTraffic) {
      setValidationError('Please select Expected Traffic.');
      return;
    }
    if (!latencyRequirement) {
      setValidationError('Please select Latency Requirement.');
      return;
    }
    if (!monthlyBudget) {
      setValidationError('Please select Monthly Budget.');
      return;
    }
    if (!targetRegion) {
      setValidationError('Please select Target Deployment Region.');
      return;
    }
    if (optimizationGoals.length === 0) {
      setValidationError('Please select at least one Optimization Goal.');
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
      optimizationGoal: optimizationGoals.join(', ')
    };

    await onSubmit(payload);
  };

  const normalizedObject = {
    projectTitle: projectTitle || 'Untitled Existing Workload',
    currentCloudProvider: currentCloudProvider || 'Not specified',
    applicationType: applicationType || 'Not specified',
    needsAI,
    currentServicesCount: currentServices.length,
    currentServices: currentServices.length > 0 ? currentServices.slice(0, 4).join(', ') + (currentServices.length > 4 ? '...' : '') : 'None selected',
    expectedTraffic: expectedTraffic ? expectedTraffic.split(' ')[0] : 'Not specified',
    latencyRequirement: latencyRequirement ? (latencyRequirement.split(' ')[0] + ' ' + (latencyRequirement.match(/\((.*?)\)/)?.[1] || '')) : 'Not specified',
    monthlyBudget: monthlyBudget ? monthlyBudget.split(' ')[0] : 'Not specified',
    targetRegion: targetRegion || 'Not specified',
    compliance: complianceRequirements.join(', '),
    optimizationGoals: optimizationGoals.length > 0 ? optimizationGoals.map((g) => g.split(' ')[0]).join(', ') : 'None'
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
          border: '1px solid rgba(56, 189, 248, 0.2)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          mb: 4
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #38bdf8 0%, #6366f1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 25px rgba(56, 189, 248, 0.4)'
            }}
          >
            <Search color="#fff" size={30} />
          </Box>
          <Box>
            <Chip
              label="Review & Optimization Wizard"
              size="small"
              sx={{ backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontWeight: 700, mb: 1 }}
            />
            <Typography variant="h4" fontWeight={800} sx={{ color: '#f8fafc', letterSpacing: '-0.5px' }}>
              Existing Deployment Review
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              Audit current cloud architecture, diagnose over/under-engineering risks, & unlock optimization blueprints.
            </Typography>
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
              {/* Step 1: Project Identity & Current Cloud */}
              <Paper sx={{ p: 4, borderRadius: 3.5, backgroundColor: '#1e293b', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                  <Box sx={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: '#38bdf8', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}>
                    1
                  </Box>
                  <Typography variant="h6" fontWeight={800} sx={{ color: '#f8fafc' }}>
                    Project Identity & Current Cloud Provider
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: '#94a3b8', mb: 3, display: 'block', pl: 5 }}>
                  Specify project title, target provider, and workload classification.
                </Typography>

                <Grid container spacing={3}>
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
                      Current Cloud Provider *
                    </Typography>
                    <TextField
                      select
                      fullWidth
                      value={currentCloudProvider}
                      onChange={(e) => handleCloudChange(e.target.value)}
                      variant="outlined"
                      size="small"
                      sx={inputStyles}
                      SelectProps={{
                        displayEmpty: true,
                        renderValue: (selected) => {
                          if (!selected) {
                            return <Typography variant="body2" sx={{ color: '#94a3b8' }}>Select cloud provider...</Typography>;
                          }
                          return selected === 'AWS' ? 'Amazon Web Services (AWS)' : selected === 'Azure' ? 'Microsoft Azure' : selected === 'GCP' ? 'Google Cloud Platform (GCP)' : selected;
                        }
                      }}
                    >
                      <MenuItem value="" sx={{ color: '#94a3b8' }}>
                        Select cloud provider...
                      </MenuItem>
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
                      SelectProps={{
                        displayEmpty: true,
                        renderValue: (selected) => {
                          if (!selected) {
                            return <Typography variant="body2" sx={{ color: '#94a3b8' }}>Select application type...</Typography>;
                          }
                          return selected;
                        }
                      }}
                    >
                      <MenuItem value="" sx={{ color: '#94a3b8' }}>
                        Select application type...
                      </MenuItem>
                      {APPLICATION_TYPES.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" fontWeight={600} sx={{ color: '#cbd5e1', mb: 1 }}>
                      Requires AI Integration? *
                    </Typography>
                    <Paper sx={{ p: 1, px: 2, backgroundColor: 'rgba(15, 23, 42, 0.8)', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.12)', height: 40, display: 'flex', alignItems: 'center' }}>
                      <RadioGroup row value={needsAI ? 'Yes' : 'No'} onChange={(e) => setNeedsAI(e.target.value === 'Yes')}>
                        <FormControlLabel value="Yes" control={<Radio size="small" sx={{ color: '#38bdf8', '&.Mui-checked': { color: '#38bdf8' } }} />} label={<Typography variant="body2" sx={{ color: '#f8fafc' }}>Yes</Typography>} />
                        <FormControlLabel value="No" control={<Radio size="small" sx={{ color: '#38bdf8', '&.Mui-checked': { color: '#38bdf8' } }} />} label={<Typography variant="body2" sx={{ color: '#f8fafc' }}>No</Typography>} />
                      </RadioGroup>
                    </Paper>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="body2" fontWeight={600} sx={{ color: '#cbd5e1', mb: 1 }}>
                      Workload Context & Current Pain Points
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={2.5}
                      placeholder="Describe current architecture issues, high monthly costs, or performance bottlenecks..."
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      variant="outlined"
                      sx={inputStyles}
                    />
                  </Grid>
                </Grid>
              </Paper>

              {/* Step 2: Currently Used Services */}
              <Paper sx={{ p: 4, borderRadius: 3.5, backgroundColor: '#1e293b', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                  <Box sx={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: '#a855f7', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}>
                    2
                  </Box>
                  <Typography variant="h6" fontWeight={800} sx={{ color: '#f8fafc' }}>
                    Services Currently Used in {currentCloudProvider}
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: '#94a3b8', mb: 3, display: 'block', pl: 5 }}>
                  Select active infrastructure components to analyze over/under-engineering risks.
                </Typography>

                <Paper sx={{ p: 2.5, backgroundColor: 'rgba(15, 23, 42, 0.6)', borderRadius: 3, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
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
                  Specify current traffic volume, latency requirements, and monthly cost targets.
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" fontWeight={600} sx={{ color: '#cbd5e1', mb: 1 }}>
                      Expected Traffic
                    </Typography>
                    <TextField
                      select
                      fullWidth
                      value={expectedTraffic}
                      onChange={(e) => setExpectedTraffic(e.target.value)}
                      variant="outlined"
                      size="small"
                      sx={inputStyles}
                      SelectProps={{
                        displayEmpty: true,
                        renderValue: (selected) => {
                          if (!selected) {
                            return <Typography variant="body2" sx={{ color: '#94a3b8' }}>Select expected traffic...</Typography>;
                          }
                          return selected;
                        }
                      }}
                    >
                      <MenuItem value="" sx={{ color: '#94a3b8' }}>
                        Select expected traffic...
                      </MenuItem>
                      {TRAFFIC_SCALES.map((scale) => (
                        <MenuItem key={scale} value={scale}>
                          {scale}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" fontWeight={600} sx={{ color: '#cbd5e1', mb: 1 }}>
                      Latency Requirement
                    </Typography>
                    <TextField
                      select
                      fullWidth
                      value={latencyRequirement}
                      onChange={(e) => setLatencyRequirement(e.target.value)}
                      variant="outlined"
                      size="small"
                      sx={inputStyles}
                      SelectProps={{
                        displayEmpty: true,
                        renderValue: (selected) => {
                          if (!selected) {
                            return <Typography variant="body2" sx={{ color: '#94a3b8' }}>Select latency requirement...</Typography>;
                          }
                          return selected;
                        }
                      }}
                    >
                      <MenuItem value="" sx={{ color: '#94a3b8' }}>
                        Select latency requirement...
                      </MenuItem>
                      {LATENCY_OPTIONS.map((lat) => (
                        <MenuItem key={lat} value={lat}>
                          {lat}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" fontWeight={600} sx={{ color: '#cbd5e1', mb: 1 }}>
                      Monthly Budget
                    </Typography>
                    <TextField
                      select
                      fullWidth
                      value={monthlyBudget}
                      onChange={(e) => setMonthlyBudget(e.target.value)}
                      variant="outlined"
                      size="small"
                      sx={inputStyles}
                      SelectProps={{
                        displayEmpty: true,
                        renderValue: (selected) => {
                          if (!selected) {
                            return <Typography variant="body2" sx={{ color: '#94a3b8' }}>Select monthly budget...</Typography>;
                          }
                          return selected;
                        }
                      }}
                    >
                      <MenuItem value="" sx={{ color: '#94a3b8' }}>
                        Select monthly budget...
                      </MenuItem>
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
                  Ensure current deployment conforms to regional compliance frameworks.
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" fontWeight={600} sx={{ color: '#cbd5e1', mb: 1 }}>
                      Target Deployment Region
                    </Typography>
                    <TextField
                      select
                      fullWidth
                      value={targetRegion}
                      onChange={(e) => setTargetRegion(e.target.value)}
                      variant="outlined"
                      size="small"
                      sx={inputStyles}
                      SelectProps={{
                        displayEmpty: true,
                        renderValue: (selected) => {
                          if (!selected) {
                            return <Typography variant="body2" sx={{ color: '#94a3b8' }}>Select target region...</Typography>;
                          }
                          return selected;
                        }
                      }}
                    >
                      <MenuItem value="" sx={{ color: '#94a3b8' }}>
                        Select target region...
                      </MenuItem>
                      {REGIONS.map((reg) => (
                        <MenuItem
                          key={reg.value}
                          value={reg.value}
                          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        >
                          <span>{reg.value}</span>
                          <span style={{ color: '#64748b', fontSize: '0.75rem', marginLeft: '16px' }}>
                            {reg.group}
                          </span>
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" fontWeight={600} sx={{ color: '#cbd5e1', mb: 1 }}>
                      Optimization Goals
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        multiple
                        displayEmpty
                        value={optimizationGoals}
                        onChange={(e) => {
                          const val = e.target.value;
                          const updated = typeof val === 'string' ? val.split(',') : val;
                          setOptimizationGoals(updated);
                        }}
                        renderValue={(selected) => {
                          if (!selected || selected.length === 0) {
                            return <Typography variant="body2" sx={{ color: '#94a3b8' }}>Select goals...</Typography>;
                          }
                          return (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {selected.map((val) => (
                                <Chip
                                  key={val}
                                  label={val.split(' ')[0] + ' ' + (val.split(' ')[1] || '')}
                                  size="small"
                                  onDelete={(e) => {
                                    e.stopPropagation();
                                    setOptimizationGoals(optimizationGoals.filter((g) => g !== val));
                                  }}
                                  sx={{
                                    backgroundColor: 'rgba(56, 189, 248, 0.25)',
                                    color: '#38bdf8',
                                    fontWeight: 600,
                                    height: 22,
                                    fontSize: '0.75rem',
                                    '& .MuiChip-deleteIcon': { color: '#38bdf8', '&:hover': { color: '#f8fafc' } }
                                  }}
                                />
                              ))}
                            </Box>
                          );
                        }}
                        sx={{
                          color: '#f8fafc',
                          backgroundColor: 'rgba(15, 23, 42, 0.8)',
                          borderRadius: '10px',
                          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.12)' },
                          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#38bdf8' },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#38bdf8' },
                          '& .MuiSvgIcon-root': { color: '#94a3b8' }
                        }}
                      >
                        {OPTIMIZATION_GOALS.map((goal) => (
                          <MenuItem key={goal.label} value={goal.label} sx={{ py: 1, px: 2 }}>
                            <Checkbox
                              checked={optimizationGoals.includes(goal.label)}
                              size="small"
                              sx={{ color: '#38bdf8', '&.Mui-checked': { color: '#38bdf8' }, mr: 1, p: 0 }}
                            />
                            <Box>
                              <Typography variant="body2" fontWeight={600} sx={{ color: '#f8fafc' }}>
                                {goal.label}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                                {goal.desc}
                              </Typography>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
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
                    background: 'linear-gradient(135deg, #38bdf8 0%, #6366f1 100%)',
                    color: '#fff',
                    fontWeight: 700,
                    textTransform: 'none',
                    px: 4,
                    py: 1.5,
                    borderRadius: 3.5,
                    fontSize: '1rem',
                    boxShadow: '0 10px 25px rgba(56, 189, 248, 0.4)'
                  }}
                >
                  {loading ? 'Evaluating Existing Deployment...' : 'Run Review & Optimization Analysis'}
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
              border: '1px solid rgba(56, 189, 248, 0.3)',
              position: 'sticky',
              top: 100
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Code size={20} color="#38bdf8" />
              <Typography variant="subtitle1" fontWeight={800} sx={{ color: '#f8fafc' }}>
                Normalized Existing Audit Spec
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: '#94a3b8', mb: 2, display: 'block' }}>
              Real-time specification payload evaluated downstream to calculate over-engineering and cost-saving metrics.
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
                <CheckCircle2 size={14} color="#34d399" /> Audits over-provisioned EC2/RDS instances
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle2 size={14} color="#34d399" /> Calculates monthly dollar savings
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle2 size={14} color="#34d399" /> Uncovers serverless migration paths
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
    '&:hover fieldset': { borderColor: '#38bdf8' },
    '&.Mui-focused fieldset': { borderColor: '#38bdf8' }
  },
  '& .MuiInputLabel-root': { color: '#94a3b8' },
  '& .MuiSvgIcon-root': { color: '#94a3b8' }
};
