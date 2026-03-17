import express from 'express';
import cors from 'cors';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer } from 'http';
import { TaskQueue } from './services/taskQueue';
import { ProjectManager } from './services/projectManager';
import { AGENTS } from './config/agents';
import { TaskStatus, OrchestratorEvent } from './types';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

app.use(cors({
  origin: ['https://officeai.testjostin.pro', 'http://localhost:5180'],
  credentials: true
}));
app.use(express.json());

const clients: Set<WebSocket> = new Set();

function broadcast(event: OrchestratorEvent): void {
  const message = JSON.stringify(event);
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const taskQueue = new TaskQueue(
  redisUrl,
  (taskId, status, result) => {
    broadcast({
      type: 'task_update',
      taskId,
      status,
      result,
      timestamp: Date.now()
    });
  },
  (agentId, status, currentTask) => {
    broadcast({
      type: 'agent_status',
      agentId,
      status: status as any,
      currentTask,
      timestamp: Date.now()
    });
  }
);

const projectManager = new ProjectManager(taskQueue);
const worker = taskQueue.startWorker();

wss.on('connection', (ws) => {
  console.log('Cliente WebSocket conectado');
  clients.add(ws);

  ws.send(JSON.stringify({
    type: 'init',
    agents: AGENTS,
    projects: projectManager.getAllProjects(),
    timestamp: Date.now()
  }));

  ws.on('close', () => {
    clients.delete(ws);
    console.log('Cliente WebSocket desconectado');
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/agents', (req, res) => {
  res.json(AGENTS);
});

app.get('/api/queue', async (req, res) => {
  const status = await taskQueue.getQueueStatus();
  res.json(status);
});

app.post('/api/projects', async (req, res) => {
  try {
    const { name, description, documentation } = req.body;
    const project = await projectManager.createProject({ name, description, documentation });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.get('/api/projects', (req, res) => {
  res.json(projectManager.getAllProjects());
});

app.get('/api/projects/:id', (req, res) => {
  const project = projectManager.getProject(req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Proyecto no encontrado' });
  }
  res.json(project);
});

app.post('/api/tasks', async (req, res) => {
  try {
    const task = await projectManager.createTask(req.body);
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.post('/api/tasks/:id/approve', async (req, res) => {
  try {
    const { approvedBy } = req.body;
    res.json({ message: 'Tarea aprobada', taskId: req.params.id, approvedBy });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

const PORT = parseInt(process.env.PORT || '3000', 10);

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 OfficeAI Orchestrator corriendo en puerto ${PORT}`);
  console.log(`📊 API: http://0.0.0.0:${PORT}`);
  console.log(`🔌 WebSocket: ws://0.0.0.0:${PORT}`);
});

process.on('SIGTERM', async () => {
  console.log('Cerrando servidor...');
  await worker.close();
  await taskQueue.close();
  server.close(() => {
    console.log('Servidor cerrado');
    process.exit(0);
  });
});
