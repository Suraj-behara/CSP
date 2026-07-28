import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Stack
} from '@mui/material';
import {
  Server,
  Database,
  Brain,
  Globe,
  Lock,
  ArrowRight,
  Zap,
  Info,
  RefreshCw
} from 'lucide-react';

export const ArchitectureCanvas = ({
  nodes = [],
  links = [],
  provider,
  patternName
}) => {
  const [selectedNode, setSelectedNode] = useState(nodes[0] || null);

  const getNodeIcon = (type) => {
    switch (type) {
      case 'client':
        return <Globe size={20} color="#38bdf8" />;
      case 'gateway':
        return <Lock size={20} color="#fbbf24" />;
      case 'compute':
        return <Zap size={20} color="#818cf8" />;
      case 'database':
        return <Database size={20} color="#34d399" />;
      case 'ai':
        return <Brain size={20} color="#c084fc" />;
      case 'security':
      default:
        return <Server size={20} color="#f472b6" />;
    }
  };

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 4,
          backgroundColor: '#0f172a',
          border: '1px solid rgba(129, 140, 248, 0.2)',
          mb: 3
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Chip
              label="Stretch Feature 1 — Architecture Canvas"
              size="small"
              sx={{ backgroundColor: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', fontWeight: 700, mb: 1 }}
            />
            <Typography variant="h5" fontWeight={800} sx={{ color: '#f8fafc' }}>
              Visual Architecture Diagram & Topology
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              Interactive topology map for <strong>{patternName}</strong> on {provider}. Click any node to inspect data flow metrics & configuration.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              startIcon={<RefreshCw size={14} />}
              onClick={() => setSelectedNode(nodes[0])}
              sx={{ color: '#94a3b8', borderColor: 'rgba(255,255,255,0.1)', textTransform: 'none' }}
              variant="outlined"
            >
              Reset Canvas
            </Button>
          </Stack>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* Canvas Diagram Board */}
        <Grid item xs={12} lg={8}>
          <Paper
            sx={{
              p: 4,
              borderRadius: 3,
              backgroundColor: '#1e293b',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              minHeight: 450,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              position: 'relative',
              backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 0)',
              backgroundSize: '24px 24px'
            }}
          >
            <Stack direction="row" spacing={3} alignItems="center" justifyContent="center" sx={{ flexWrap: 'wrap', gap: 3 }}>
              {nodes.map((node, idx) => {
                const isSelected = selectedNode?.id === node.id;
                return (
                  <React.Fragment key={node.id}>
                    <Paper
                      elevation={isSelected ? 8 : 2}
                      onClick={() => setSelectedNode(node)}
                      sx={{
                        p: 2.5,
                        minWidth: 160,
                        maxWidth: 200,
                        borderRadius: 3,
                        backgroundColor: isSelected ? 'rgba(30, 41, 59, 0.95)' : 'rgba(15, 23, 42, 0.9)',
                        border: `2px solid ${isSelected ? '#818cf8' : 'rgba(255, 255, 255, 0.1)'}`,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease-in-out',
                        boxShadow: isSelected ? '0 0 25px rgba(129, 140, 248, 0.4)' : 'none',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          borderColor: '#818cf8'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: 2,
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {getNodeIcon(node.type)}
                        </Box>
                        <Chip label={node.estCost} size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700, backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }} />
                      </Box>

                      <Typography variant="subtitle2" fontWeight={800} sx={{ color: '#f8fafc', lineHeight: 1.2, mb: 0.5 }}>
                        {node.label}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#818cf8', fontWeight: 600, display: 'block', mb: 1 }}>
                        {node.service}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.7rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {node.description}
                      </Typography>
                    </Paper>

                    {idx < nodes.length - 1 && (
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography variant="caption" sx={{ color: '#818cf8', fontSize: '0.65rem', fontWeight: 700, mb: 0.5 }}>
                          {links[idx]?.protocol || 'HTTPS'}
                        </Typography>
                        <ArrowRight size={22} color="#818cf8" />
                      </Box>
                    )}
                  </React.Fragment>
                );
              })}
            </Stack>
          </Paper>
        </Grid>

        {/* Selected Node Details Inspector Panel */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, borderRadius: 3, backgroundColor: '#1e293b', border: '1px solid rgba(255, 255, 255, 0.08)', height: '100%' }}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#818cf8', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Info size={18} /> Component Inspector
            </Typography>

            {selectedNode ? (
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <Box sx={{ width: 42, height: 42, borderRadius: 2.5, backgroundColor: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {getNodeIcon(selectedNode.type)}
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight={800} sx={{ color: '#f8fafc' }}>
                      {selectedNode.label}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 700 }}>
                      {selectedNode.service} ({selectedNode.provider})
                    </Typography>
                  </Box>
                </Box>

                <Paper sx={{ p: 2, borderRadius: 2, backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.05)', mb: 2 }}>
                  <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', fontWeight: 600, mb: 0.5 }}>
                    Role & Responsibility:
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                    {selectedNode.description}
                  </Typography>
                </Paper>

                <Paper sx={{ p: 2, borderRadius: 2, backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', fontWeight: 600, mb: 0.5 }}>
                    Estimated Allocation Cost:
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={800} sx={{ color: '#fbbf24' }}>
                    {selectedNode.estCost}
                  </Typography>
                </Paper>
              </Box>
            ) : (
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                Select a node on the canvas to inspect component details.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
