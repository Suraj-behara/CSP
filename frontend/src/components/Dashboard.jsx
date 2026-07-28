import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Paper,
  Stack,
  Divider
} from '@mui/material';
import {
  PlusCircle,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingDown,
  Clock,
  Layers,
  CheckCircle2,
  BrainCircuit
} from 'lucide-react';

export const Dashboard = ({
  onStartNew,
  onReviewExisting,
  onSelectProject,
  recentProjects = [],
  onLoadSample
}) => {
  return (
    <Container maxWidth="xl" sx={{ py: 5 }}>
      {/* Hero Banner */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
          border: '1px solid rgba(129, 140, 248, 0.2)',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          mb: 5
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, rgba(0,0,0,0) 70%)',
            pointerEvents: 'none'
          }}
        />

        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={8}>
            <Chip
              icon={<BrainCircuit size={16} color="#a855f7" />}
              label="Cloud Decision Intelligence Platform"
              sx={{
                backgroundColor: 'rgba(168, 85, 247, 0.15)',
                color: '#c084fc',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                fontWeight: 700,
                fontSize: '0.8rem',
                mb: 2
              }}
            />

            <Typography
              variant="h3"
              fontWeight={900}
              sx={{
                color: '#f8fafc',
                letterSpacing: '-1px',
                lineHeight: 1.15,
                mb: 2,
                fontSize: { xs: '2rem', md: '2.75rem' }
              }}
            >
              Make the Right Cloud & AI Infrastructure Decisions <span style={{ background: 'linear-gradient(90deg, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Before Deploying.</span>
            </Typography>

            <Typography variant="body1" sx={{ color: '#94a3b8', fontSize: '1.1rem', mb: 4, maxWidth: 680 }}>
              CloudPilot (CloudCompass AI) evaluates multi-cloud deployment options across AWS, Azure, and Google Cloud based on real business constraints, traffic patterns, compliance, and budget.
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                variant="contained"
                size="large"
                startIcon={<PlusCircle size={20} />}
                onClick={onStartNew}
                sx={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '1rem',
                  py: 1.5,
                  px: 3.5,
                  borderRadius: 3,
                  boxShadow: '0 10px 25px rgba(99, 102, 241, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)'
                  }
                }}
              >
                Plan a New Deployment
              </Button>

              <Button
                variant="outlined"
                size="large"
                startIcon={<Search size={20} />}
                onClick={onReviewExisting}
                sx={{
                  color: '#f8fafc',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  fontWeight: 600,
                  fontSize: '1rem',
                  py: 1.5,
                  px: 3.5,
                  borderRadius: 3,
                  '&:hover': {
                    borderColor: '#818cf8',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)'
                  }
                }}
              >
                Review Existing Deployment
              </Button>
            </Stack>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                backgroundColor: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(12px)'
              }}
            >
              <Typography variant="subtitle2" sx={{ color: '#cbd5e1', fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Sparkles size={16} color="#818cf8" /> Why CloudPilot vs Old Tools?
              </Typography>
              <Stack spacing={1.5}>
                {[
                  { title: 'Pre-Deployment Reasoning', desc: 'Evaluates architecture suitability before provisioning' },
                  { title: 'Multi-Cloud Weighted Scoring', desc: 'AWS vs Azure vs GCP scored on 15 custom criteria' },
                  { title: 'Explainable AI Mentor', desc: 'Amazon Bedrock explains decisions & trade-offs' },
                  { title: 'Automated SAM / IaC Output', desc: 'Generates deployable template.yaml code instantly' }
                ].map((item, idx) => (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    <CheckCircle2 size={18} color="#34d399" style={{ marginTop: 2, flexShrink: 0 }} />
                    <Box>
                      <Typography variant="body2" fontWeight={600} sx={{ color: '#f8fafc' }}>
                        {item.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                        {item.desc}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      {/* Value Pillars Cards */}
      <Typography variant="h5" fontWeight={800} sx={{ color: '#f8fafc', mb: 3 }}>
        Key Decision Capabilities
      </Typography>

      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: 'rgba(30, 41, 59, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              height: '100%'
            }}
          >
            <Box sx={{ width: 44, height: 44, borderRadius: 2, backgroundColor: 'rgba(52, 211, 153, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <TrendingDown size={22} color="#34d399" />
            </Box>
            <Typography variant="h6" fontWeight={700} sx={{ color: '#f8fafc', mb: 1 }}>
              Cost Optimization
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              Identifies serverless vs EC2 vs GPU instance savings upfront before paying cloud bills.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: 'rgba(30, 41, 59, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              height: '100%'
            }}
          >
            <Box sx={{ width: 44, height: 44, borderRadius: 2, backgroundColor: 'rgba(99, 102, 241, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <Clock size={22} color="#818cf8" />
            </Box>
            <Typography variant="h6" fontWeight={700} sx={{ color: '#f8fafc', mb: 1 }}>
              Planning Speed
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              Reduces architectural research time from weeks to under 60 seconds with instant report outputs.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: 'rgba(30, 41, 59, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              height: '100%'
            }}
          >
            <Box sx={{ width: 44, height: 44, borderRadius: 2, backgroundColor: 'rgba(236, 72, 153, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <ShieldCheck size={22} color="#f472b6" />
            </Box>
            <Typography variant="h6" fontWeight={700} sx={{ color: '#f8fafc', mb: 1 }}>
              Compliance Assurance
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              Enforces HIPAA, GDPR, PCI DSS, ISO 27001, and SOC 2 guardrails directly in service placement.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: 'rgba(30, 41, 59, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              height: '100%'
            }}
          >
            <Box sx={{ width: 44, height: 44, borderRadius: 2, backgroundColor: 'rgba(56, 189, 248, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <Layers size={22} color="#38bdf8" />
            </Box>
            <Typography variant="h6" fontWeight={700} sx={{ color: '#f8fafc', mb: 1 }}>
              Multi-Cloud Scorecard
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              Unbiased mathematical evaluation of AWS, Azure, and GCP for your exact workload criteria.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Pre-built Workload Templates */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" fontWeight={800} sx={{ color: '#f8fafc' }}>
            Quick Sample Workloads
          </Typography>
          <Typography variant="caption" sx={{ color: '#94a3b8' }}>
            Click to run instant decision engine analysis
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                backgroundColor: '#1e293b',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 3,
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  borderColor: '#818cf8',
                  transform: 'translateY(-4px)'
                }
              }}
              onClick={() => onLoadSample('serverless-ai')}
            >
              <CardContent sx={{ p: 3 }}>
                <Chip label="AI Workload" size="small" sx={{ backgroundColor: 'rgba(168, 85, 247, 0.2)', color: '#c084fc', fontWeight: 700, mb: 1.5 }} />
                <Typography variant="h6" fontWeight={700} sx={{ color: '#f8fafc', mb: 1 }}>
                  Generative AI Customer Support Bot
                </Typography>
                <Typography variant="body2" sx={{ color: '#94a3b8', mb: 2 }}>
                  Medium traffic AI chatbot requiring low latency, serverless Bedrock LLM agent, and HIPAA compliance.
                </Typography>
                <Button size="small" endIcon={<ArrowRight size={16} />} sx={{ color: '#818cf8', fontWeight: 600, p: 0 }}>
                  Analyze Sample
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              sx={{
                backgroundColor: '#1e293b',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 3,
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  borderColor: '#38bdf8',
                  transform: 'translateY(-4px)'
                }
              }}
              onClick={() => onLoadSample('high-traffic-web')}
            >
              <CardContent sx={{ p: 3 }}>
                <Chip label="Web Application" size="small" sx={{ backgroundColor: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', fontWeight: 700, mb: 1.5 }} />
                <Typography variant="h6" fontWeight={700} sx={{ color: '#f8fafc', mb: 1 }}>
                  High Traffic E-Commerce Platform
                </Typography>
                <Typography variant="body2" sx={{ color: '#94a3b8', mb: 2 }}>
                  100k+ daily users dynamic web app needing sub-100ms response time, PCI DSS compliance, and auto-scaling.
                </Typography>
                <Button size="small" endIcon={<ArrowRight size={16} />} sx={{ color: '#38bdf8', fontWeight: 600, p: 0 }}>
                  Analyze Sample
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              sx={{
                backgroundColor: '#1e293b',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 3,
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  borderColor: '#34d399',
                  transform: 'translateY(-4px)'
                }
              }}
              onClick={() => onLoadSample('compliance-healthcare')}
            >
              <CardContent sx={{ p: 3 }}>
                <Chip label="Data Analytics" size="small" sx={{ backgroundColor: 'rgba(52, 211, 153, 0.2)', color: '#34d399', fontWeight: 700, mb: 1.5 }} />
                <Typography variant="h6" fontWeight={700} sx={{ color: '#f8fafc', mb: 1 }}>
                  Healthcare Data Pipeline & Analytics
                </Typography>
                <Typography variant="body2" sx={{ color: '#94a3b8', mb: 2 }}>
                  Enterprise batch data pipeline with strict GDPR & HIPAA constraints, high budget, and multi-region deployment.
                </Typography>
                <Button size="small" endIcon={<ArrowRight size={16} />} sx={{ color: '#34d399', fontWeight: 600, p: 0 }}>
                  Analyze Sample
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Recent Projects List */}
      {recentProjects.length > 0 && (
        <Box>
          <Typography variant="h5" fontWeight={800} sx={{ color: '#f8fafc', mb: 3 }}>
            Recent Decision Reports
          </Typography>
          <Grid container spacing={2}>
            {recentProjects.map((proj) => (
              <Grid item xs={12} sm={6} md={4} key={proj.id}>
                <Paper
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    backgroundColor: 'rgba(30, 41, 59, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: 'rgba(30, 41, 59, 0.9)', borderColor: '#818cf8' }
                  }}
                  onClick={() => onSelectProject(proj)}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#f8fafc' }}>
                      {proj.projectTitle}
                    </Typography>
                    <Chip
                      label={proj.multiCloud?.recommendedProvider}
                      size="small"
                      sx={{
                        backgroundColor:
                          proj.multiCloud?.recommendedProvider === 'AWS'
                            ? 'rgba(245, 158, 11, 0.2)'
                            : proj.multiCloud?.recommendedProvider === 'Azure'
                            ? 'rgba(56, 189, 248, 0.2)'
                            : 'rgba(52, 211, 153, 0.2)',
                        color:
                          proj.multiCloud?.recommendedProvider === 'AWS'
                            ? '#fbbf24'
                            : proj.multiCloud?.recommendedProvider === 'Azure'
                            ? '#38bdf8'
                            : '#34d399',
                        fontWeight: 700
                      }}
                    />
                  </Box>
                  <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 1.5 }}>
                    {proj.rawInput?.applicationType} • Score: {proj.report?.patternScore}/100
                  </Typography>
                  <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.06)', mb: 1.5 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ color: '#cbd5e1' }}>
                      Est: ${proj.report?.estimatedMonthlyCost}/mo
                    </Typography>
                    <Button size="small" endIcon={<ArrowRight size={14} />} sx={{ color: '#818cf8', p: 0 }}>
                      View Report
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
};
