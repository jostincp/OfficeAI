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

| Rol | Modelo IA | API | Descripción |
|-----|-----------|-----|-------------|
| Lead | Kimi K2.5 | Moonshot | Analiza requerimientos y delega tareas |
| Backend | DeepSeek Coder | DeepSeek | APIs, bases de datos, lógica de negocio |
| Frontend | DeepSeek Coder | DeepSeek | Interfaces, React, CSS, componentes |
| Content | MiniMax M2.5 | MiniMax | Contenido escrito, blogs, guiones, copy |
| QA | Kimi K2.5 | Moonshot | Testing, seguridad, revisión de código |
| Scheduler | Kimi K2.5 | Moonshot | Organización de tareas y dependencias |

## 🔄 Flujo de Trabajo

1. **Usuario envía mensaje** al Lead
2. **Lead analiza** y genera plan en formato JSON
3. **Sistema crea tareas** automáticamente para cada agente
4. **Agentes procesan** sus tareas en paralelo
5. **Respuestas aparecen** en el chat

## 🔧 Configuración de APIs

### Moonshot (Kimi K2.5)
- **URL:** https://api.moonshot.ai/v1/chat/completions
- **Modelos:** `kimi-k2.5`, `kimi-k2-thinking`
- **Docs:** https://platform.moonshot.ai

### DeepSeek Coder
- **URL:** https://api.deepseek.com/v1/chat/completions
- **Modelo:** `deepseek-coder`
- **Docs:** https://platform.deepseek.com

### MiniMax M2.5
- **URL:** https://api.minimax.io/v1/text/chatcompletion_v2
- **Modelo:** `MiniMax-M2.5-highspeed`
- **Docs:** https://www.minimaxi.com

## 🎮 Mapa de Oficina (Tiled)

El mapa de la oficina se carga desde un archivo JSON editable:

```
frontend/public/assets/map/office-map.json
```

### Estructura del Mapa

| Capa | Tipo | Descripción |
|------|------|-------------|
| `Floor` | tilelayer | Piso de la oficina |
| `Walls` | tilelayer | Bordes y zócalos |
| `Agents` | objectgroup | Posiciones de los 6 agentes |

### Tileset

- **Archivo:** `frontend/public/assets/pixelart/Modern_Office_16x16.png`
- **Tamaño:** 16x16 píxeles por tile
- **Formato:** Tileset de LimeZu (Modern Office Revamped)

### Editar el Mapa

Puedes editar el JSON directamente o usar **Tiled Map Editor** (https://www.mapeditor.org/):

1. Abre `office-map.json` en Tiled
2. Edita las capas Floor, Walls y Agents
3. Guarda y exporta como JSON
4. El cambio se refleja automáticamente al recargar

## 🎨 Assets Pixel-Art

Los assets se encuentran en:

```
frontend/public/assets/pixelart/
├── Modern_Office_16x16.png       # Tileset principal
├── Modern_Office_32x32.png       # Tileset 32x32
├── Modern_Office_48x48.png       # Tileset 48x48
├── 1_Room_Builder_Office/        # Tiles base
├── 2_Modern_Office_Black_Shadow/ # Con sombras
├── 3_Modern_Office_Shadowless/   # Sin sombras
├── 4_Modern_Office_singles/      # Objetos individuales
├── CharacterGenerator/           # Generador de personajes
└── Modern tiles_Free/            # Tiles de interiores (free)
```

**Créditos:** LimeZu (https://limezu.itch.io/)

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
│   │   └── agents.ts          # Configuración de agentes y prompts
│   ├── services/
│   │   ├── llm.ts             # Servicio LLM (APIs directas)
│   │   ├── taskQueue.ts       # Cola de tareas con BullMQ
│   │   ├── projectManager.ts  # Gestión de proyectos
│   │   └── tiledMap.ts        # Carga de mapas Tiled
│   ├── types.ts               # Tipos TypeScript
│   └── index.ts               # Entry point + WebSocket
├── .env                       # Variables de entorno
└── Dockerfile
```

## 📁 Estructura del Frontend

```
frontend/
├── src/
│   ├── components/              # Componentes React
│   │   └── office-2d/
│   │       └── PhaserOffice.tsx # Escena Phaser principal
│   ├── hooks/
│   │   └── useWebSocket.ts      # Hook WebSocket
│   ├── store/
│   │   └── chat-store.ts        # Estado del chat
│   ├── config/
│   │   └── agents.ts            # Configuración de agentes
│   └── office/
│       ├── tiledMap.ts          # Sistema de mapas Tiled
│       ├── furniture.ts         # Muebles y objetos
│       └── eventBus.ts          # Eventos entre componentes
├── public/
│   └── assets/
│       ├── map/
│       │   └── office-map.json  # Mapa editable
│       ├── pixelart/            # Assets gráficos
│       └── characters/          # Sprites de agentes
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
docker network create officeai_officeai-network
```

### 4. Ejecutar contenedores
```bash
# Redis
docker run -d --name officeai-redis \
  --network officeai_officeai-network \
  redis:7-alpine

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

## 🙏 Créditos

- **Pixel-Art:** LimeZu (https://limezu.itch.io/)
- **Character Generator:** LimeZu Character Generator 2.0
- **Tilesets:** Modern Office Revamped, Modern Interiors
