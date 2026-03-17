# OfficeAI - Oficina Virtual de Agentes IA

Sistema multi-agente para coordinar agentes de IA especializados en proyectos de software.

## 🏗️ Arquitectura

```
OfficeAI/
├── frontend/          # React + TypeScript + Phaser 3
├── backend/           # Node.js + Express + BullMQ + WebSocket
└── docker-compose.yml # Orquestación completa
```

## 🚀 Quick Start

### Requisitos
- Docker + Docker Compose
- API Keys: DeepSeek, Moonshot (Kimi), MiniMax

### 1. Clonar y configurar

```bash
git clone https://github.com/jostincp/OfficeAI.git
cd OfficeAI

# Configurar backend
cp backend/.env.example backend/.env
# Editar backend/.env con tus API keys
```

### 2. Variables de Entorno

Edita `backend/.env`:

```env
# Redis
REDIS_URL=redis://redis:6379

# APIs de Modelos de IA (APIs Oficiales)
DEEPSEEK_API_KEY=sk-tu-deepseek-key
MINIMAX_API_KEY=sk-api-tu-minimax-key
MOONSHOT_API_KEY=sk-tu-moonshot-key

# Servidor
PORT=3000
NODE_ENV=production

# URLs (para CORS)
FRONTEND_URL=https://officeai.tudominio.com
```

**Nota:** Las APIs se conectan directamente a los proveedores oficiales, no mediante intermediarios.

### 3. Levantar todo

```bash
docker compose up -d
```

### 4. Acceder

- **Frontend:** http://localhost (o tu dominio)
- **API:** http://localhost/api
- **Health:** http://localhost/health
- **WebSocket:** ws://localhost/ws

## 🤖 Agentes

| Agente | Rol | Modelo IA | API |
|--------|-----|-----------|-----|
| Alex | Lead | Kimi K2.5 | Moonshot (api.moonshot.ai) |
| Sam | Backend | DeepSeek Coder | DeepSeek (api.deepseek.com) |
| Jordan | Frontend | DeepSeek Coder | DeepSeek (api.deepseek.com) |
| Olivia | Content | MiniMax M2.5 | MiniMax (api.minimax.chat) |
| Casey | QA | Kimi K2.5 | Moonshot (api.moonshot.ai) |
| Taylor | Scheduler | Kimi K2.5 | Moonshot (api.moonshot.ai) |

## 🔧 Configuración de APIs

### Moonshot (Kimi K2.5)
- **URL:** https://api.moonshot.ai/v1/chat/completions
- **Modelo:** `kimi-k2.5`
- **Docs:** https://platform.moonshot.ai

### DeepSeek Coder
- **URL:** https://api.deepseek.com/v1/chat/completions
- **Modelo:** `deepseek-coder`
- **Docs:** https://platform.deepseek.com

### MiniMax M2.5
- **URL:** https://api.minimax.chat/v1/text/chatcompletion_v2
- **Modelo:** `MiniMax-M2.5`
- **Docs:** https://www.minimaxi.com

## 🛠️ Desarrollo

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Build para producción:
```bash
npm run build
docker build -t officeai-frontend:latest .
```

### Backend
```bash
cd backend
npm install
npm run dev
```

Build para producción:
```bash
npm run build
docker build -t backend-orchestrator:latest .
```

## 📁 Estructura del Backend

```
backend/
├── src/
│   ├── config/
│   │   └── agents.ts          # Configuración de agentes
│   ├── services/
│   │   ├── llm.ts             # Servicio LLM (APIs directas)
│   │   ├── taskQueue.ts       # Cola de tareas con BullMQ
│   │   └── projectManager.ts  # Gestión de proyectos
│   ├── types.ts               # Tipos TypeScript
│   └── index.ts               # Entry point + WebSocket
├── .env                       # Variables de entorno
└── Dockerfile
```

## 📁 Estructura del Frontend

```
frontend/
├── src/
│   ├── components/            # Componentes React
│   ├── hooks/
│   │   └── useWebSocket.ts    # Hook WebSocket
│   ├── store/
│   │   └── chat-store.ts      # Estado del chat
│   ├── config/
│   │   └── agents.ts          # Configuración de agentes
│   └── scenes/                # Escenas Phaser
├── dist/                      # Build de producción
└── Dockerfile
```

## 🔌 WebSocket Events

### Cliente → Servidor
- `CREATE_TASK` - Crear nueva tarea para un agente

### Servidor → Cliente
- `init` - Inicialización con lista de agentes
- `agent_status` - Cambio de estado de un agente
- `task_update` - Actualización de tarea
- `agent_output` - Respuesta generada por un agente

## 🐳 Deploy en VPS

### 1. Clonar y configurar
```bash
git clone https://github.com/jostincp/OfficeAI.git
cd OfficeAI/backend
cp .env.example .env
# Editar .env con tus API keys
```

### 2. Build imágenes
```bash
# Backend
cd backend
docker build -t backend-orchestrator:latest .

# Frontend
cd ../frontend
npm install
npm run build
docker build -t officeai-frontend:latest .
```

### 3. Crear red Docker (si no existe)
```bash
docker network create core_web-network
```

### 4. Ejecutar contenedores
```bash
# Redis (si no está corriendo)
docker run -d --name officeai-redis --network officeai_officeai-network redis:7-alpine

# Backend
docker run -d --name officeai-backend \
  --network officeai_officeai-network \
  -p 3000:3000 \
  --env-file /path/to/.env \
  backend-orchestrator:latest

# Conectar backend a red de Caddy
docker network connect core_web-network officeai-backend

# Frontend
docker run -d --name officeai-frontend \
  --network core_web-network \
  officeai-frontend:latest
```

## 📝 Licencia

MIT - Jostin
