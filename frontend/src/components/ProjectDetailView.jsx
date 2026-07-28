import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Tabs,
  Tab,
  Typography,
  Button,
  Chip,
  Stack,
  Alert
} from '@mui/material';
import {
  Compass,
  Layers,
  Activity,
  FileCode,
  Bot,
  ArrowLeft,
  Download
} from 'lucide-react';
import { CloudComparisonView } from './CloudComparisonView';
import { ArchitectureReportView } from './ArchitectureReportView';
import { ArchitectureCanvas } from './ArchitectureCanvas';
import { DeploymentGenerator } from './DeploymentGenerator';
import { AIMentorChat } from './AIMentorChat';

export const ProjectDetailView = ({
  project,
  onBack,
  usedApi,
  apiErrorDetail
}) => {
  const [activeTab, setActiveTab] = useState(0);

  if (!project) return null;

  const handleExportSummary = () => {
    const text = `CloudPilot Decision Intelligence Summary:
Project: ${project.projectTitle}
Recommended Cloud: ${project.multiCloud?.recommendedProvider} (Score: ${project.multiCloud?.awsTotal}/100)
Pattern: ${project.architecture?.patternName}
Diagnosis: ${project.report?.engineeringDiagnosis}
Estimated Cost: $${project.report?.estimatedMonthlyCost}/mo
Potential Savings: $${project.report?.potentialSavings}/mo

Recommendations:
${(project.report?.recommendations || []).map((r) => `- ${r}`).join('\n')}
`;
    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${(project.projectTitle || 'project').toLowerCase().replace(/[^a-z0-9]/g, '-')}-summary.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Navigation Top Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowLeft size={18} />}
          onClick={onBack}
          sx={{ color: '#94a3b8', textTransform: 'none', '&:hover': { color: '#f8fafc' } }}
        >
          Back to Dashboard
        </Button>

        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Download size={16} />}
            onClick={handleExportSummary}
            sx={{ color: '#818cf8', borderColor: 'rgba(129, 140, 248, 0.3)', textTransform: 'none', borderRadius: 2 }}
          >
            Export Summary
          </Button>
        </Stack>
      </Box>

      {/* Network / Execution Source Status Notification */}
      {apiErrorDetail && (
        <Alert severity="warning" sx={{ mb: 3, backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
          {apiErrorDetail}
        </Alert>
      )}

      {/* Project Title Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 4,
          backgroundColor: '#0f172a',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          mb: 3
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              <Chip
                label={project.isExistingReview ? 'Existing Workload Review' : 'New Workload Architecture'}
                size="small"
                sx={{ backgroundColor: project.isExistingReview ? 'rgba(56, 189, 248, 0.15)' : 'rgba(99, 102, 241, 0.15)', color: project.isExistingReview ? '#38bdf8' : '#818cf8', fontWeight: 700 }}
              />
              <Chip
                label={`Evaluated: ${new Date(project.timestamp || Date.now()).toLocaleTimeString()}`}
                size="small"
                sx={{ backgroundColor: 'rgba(255,255,255,0.06)', color: '#94a3b8' }}
              />
            </Box>
            <Typography variant="h4" fontWeight={800} sx={{ color: '#f8fafc' }}>
              {project.projectTitle}
            </Typography>
          </Box>

          <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
            <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
              Winning Provider
            </Typography>
            <Typography variant="h5" fontWeight={900} sx={{ color: '#fbbf24' }}>
              {project.multiCloud?.recommendedProvider} (Score: {project.multiCloud?.awsTotal}/100)
            </Typography>
          </Box>
        </Box>

        {/* Tabs Bar */}
        <Box sx={{ mt: 3, borderTop: '1px solid rgba(255, 255, 255, 0.08)', pt: 1 }}>
          <Tabs
            value={activeTab}
            onChange={(_, val) => setActiveTab(val)}
            textColor="secondary"
            indicatorColor="secondary"
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                color: '#94a3b8',
                fontWeight: 700,
                textTransform: 'none',
                fontSize: '0.95rem',
                minHeight: 48,
                px: 3,
                '&.Mui-selected': { color: '#818cf8' }
              },
              '& .MuiTabs-indicator': { backgroundColor: '#818cf8', height: 3 }
            }}
          >
            <Tab icon={<Layers size={18} />} iconPosition="start" label="Multi-Cloud Decision Scorecard" />
            <Tab icon={<Activity size={18} />} iconPosition="start" label="Architecture Intelligence Report" />
            <Tab icon={<Compass size={18} />} iconPosition="start" label="Canvas Topology" />
            <Tab icon={<FileCode size={18} />} iconPosition="start" label="IaC & Terraform Generator" />
            <Tab icon={<Bot size={18} />} iconPosition="start" label="Bedrock Cloud Mentor" />
          </Tabs>
        </Box>
      </Paper>

      {/* Tab Panels */}
      <Box sx={{ mt: 2 }}>
        {activeTab === 0 && <CloudComparisonView data={project.multiCloud} projectTitle={project.projectTitle} />}
        {activeTab === 1 && (
          <ArchitectureReportView
            report={project.report}
            architecture={project.architecture}
            provider={project.multiCloud?.recommendedProvider}
            projectTitle={project.projectTitle}
          />
        )}
        {activeTab === 2 && (
          <ArchitectureCanvas
            nodes={project.visualNodes}
            links={project.visualLinks}
            provider={project.multiCloud?.recommendedProvider}
            patternName={project.architecture?.patternName}
          />
        )}
        {activeTab === 3 && (
          <DeploymentGenerator
            samTemplate={project.samTemplate}
            terraformTemplate={project.terraformTemplate}
            projectTitle={project.projectTitle}
          />
        )}
        {activeTab === 4 && <AIMentorChat contextResult={project} />}
      </Box>
    </Container>
  );
};
