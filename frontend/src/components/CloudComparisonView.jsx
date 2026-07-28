import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  LinearProgress,
  Stack
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Award, Sparkles, CheckCircle2, Layers } from 'lucide-react';

export const CloudComparisonView = ({ data, projectTitle }) => {
  if (!data) return null;

  const chartData = (data.scoreBreakdown || []).map((item) => ({
    category: item.category,
    AWS: item.awsScore,
    Azure: item.azureScore,
    GCP: item.gcpScore
  }));

  return (
    <Box>
      {/* Header Banner */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 4,
          backgroundColor: '#0f172a',
          border: '1px solid rgba(129, 140, 248, 0.2)',
          mb: 4
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, mb: 2 }}>
          <Box>
            <Chip
              icon={<Award size={16} color="#fbbf24" />}
              label={`Winning Recommendation: ${data.recommendedProvider}`}
              sx={{
                backgroundColor: 'rgba(245, 158, 11, 0.15)',
                color: '#fbbf24',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                fontWeight: 700,
                fontSize: '0.85rem',
                mb: 1.5
              }}
            />
            <Typography variant="h4" fontWeight={800} sx={{ color: '#f8fafc' }}>
              Multi-Cloud Decision Scorecard
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              Weighted multi-criteria analysis for {projectTitle} across AWS, Microsoft Azure, & Google Cloud Platform.
            </Typography>
          </Box>

          {/* Quick Score Badges */}
          <Stack direction="row" spacing={2}>
            <ScoreBadge provider="AWS" score={data.awsTotal} isWinner={data.recommendedProvider === 'AWS'} />
            <ScoreBadge provider="Azure" score={data.azureTotal} isWinner={data.recommendedProvider === 'Azure'} />
            <ScoreBadge provider="GCP" score={data.gcpTotal} isWinner={data.recommendedProvider === 'GCP'} />
          </Stack>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* Visual Chart */}
        <Grid item xs={12} lg={7}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: '#1e293b',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              height: '100%'
            }}
          >
            <Typography variant="h6" fontWeight={700} sx={{ color: '#f8fafc', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Layers size={20} color="#818cf8" /> Score Comparison by Category
            </Typography>
            <Typography variant="caption" sx={{ color: '#94a3b8', mb: 3, display: 'block' }}>
              Scores normalized out of 100 based on your business, AI, budget, and compliance requirements.
            </Typography>

            <Box sx={{ width: '100%', height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 20 }}>
                  <XAxis dataKey="category" stroke="#94a3b8" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" />
                  <YAxis stroke="#94a3b8" domain={[0, 100]} />
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '10px' }} />
                  <Bar dataKey="AWS" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Azure" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="GCP" fill="#34d399" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* AI Explanation Card */}
        <Grid item xs={12} lg={5}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <Box>
              <Chip
                icon={<Sparkles size={16} color="#c084fc" />}
                label="Bedrock Decision Reasoning"
                sx={{ backgroundColor: 'rgba(168, 85, 247, 0.2)', color: '#c084fc', fontWeight: 700, mb: 2 }}
              />
              <Typography variant="h6" fontWeight={800} sx={{ color: '#f8fafc', mb: 2 }}>
                Why {data.recommendedProvider} is the Optimal Choice
              </Typography>
              <Typography variant="body2" sx={{ color: '#cbd5e1', lineHeight: 1.7, mb: 3 }}>
                {data.aiExplanation}
              </Typography>
            </Box>

            <Box sx={{ p: 2, borderRadius: 2, backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px border rgba(255, 255, 255, 0.05)' }}>
              <Typography variant="caption" sx={{ color: '#818cf8', fontWeight: 700, display: 'block', mb: 1 }}>
                Decision Graph Rules Evaluated:
              </Typography>
              <Stack spacing={1}>
                {(data.scoreBreakdown || []).slice(0, 3).map((item, idx) => (
                  <Typography key={idx} variant="caption" sx={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircle2 size={14} color="#34d399" /> {item.category}: {item.reasoning}
                  </Typography>
                ))}
              </Stack>
            </Box>
          </Paper>
        </Grid>

        {/* Detailed Category Cards */}
        <Grid item xs={12}>
          <Typography variant="h6" fontWeight={800} sx={{ color: '#f8fafc', mt: 3, mb: 2 }}>
            Detailed Multi-Cloud Score Breakdown
          </Typography>
          <Grid container spacing={2}>
            {(data.scoreBreakdown || []).map((cat, idx) => (
              <Grid item xs={12} md={6} key={idx}>
                <Paper sx={{ p: 2.5, borderRadius: 3, backgroundColor: '#1e293b', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#f8fafc' }}>
                      {cat.category}
                    </Typography>
                    <Chip label={`Weight: ${cat.weight}%`} size="small" sx={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', color: '#94a3b8', fontSize: '0.7rem' }} />
                  </Box>

                  <Grid container spacing={2} sx={{ mb: 1.5 }}>
                    <Grid item xs={4}>
                      <Typography variant="caption" sx={{ color: '#f59e0b', fontWeight: 700 }}>AWS: {cat.awsScore}</Typography>
                      <LinearProgress variant="determinate" value={cat.awsScore} sx={{ height: 6, borderRadius: 3, backgroundColor: 'rgba(245, 158, 11, 0.2)', '& .MuiLinearProgress-bar': { backgroundColor: '#f59e0b' } }} />
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 700 }}>Azure: {cat.azureScore}</Typography>
                      <LinearProgress variant="determinate" value={cat.azureScore} sx={{ height: 6, borderRadius: 3, backgroundColor: 'rgba(56, 189, 248, 0.2)', '& .MuiLinearProgress-bar': { backgroundColor: '#38bdf8' } }} />
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="caption" sx={{ color: '#34d399', fontWeight: 700 }}>GCP: {cat.gcpScore}</Typography>
                      <LinearProgress variant="determinate" value={cat.gcpScore} sx={{ height: 6, borderRadius: 3, backgroundColor: 'rgba(52, 211, 153, 0.2)', '& .MuiLinearProgress-bar': { backgroundColor: '#34d399' } }} />
                    </Grid>
                  </Grid>

                  <Typography variant="caption" sx={{ color: '#94a3b8', fontStyle: 'italic' }}>
                    {cat.reasoning}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

const ScoreBadge = ({ provider, score, isWinner }) => (
  <Paper
    sx={{
      px: 2.5,
      py: 1.5,
      borderRadius: 3,
      backgroundColor: isWinner ? 'rgba(245, 158, 11, 0.15)' : 'rgba(30, 41, 59, 0.6)',
      border: `1px solid ${isWinner ? '#f59e0b' : 'rgba(255,255,255,0.1)'}`,
      textAlign: 'center',
      minWidth: 90
    }}
  >
    <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', textTransform: 'uppercase', fontWeight: 700, fontSize: '0.65rem' }}>
      {provider}
    </Typography>
    <Typography variant="h5" fontWeight={900} sx={{ color: isWinner ? '#fbbf24' : '#f8fafc' }}>
      {score}
    </Typography>
  </Paper>
);
