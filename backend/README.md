# OfficeAI Orchestrator

Orquestador multi-agente para coordinar agentes de IA especializados.

## Estructura

```
officeai-orchestrator/
├── src/
│   ├── index.ts              # Servidor Express + WebSocket
│   ├── types.ts              # Tipos TypeScript
│   ├── config/
│   │   └── agents.ts         # Configuración de 6 agentes
│   └── services/
│       ├── llm.ts            # Servicio de LLMs
│       ├── taskQueue.ts      # Cola BullMQ + Worker
│       └── projectManager.ts # Gestión de proyectos
├── package.json
├── tsconfig.json
└── .env.example
```

## Agentes

| Agente | Modelo | Rol |
|--------|--------|-----|
| Alex (Lead) | Qwen 2.5 Max | Recibe tareas, clasifica, delega |
| Sam (Backend) | DeepSeek Coder | Código, APIs, infraestructura |
| Jordan (Frontend) | DeepSeek Coder | UI/UX, componentes, estilos |
| Olivia (Content) | MiniMax M2.5 | Blogs, copy, redes sociales |
| Casey (QA) | Kimi K2.5 | Revisión, testing, seguridad |
| Taylor (Scheduler) | Qwen 2.5 Max | Gestión de dependencias |

## Setup

```bash
npm install
cp .env.example .env
# Editar .env con tus API keys
npm run dev
```

## API

- `POST /api/projects` - Crear proyecto
- `GET /api/projects` - Listar proyectos
- `GET /api/projects/:id` - Ver proyecto
- `POST /api/tasks` - Crear tarea
- `GET /api/agents` - Estado de agentes
- `WS /` - WebSocket para eventos en tiempo real
