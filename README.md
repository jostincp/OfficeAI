# OfficeAI - Oficina Virtual de Agentes IA

Sistema multi-agente para coordinar agentes de IA especializados en proyectos de software.

## 🏗️ Arquitectura

```
OfficeAI/
├── frontend/          # React + TypeScript + Phaser 3
├── backend/           # Node.js + Express + BullMQ
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

### 2. Levantar todo

```bash
docker compose up -d
```

### 3. Acceder

- **Frontend:** http://localhost (o tu dominio)
- **API:** http://localhost/api
- **Health:** http://localhost/health

## 🤖 Agentes

| Agente | Rol | Modelo IA |
|--------|-----|-----------|
| Alex | Lead | Kimi K2.5 |
| Sam | Backend | DeepSeek Coder |
| Jordan | Frontend | DeepSeek Coder |
| Olivia | Content | MiniMax M2.5 |
| Casey | QA | Kimi K2.5 |
| Taylor | Scheduler | Kimi K2.5 |

## 🛠️ Desarrollo

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npm run dev
```

## 📝 Licencia

MIT - Jostin
