/**
 * MDO Command Center — Backend API Server
 * OODA Loop State Machine + Multi-Domain Agent Routing + Cloud Proxy
 * Deploy target: Replit / any Node.js host
 */
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ─── OODA State Machine ─────────────────────────────────────────────
const OODA_PHASES = ['observe', 'orient', 'decide', 'act'];
const oodaState = {
  currentPhase: 'observe',
  cycleCount: 0,
  startedAt: new Date().toISOString(),
  tempo: 'operational',
  history: [],
  domains: {
    code:           { status: 'active', agents: ['executor', 'build-fixer', 'test-engineer'], load: 0 },
    orchestration:  { status: 'active', agents: ['architect', 'planner', 'analyst', 'critic'], load: 0 },
    data_knowledge: { status: 'active', agents: ['scientist', 'document-specialist', 'explore'], load: 0 },
    infrastructure: { status: 'active', agents: ['devops', 'dagu', 'docker'], load: 0 },
    intelligence:   { status: 'active', agents: ['security-reviewer', 'debugger', 'qa-tester'], load: 0 }
  },
  missions: []
};

// ─── MDO Domain Config ───────────────────────────────────────────────
const mdoConfig = {
  version: '2.0.0',
  doctrine: 'multi-domain-operations',
  taskForces: {
    alpha_feature:   { commander: 'architect',         agents: ['planner','executor','test-engineer','verifier'], mission: 'deliberate_attack' },
    bravo_incident:  { commander: 'debugger',           agents: ['explore','build-fixer','executor','qa-tester'], mission: 'hasty_defense' },
    charlie_knowledge:{ commander: 'scientist',         agents: ['document-specialist','explore','writer'],       mission: 'intelligence_prep' },
    delta_security:  { commander: 'security-reviewer',  agents: ['debugger','qa-tester','code-reviewer'],         mission: 'area_defense' },
    echo_platform:   { commander: 'build-fixer',        agents: ['executor','verifier'],                          mission: 'stability_ops' }
  },
  crossDomainSynergy: {
    code_to_data: 'Store patterns after implementation',
    data_to_code: 'Enrich context with RAG before coding',
    intel_to_code: 'Security scan triggers vulnerability fix',
    orch_to_infra: 'Scale decisions trigger resource allocation',
    infra_to_orch: 'Health status adjusts operational tempo'
  }
};

// ─── Cloud Connections State ─────────────────────────────────────────
const cloudState = {
  elice:   { status: 'unknown', url: process.env.ELICE_URL   || 'http://localhost:8100', lastCheck: null },
  harness: { status: 'unknown', url: 'https://app.harness.io', lastCheck: null },
  replit:  { status: 'active',  url: process.env.REPLIT_URL   || 'https://replit.com',    lastCheck: new Date().toISOString() },
  github:  { status: 'active',  url: 'https://github.com/hugefisco94', lastCheck: new Date().toISOString() }
};

// ─── Swarm Models ────────────────────────────────────────────────────
const swarmModels = {
  t1_fast: [
    { id: 'swarm/gemini-flash',       provider: 'Google',    latency: '3s',  status: 'active' },
    { id: 'swarm/gemini3-flash',      provider: 'Google',    latency: '3s',  status: 'active' },
    { id: 'openrouter/qwen3-coder',   provider: 'Alibaba',   latency: '5s',  status: 'active' },
    { id: 'openrouter/mistral-small', provider: 'Mistral',   latency: '9s',  status: 'active' },
    { id: 'openrouter/minimax-m2.5',  provider: 'MiniMax',   latency: '10s', status: 'active' }
  ],
  t2_power: [
    { id: 'swarm/deepseek-v3',        provider: 'DeepSeek',  latency: '5s',  status: 'active' },
    { id: 'openrouter/gemini-3-pro',  provider: 'Google',    latency: '7s',  status: 'active' },
    { id: 'openrouter/claude-haiku',  provider: 'Anthropic',  latency: '5s',  status: 'active' },
    { id: 'swarm/qwen3-235b-free',   provider: 'Alibaba',   latency: '14s', status: 'active' }
  ],
  t3_deep: [
    { id: 'openrouter/deepseek-r1',   provider: 'DeepSeek',  latency: '21s', status: 'active' }
  ]
};

// ═══ API ROUTES ══════════════════════════════════════════════════════

// Health
app.get('/api/health', (_, res) => res.json({
  status: 'operational',
  service: 'MDO Command Center API',
  version: '2.0.0',
  uptime: process.uptime(),
  timestamp: new Date().toISOString()
}));

// ─── OODA Endpoints ──────────────────────────────────────────────────
app.get('/api/ooda/state', (_, res) => res.json(oodaState));

app.post('/api/ooda/advance', (req, res) => {
  const currentIdx = OODA_PHASES.indexOf(oodaState.currentPhase);
  const nextIdx = (currentIdx + 1) % OODA_PHASES.length;
  const prevPhase = oodaState.currentPhase;

  oodaState.history.push({
    phase: prevPhase,
    completedAt: new Date().toISOString(),
    data: req.body.data || null
  });

  if (nextIdx === 0) oodaState.cycleCount++;
  oodaState.currentPhase = OODA_PHASES[nextIdx];

  res.json({
    previousPhase: prevPhase,
    currentPhase: oodaState.currentPhase,
    cycleCount: oodaState.cycleCount,
    timestamp: new Date().toISOString()
  });
});

app.post('/api/ooda/reset', (_, res) => {
  oodaState.currentPhase = 'observe';
  oodaState.cycleCount = 0;
  oodaState.history = [];
  oodaState.startedAt = new Date().toISOString();
  res.json({ status: 'reset', state: oodaState });
});

app.put('/api/ooda/tempo', (req, res) => {
  const valid = ['strategic', 'operational', 'tactical'];
  if (valid.includes(req.body.tempo)) {
    oodaState.tempo = req.body.tempo;
    res.json({ tempo: oodaState.tempo });
  } else {
    res.status(400).json({ error: `Invalid tempo. Use: ${valid.join(', ')}` });
  }
});

// ─── MDO Domain Endpoints ────────────────────────────────────────────
app.get('/api/mdo/config', (_, res) => res.json(mdoConfig));

app.get('/api/mdo/domains', (_, res) => res.json(oodaState.domains));

app.put('/api/mdo/domains/:domain', (req, res) => {
  const d = oodaState.domains[req.params.domain];
  if (!d) return res.status(404).json({ error: 'Domain not found' });
  Object.assign(d, req.body);
  res.json({ domain: req.params.domain, ...d });
});

app.get('/api/mdo/synergy', (_, res) => res.json(mdoConfig.crossDomainSynergy));

// ─── Task Force / Mission Endpoints ──────────────────────────────────
app.get('/api/missions', (_, res) => res.json(oodaState.missions));

app.post('/api/missions', (req, res) => {
  const mission = {
    id: `mission-${Date.now()}`,
    taskForce: req.body.taskForce || 'alpha_feature',
    intent: req.body.intent || '',
    status: 'planning',
    oodaPhase: 'observe',
    createdAt: new Date().toISOString(),
    domains: req.body.domains || ['code'],
    agents: mdoConfig.taskForces[req.body.taskForce || 'alpha_feature']?.agents || []
  };
  oodaState.missions.push(mission);
  res.status(201).json(mission);
});

app.put('/api/missions/:id', (req, res) => {
  const m = oodaState.missions.find(x => x.id === req.params.id);
  if (!m) return res.status(404).json({ error: 'Mission not found' });
  Object.assign(m, req.body);
  res.json(m);
});

// ─── Cloud / Swarm Endpoints ─────────────────────────────────────────
app.get('/api/cloud/status', (_, res) => res.json(cloudState));

app.get('/api/swarm/models', (_, res) => res.json(swarmModels));

app.get('/api/swarm/models/:tier', (req, res) => {
  const tier = swarmModels[req.params.tier];
  if (!tier) return res.status(404).json({ error: 'Tier not found. Use: t1_fast, t2_power, t3_deep' });
  res.json(tier);
});

// ─── Agent Routing ───────────────────────────────────────────────────
app.post('/api/agents/route', (req, res) => {
  const { task, complexity, domain } = req.body;
  let agent, model;

  // OODA-based routing
  switch (oodaState.currentPhase) {
    case 'observe': agent = 'explore';   model = 'haiku';  break;
    case 'orient':  agent = 'analyst';   model = 'opus';   break;
    case 'decide':  agent = 'planner';   model = 'opus';   break;
    case 'act':     agent = 'executor';  model = 'sonnet'; break;
  }

  // Complexity override
  if (complexity === 'high') model = 'opus';
  if (complexity === 'low')  model = 'haiku';

  // Domain override
  if (domain === 'intelligence') agent = 'security-reviewer';
  if (domain === 'infrastructure') agent = 'build-fixer';

  res.json({
    agent,
    model,
    oodaPhase: oodaState.currentPhase,
    domain: domain || 'code',
    task: task || 'unspecified',
    timestamp: new Date().toISOString()
  });
});

// ─── Harness Pipeline Proxy ──────────────────────────────────────────
app.post('/api/harness/trigger', async (req, res) => {
  const pipelineId = req.body.pipelineId || 'deploy_ai_orchestration_hub';
  const harnessPAT = process.env.HARNESS_PAT || '';

  if (!harnessPAT) {
    return res.json({
      status: 'simulated',
      message: 'Harness PAT not configured — returning simulated response',
      pipelineId,
      executionId: `sim-${Date.now()}`
    });
  }

  try {
    const resp = await fetch(
      `https://app.harness.io/gateway/pipeline/api/pipeline/execute/${pipelineId}/v2?accountIdentifier=${process.env.HARNESS_ACCOUNT || ''}&orgIdentifier=default&projectIdentifier=default_project`,
      {
        method: 'POST',
        headers: { 'x-api-key': harnessPAT, 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      }
    );
    const data = await resp.json();
    res.json({ status: 'triggered', data });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// ─── Static info ─────────────────────────────────────────────────────
app.get('/api/info', (_, res) => res.json({
  name: 'MDO Command Center',
  version: '2.0.0',
  architecture: 'OODA Loop + Multi-Domain Operations',
  platforms: ['web', 'android-pwa', 'desktop'],
  deployment: {
    frontend: 'GitHub Pages (hugefisco94.github.io/ai-orchestration-hub)',
    backend: 'Replit',
    cicd: 'Harness.io',
    cloud: 'Elice Cloud (A100 GPU)'
  },
  github: 'https://github.com/hugefisco94/ai-orchestration-hub',
  harness: 'https://app.harness.io'
}));

// ═══ START SERVER ════════════════════════════════════════════════════
app.listen(PORT, () => {
  console.log(`\n  ╔══════════════════════════════════════════════╗`);
  console.log(`  ║  MDO Command Center API — v2.0.0             ║`);
  console.log(`  ║  OODA Loop + Multi-Domain Operations         ║`);
  console.log(`  ║  Port: ${PORT}                                  ║`);
  console.log(`  ║  ${new Date().toISOString()}       ║`);
  console.log(`  ╚══════════════════════════════════════════════╝\n`);
});
