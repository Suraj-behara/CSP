import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  CheckCircle2,
  DollarSign,
  Zap,
  Activity
} from 'lucide-react';

export const ArchitectureReportView = ({
  report,
  architecture,
  provider,
  projectTitle
}) => {
  if (!report || !architecture) return null;

  const services =
    provider === 'AWS'
      ? architecture.awsServices || []
      : provider === 'Azure'
      ? architecture.azureServices || []
      : architecture.gcpServices || [];

  return (
    <Box>
      {/* Top Banner */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 4,
          backgroundColor: '#0f172a',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          mb: 4
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, mb: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              <Chip
                label={`Diagnosis: ${report.engineeringDiagnosis}`}
                sx={{
                  backgroundColor:
                    report.engineeringDiagnosis === 'Well-Architected'
                      ? 'rgba(52, 211, 153, 0.2)'
                      : report.engineeringDiagnosis === 'Over-engineered'
                      ? 'rgba(245, 158, 11, 0.2)'
                      : 'rgba(239, 68, 68, 0.2)',
                  color:
                    report.engineeringDiagnosis === 'Well-Architected'
                      ? '#34d399'
                      : report.engineeringDiagnosis === 'Over-engineered'
                      ? '#fbbf24'
                      : '#fca5a5',
                  fontWeight: 700,
                  fontSize: '0.8rem'
                }}
              />
              <Chip label={`Pattern: ${architecture.patternName}`} sx={{ backgroundColor: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', fontWeight: 600, fontSize: '0.8rem' }} />
            </Box>
            <Typography variant="h4" fontWeight={800} sx={{ color: '#f8fafc' }}>
              Architecture Intelligence Report
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              Evaluates design pattern fit, over/under-engineering risks, complexity, cost efficiency, & growth readiness for {projectTitle}.
            </Typography>
          </Box>

          <Stack direction="row" spacing={2}>
            <MetricBadge title="Pattern Score" value={`${report.patternScore}/100`} color="#818cf8" />
            <MetricBadge title="Cloud Fit" value={`${report.cloudFitScore}/100`} color="#34d399" />
            <MetricBadge title="Est. Monthly" value={`$${report.estimatedMonthlyCost}`} color="#38bdf8" />
          </Stack>
        </Box>
      </Paper>

      {/* Main Grid */}
      <Grid container spacing={3}>
        {/* Left Column: Key Diagnostics */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, borderRadius: 3, backgroundColor: '#1e293b', border: '1px solid rgba(255, 255, 255, 0.08)', mb: 3 }}>
            <Typography variant="h6" fontWeight={700} sx={{ color: '#f8fafc', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Activity size={20} color="#38bdf8" /> Core Metrics & Diagnostics
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Box sx={{ p: 2, borderRadius: 2, backgroundColor: 'rgba(15, 23, 42, 0.6)', textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', fontWeight: 600 }}>Pattern Fit</Typography>
                  <Typography variant="h5" fontWeight={800} sx={{ color: '#818cf8', my: 0.5 }}>{report.patternScore}%</Typography>
                  <Typography variant="caption" sx={{ color: '#34d399' }}>Optimal</Typography>
                </Box>
              </Grid>

              <Grid item xs={6} sm={3}>
                <Box sx={{ p: 2, borderRadius: 2, backgroundColor: 'rgba(15, 23, 42, 0.6)', textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', fontWeight: 600 }}>Ops Complexity</Typography>
                  <Typography variant="h5" fontWeight={800} sx={{ color: '#34d399', my: 0.5 }}>{report.operationalComplexity}</Typography>
                  <Typography variant="caption" sx={{ color: '#94a3b8' }}>Fully Managed</Typography>
                </Box>
              </Grid>

              <Grid item xs={6} sm={3}>
                <Box sx={{ p: 2, borderRadius: 2, backgroundColor: 'rgba(15, 23, 42, 0.6)', textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', fontWeight: 600 }}>Monthly Cost</Typography>
                  <Typography variant="h5" fontWeight={800} sx={{ color: '#fbbf24', my: 0.5 }}>${report.estimatedMonthlyCost}</Typography>
                  <Typography variant="caption" sx={{ color: '#94a3b8' }}>Pay-per-use</Typography>
                </Box>
              </Grid>

              <Grid item xs={6} sm={3}>
                <Box sx={{ p: 2, borderRadius: 2, backgroundColor: 'rgba(15, 23, 42, 0.6)', textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', fontWeight: 600 }}>Future Growth</Typography>
                  <Typography variant="h5" fontWeight={800} sx={{ color: '#38bdf8', my: 0.5 }}>{report.futureGrowthOutlook}</Typography>
                  <Typography variant="caption" sx={{ color: '#34d399' }}>Auto-scales</Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Actionable Recommendations List */}
          <Paper sx={{ p: 3, borderRadius: 3, backgroundColor: '#1e293b', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <Typography variant="h6" fontWeight={700} sx={{ color: '#f8fafc', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Zap size={20} color="#fbbf24" /> Actionable Architectural Recommendations
            </Typography>
            <Typography variant="caption" sx={{ color: '#94a3b8', mb: 2, display: 'block' }}>
              Specific, cost-saving, and operational efficiency improvements tailored to your workload.
            </Typography>

            <List disablePadding>
              {(report.recommendations || []).map((rec, idx) => (
                <ListItem
                  key={idx}
                  sx={{
                    px: 2,
                    py: 1.5,
                    mb: 1.5,
                    borderRadius: 2,
                    backgroundColor: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.05)'
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircle2 size={20} color="#34d399" />
                  </ListItemIcon>
                  <ListItemText
                    primary={<Typography variant="body2" fontWeight={600} sx={{ color: '#f8fafc' }}>{rec}</Typography>}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Right Column: Estimated Monthly Cost Breakdown */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, borderRadius: 3, backgroundColor: '#1e293b', border: '1px solid rgba(255, 255, 255, 0.08)', height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight={700} sx={{ color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 1 }}>
                <DollarSign size={20} color="#34d399" /> Cost Breakdown ({provider})
              </Typography>
              <Chip label={`Est. Total: $${report.estimatedMonthlyCost}/mo`} sx={{ backgroundColor: 'rgba(52, 211, 153, 0.15)', color: '#34d399', fontWeight: 700 }} />
            </Box>

            <Stack spacing={2} sx={{ mb: 3 }}>
              {services.map((srv, idx) => (
                <Box
                  key={idx}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#f8fafc' }}>
                      {srv.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                      {srv.reason}
                    </Typography>
                  </Box>
                  <Typography variant="subtitle1" fontWeight={800} sx={{ color: '#fbbf24' }}>
                    ${srv.monthlyCost}/mo
                  </Typography>
                </Box>
              ))}
            </Stack>

            {report.potentialSavings > 0 && (
              <Box sx={{ p: 2, borderRadius: 2, backgroundColor: 'rgba(245, 158, 11, 0.12)', border: '1px dashed rgba(245, 158, 11, 0.4)' }}>
                <Typography variant="caption" fontWeight={700} sx={{ color: '#fbbf24', display: 'block', mb: 0.5 }}>
                  💡 Potential Cost Reduction Identified:
                </Typography>
                <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                  By implementing serverless migration recommendations, you can reduce monthly costs by up to <strong>${report.potentialSavings}/mo ({Math.round((report.potentialSavings / (report.estimatedMonthlyCost + report.potentialSavings)) * 100)}% savings)</strong>.
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

const MetricBadge = ({ title, value, color }) => (
  <Paper sx={{ p: 1.5, px: 2, borderRadius: 2.5, backgroundColor: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'center' }}>
    <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 700 }}>
      {title}
    </Typography>
    <Typography variant="subtitle1" fontWeight={800} sx={{ color }}>
      {value}
    </Typography>
  </Paper>
);
