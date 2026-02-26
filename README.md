# MDO Command Center — Backend API

[![Run on Replit](https://replit.com/badge/github/hugefisco94/mdo-api-server)](https://replit.com/github/hugefisco94/mdo-api-server)

Multi-Domain Operations (MDO) AI Orchestration Backend with OODA Loop State Machine.

**Frontend**: [hugefisco94.github.io/ai-orchestration-hub](https://hugefisco94.github.io/ai-orchestration-hub/)

## Architecture

- **OODA Loop**: Observe → Orient → Decide → Act state machine
- **MDO Domains**: Code, Orchestration, Data/Knowledge, Infrastructure, Intelligence
- **Agent Routing**: OODA-phase-aware agent selection
- **Cloud Proxy**: Elice Cloud + Harness.io integration

## Deploy on Replit

1. Import this repo on [Replit](https://replit.com)
2. Set environment variables (optional):
   - `HARNESS_PAT` — Harness.io Personal Access Token
   - `HARNESS_ACCOUNT` — Harness Account ID
   - `ELICE_URL` — Elice Cloud LiteLLM endpoint
3. Click **Run**

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/ooda/state` | Current OODA cycle state |
| POST | `/api/ooda/advance` | Advance to next OODA phase |
| POST | `/api/ooda/reset` | Reset OODA cycle |
| PUT | `/api/ooda/tempo` | Set tempo (strategic/operational/tactical) |
| GET | `/api/mdo/config` | MDO configuration |
| GET | `/api/mdo/domains` | Domain status |
| GET | `/api/missions` | List missions |
| POST | `/api/missions` | Create mission |
| GET | `/api/cloud/status` | Cloud connections |
| GET | `/api/swarm/models` | AI model swarm |
| POST | `/api/agents/route` | OODA-aware agent routing |
| POST | `/api/harness/trigger` | Trigger Harness pipeline |

## License

MIT
