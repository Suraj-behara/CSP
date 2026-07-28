import React, { useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { NewDeploymentForm } from './components/NewDeploymentForm';
import { ExistingDeploymentForm } from './components/ExistingDeploymentForm';
import { ProjectDetailView } from './components/ProjectDetailView';
import { submitWorkloadAnalysis } from './api/client';
import { runDecisionEngine } from './engine/decisionEngine';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1'
    },
    secondary: {
      main: '#a855f7'
    },
    background: {
      default: '#090d16',
      paper: '#0f172a'
    },
    text: {
      primary: '#f8fafc',
      secondary: '#94a3b8'
    }
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  }
});

export function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [activeProject, setActiveProject] = useState(null);
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [usedApi, setUsedApi] = useState(false);
  const [apiErrorDetail, setApiErrorDetail] = useState('');

  const handleRunNewDeployment = async (payload) => {
    setLoading(true);
    try {
      const { result, usedApi: apiFlag, errorDetail } = await submitWorkloadAnalysis(payload);
      setActiveProject(result);
      setUsedApi(apiFlag);
      setApiErrorDetail(errorDetail || '');
      setRecentProjects((prev) => [result, ...prev.filter((p) => p.id !== result.id)]);
      setCurrentTab('project-report');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunExistingReview = async (payload) => {
    setLoading(true);
    try {
      const { result, usedApi: apiFlag, errorDetail } = await submitWorkloadAnalysis(payload);
      setActiveProject(result);
      setUsedApi(apiFlag);
      setApiErrorDetail(errorDetail || '');
      setRecentProjects((prev) => [result, ...prev.filter((p) => p.id !== result.id)]);
      setCurrentTab('project-report');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSample = (sampleType) => {
    let payload;
    if (sampleType === 'serverless-ai') {
      payload = {
        projectTitle: 'Generative AI Customer Support Bot',
        projectDescription: 'Interactive customer support AI agent with natural language reasoning, HIPAA compliance, and medium volume traffic.',
        applicationType: 'AI Chatbot',
        needsAI: true,
        serverlessPreference: 'Yes',
        expectedTraffic: 'Medium (1,000–10,000 users or requests/day)',
        latencyRequirement: 'Low (100–300 ms)',
        monthlyBudget: '$500 – $2,000/month',
        targetRegion: 'US East (N. Virginia)',
        complianceRequirements: ['HIPAA', 'SOC 2'],
        optimizationGoal: 'Balanced (Cost + Performance) ⚖️'
      };
    } else if (sampleType === 'high-traffic-web') {
      payload = {
        projectTitle: 'High Traffic E-Commerce Platform',
        projectDescription: 'Global e-commerce checkout and product catalog with PCI DSS compliance and 100k+ daily users.',
        applicationType: 'Dynamic Web App',
        needsAI: false,
        serverlessPreference: 'Yes',
        expectedTraffic: 'Very High (More than 100,000 users or requests/day)',
        latencyRequirement: 'Very Low (50–100 ms)',
        monthlyBudget: '$2,000 – $10,000/month',
        targetRegion: 'US East (N. Virginia)',
        complianceRequirements: ['PCI DSS'],
        optimizationGoal: 'Minimize Cost 💰'
      };
    } else {
      payload = {
        projectTitle: 'Healthcare Data Pipeline & Analytics',
        projectDescription: 'Batch processing pipeline for sensitive EHR records requiring GDPR and HIPAA compliance.',
        applicationType: 'Data Analytics',
        needsAI: true,
        serverlessPreference: 'No Preference',
        expectedTraffic: 'Enterprise Scale (More than 1 million users or requests/day)',
        latencyRequirement: 'Flexible (> 1000 ms)',
        monthlyBudget: '$10,000 – $50,000/month',
        targetRegion: 'Ireland',
        complianceRequirements: ['GDPR', 'HIPAA'],
        optimizationGoal: 'Meet Compliance Requirements 🔒'
      };
    }

    const result = runDecisionEngine(payload);
    setActiveProject(result);
    setUsedApi(false);
    setApiErrorDetail('');
    setRecentProjects((prev) => [result, ...prev.filter((p) => p.id !== result.id)]);
    setCurrentTab('project-report');
  };

  const handleSelectProject = (proj) => {
    setActiveProject(proj);
    setCurrentTab('project-report');
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', backgroundColor: '#090d16', color: '#f8fafc', pb: 8 }}>
        <Header
          currentTab={currentTab}
          onTabChange={(tab) => setCurrentTab(tab)}
          hasActiveProject={!!activeProject}
        />

        {currentTab === 'dashboard' && (
          <Dashboard
            onStartNew={() => setCurrentTab('new-project')}
            onReviewExisting={() => setCurrentTab('existing-review')}
            onSelectProject={handleSelectProject}
            recentProjects={recentProjects}
            onLoadSample={handleLoadSample}
          />
        )}

        {currentTab === 'new-project' && (
          <NewDeploymentForm
            onSubmit={handleRunNewDeployment}
            onCancel={() => setCurrentTab('dashboard')}
            loading={loading}
          />
        )}

        {currentTab === 'existing-review' && (
          <ExistingDeploymentForm
            onSubmit={handleRunExistingReview}
            onCancel={() => setCurrentTab('dashboard')}
            loading={loading}
          />
        )}

        {currentTab === 'project-report' && activeProject && (
          <ProjectDetailView
            project={activeProject}
            onBack={() => setCurrentTab('dashboard')}
            usedApi={usedApi}
            apiErrorDetail={apiErrorDetail}
          />
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;
