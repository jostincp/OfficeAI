# OfficeAI - Documentación del Proyecto

## 📋 Índice
1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Tecnologías Utilizadas](#tecnologías-utilizadas)
4. [Estructura del Proyecto](#estructura-del-proyecto)
5. [Decisiones Técnicas Importantes](#decisiones-técnicas-importantes)
6. [Guía de Despliegue](#guía-de-despliegue)
7. [Roadmap](#roadmap)

---

## Resumen Ejecutivo

**OfficeAI** es una oficina virtual de agentes de IA que permite coordinar múltiples agentes especializados para ejecutar proyectos de software de forma automatizada.

### ¿Qué hace?
- Recibe documentación de proyectos mediante chat
- Un agente **Lead** analiza y crea un plan de trabajo
- Delega tareas a agentes especializados (Backend, Frontend, Content, QA)
- Los agentes ejecutan usando diferentes modelos de IA
- Muestra el estado de los agentes en tiempo real en una oficina virtual pixel-art

### Agentes Disponibles
| Agente | Modelo IA | Rol |
|--------|-----------|-----|
| Alex (Lead) | Kimi K2.5 | Coordina, analiza, delega |
| Sam (Backend) | DeepSeek Coder | APIs, infraestructura, scripts |
| Jordan (Frontend) | DeepSeek Coder | UI/UX, React, componentes |
| Olivia (Content) | MiniMax M2.5 | Marketing, redes, copy |
| Casey (QA) | Kimi K2.5 | Testing, seguridad, revisión |
| Taylor (Scheduler) | Kimi K2.5 | Gestión de tareas, priorización |

---

## Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENTE (Frontend)                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  React + TypeScript + Tailwind CSS + Canvas 2D          │   │
│  │  - Visualización pixel-art de la oficina                │   │
│  │  - Chat para crear proyectos                            │   │
│  │  - Panel de agentes y estado                            │   │
│  └─────────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS + WSS
┌────────────────────────────▼────────────────────────────────────┐
│                      CADDY (Reverse Proxy)                       │
│         TLS termination, routing, WebSocket support              │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                     SERVIDOR (Backend)                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  OfficeAI Orchestrator (Node.js + Express)              │   │
│  │  - API REST (/api/projects, /api/agents, /api/tasks)    │   │
│  │  - WebSocket para eventos en tiempo real                │   │
│  │  - Cola de tareas con BullMQ + Redis                    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  LLM Service                                            │   │
│  │  - DeepSeek API (código, scripts)                       │   │
│  │  - Moonshot API (Kimi - coordinación, QA)               │   │
│  │  - MiniMax API (contenido, marketing)                   │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tecnologías Utilizadas

### Frontend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| React | 18 | UI framework |
| TypeScript | 5.3 | Tipado estático |
| Vite | 6.x | Build tool |
| Tailwind CSS | 3.x | Estilos |
| Zustand | 4.x | State management |
| i18next | 23.x | Internacionalización |
| Canvas 2D API | Nativo | Renderizado pixel-art |

### Backend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Node.js | 22 LTS | Runtime |
| Express | 4.x | Web framework |
| TypeScript | 5.3 | Tipado estático |
| BullMQ | 5.x | Cola de tareas |
| Redis | 7.x | Message broker |
| WebSocket (ws) | 8.x | Comunicación real-time |
| Axios | 1.6.x | HTTP client |

### Infraestructura
| Tecnología | Propósito |
|------------|-----------|
| Docker + Docker Compose | Containerización |
| Caddy | Reverse proxy, TLS |
| Oracle Cloud VPS | Hosting |
| Cloudflare | DNS |

### Modelos de IA
| Proveedor | Modelo | Uso | Costo aprox. |
|-----------|--------|-----|--------------|
| DeepSeek | Coder V2 | Código, scripts | ~$0.50/1M tokens |
| Moonshot | Kimi K2.5 | Coordinación, QA | ~$2.00/1M tokens |
| MiniMax | M2.5 | Contenido, copy | ~$1.00/1M tokens |

---

## Estructura del Proyecto

```
/home/ubuntu/.openclaw/workspace/www/
├── officeai-orchestrator/          # Backend Node.js
│   ├── src/
│   │   ├── index.ts                # Servidor Express + WebSocket
│   │   ├── types.ts                # Tipos TypeScript
│   │   ├── config/
│   │   │   └── agents.ts           # Configuración de agentes
│   │   └── services/
│   │       ├── llm.ts              # Integración con APIs de IA
│   │       ├── taskQueue.ts        # BullMQ + Redis
│   │       └── projectManager.ts   # Gestión de proyectos
│   ├── docker-compose.yml          # Redis + Orchestrator
│   └── Dockerfile
│
├── OfficeAI-Frontend/              # Frontend React
│   ├── src/
│   │   ├── components/
│   │   │   ├── chat/               # Chat para crear proyectos
│   │   │   ├── layout/             # AppShell, Sidebar, TopBar
│   │   │   └── office-2d/          # Canvas pixel-art
│   │   ├── hooks/
│   │   │   └── useOrchestrator.ts  # WebSocket + API
│   │   ├── store/
│   │   │   ├── office-store.ts     # Estado de la oficina
│   │   │   └── chat-store.ts       # Estado del chat
│   │   ├── i18n/                   # Español únicamente
│   │   └── types/
│   │       └── orchestrator.ts     # Tipos del backend
│   └── docker-compose.yml
│
└── officeai-frontend-docker-compose.yml  # Docker para frontend
```

---

## Decisiones Técnicas Importantes

### 1. ¿Por qué NO usar OpenClaw como orquestador?

**Situación:** El proyecto `openclaw-office` (frontend visual) está diseñado para conectarse al **Gateway de OpenClaw**, que es un sistema de agentes diferente.

**Problemas identificados:**
- OpenClaw Gateway usa **un solo modelo por sesión** (no permite múltiples agentes con diferentes modelos)
- El protocolo de comunicación es específico de OpenClaw (device auth, challenges, etc.)
- No tiene cola de tareas nativa con priorización
- No permite asignar modelos diferentes por rol de agente

**Solución implementada:**
- Crear un **orquestador propio** desde cero
- Cada agente puede usar el modelo que mejor se adapte a su rol
- Cola de tareas con BullMQ para priorización y manejo de dependencias
- WebSocket simple para eventos en tiempo real

### 2. ¿Por qué usar múltiples modelos de IA?

| Rol | Modelo | Razón |
|-----|--------|-------|
| Backend | DeepSeek Coder | Mejor precio/rendimiento para código |
| Lead/QA | Kimi K2.5 | Excelente para razonamiento y análisis |
| Content | MiniMax M2.5 | Texto más natural, menos robótico |

**Beneficio:** Optimizar costos y calidad según la tarea.

### 3. ¿Por qué NO usar persistencia (todavía)?

**Decisión actual:** Los proyectos se almacenan en memoria (se pierden al reiniciar).

**Razón:** Facilitar pruebas rápidas durante desarrollo.

**Plan futuro:** Agregar PostgreSQL o Supabase para persistencia real.

### 4. ¿Por qué Canvas 2D en lugar de Phaser/Three.js?

| Opción | Pros | Contras |
|--------|------|---------|
| **Canvas 2D** (elegido) | Simple, ligero, control total | Menos features de animación |
| Phaser 3 | Animaciones, pathfinding, físicas | Overkill para MVP, más complejo |
| Three.js | 3D realista | Mucho más complejo, requiere assets 3D |

**Decisión:** Canvas 2D es suficiente para el MVP. Se pueden agregar animaciones frame-by-frame si se necesitan.

### 5. ¿Por qué español 100%?

**Requisito del proyecto:** Todo el código, UI y documentación debe estar en español.

**Implementación:**
- Eliminados todos los archivos de i18n en chino/inglés
- Creado `es/common.json` con traducciones
- Configurado i18next con español como único idioma

---

## Guía de Despliegue

### Requisitos
- VPS con Ubuntu 22.04+
- Docker y Docker Compose instalados
- Dominio apuntando al VPS
- API keys: DeepSeek, Moonshot (Kimi), MiniMax

### 1. Backend (Orchestrator)

```bash
cd /home/ubuntu/.openclaw/workspace/www/officeai-orchestrator

# Crear archivo .env
cat > .env << EOF
REDIS_URL=redis://redis:6379
DEEPSEEK_API_KEY=sk-tu-key
OPENROUTER_API_KEY=sk-tu-key
MINIMAX_API_KEY=sk-tu-key
PORT=3000
NODE_ENV=production
EOF

# Levantar
docker compose up -d
```

### 2. Frontend

```bash
cd /home/ubuntu/.openclaw/workspace/www/OfficeAI-Frontend

# Crear archivo .env.local
echo "VITE_ORCHESTRATOR_URL=https://officeai.tudominio.com" > .env.local

# Build y deploy
docker compose -f ../officeai-frontend-docker-compose.yml up --build -d
```

### 3. Caddy (Reverse Proxy)

```
officeai.tudominio.com {
    tls internal
    
    handle /api/* {
        reverse_proxy officeai-orchestrator:3000
    }
    
    handle /health {
        reverse_proxy officeai-orchestrator:3000
    }
    
    handle /ws {
        reverse_proxy officeai-orchestrator:3000
    }
    
    handle {
        reverse_proxy officeai-frontend:80
    }
}
```

---

## Roadmap

### MVP Actual (Completado)
- ✅ 6 agentes configurados con diferentes modelos
- ✅ Cola de tareas con BullMQ
- ✅ Frontend pixel-art básico
- ✅ Chat para crear proyectos
- ✅ WebSocket para eventos en tiempo real
- ✅ 100% en español

### Próximos Pasos
1. **Persistencia de datos** (PostgreSQL/Supabase)
2. **Human-in-the-loop** (aprobaciones antes de cambios críticos)
3. **Integraciones** (GitHub, Notion)
4. **Mejorar pixel-art** (animaciones, pathfinding, iluminación)
5. **Generación de videos** para YouTube
6. **SaaS** (multi-tenant, autenticación)

---

## Créditos y Referencias

### Inspiración
- **GNR Athenas Project** - Gonzalo Rocca (LinkedIn viral post)

### Assets Utilizados
- **pixel-agents** - Pablo Delucca (MIT License)
- **Metro City Character Pack** - JIK-A-4 (Itch.io)

### Tecnologías de Referencia
- **openclaw-office** - WW-AI-Lab (frontend base)
- **SkyOffice** - Kevin Shen (Phaser 3 multiplayer)
- **Star-Office-UI** - Ring Hyacinth (OpenClaw integration)

---

## Contacto y Soporte

**Proyecto:** OfficeAI  
**Autor:** Jostin  
**Repositorio:** https://github.com/jostincp/OfficeAI

---

*Última actualización: 2026-03-17*
