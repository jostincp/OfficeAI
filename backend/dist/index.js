"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const ws_1 = require("ws");
const http_1 = require("http");
const taskQueue_1 = require("./services/taskQueue");
const projectManager_1 = require("./services/projectManager");
const agents_1 = require("./config/agents");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const wss = new ws_1.WebSocketServer({ server });
app.use((0, cors_1.default)({
    origin: ['https://officeai.testjostin.pro', 'http://localhost:5180'],
    credentials: true
}));
app.use(express_1.default.json());
const clients = new Set();
function broadcast(event) {
    const message = JSON.stringify(event);
    clients.forEach(client => {
        if (client.readyState === ws_1.WebSocket.OPEN) {
            client.send(message);
        }
    });
}
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const taskQueue = new taskQueue_1.TaskQueue(redisUrl, (taskId, status, result) => {
    broadcast({
        type: 'task_update',
        taskId,
        status,
        result,
        timestamp: Date.now()
    });
}, (agentId, status, currentTask) => {
    broadcast({
        type: 'agent_status',
        agentId,
        status: status,
        currentTask,
        timestamp: Date.now()
    });
});
const projectManager = new projectManager_1.ProjectManager(taskQueue);
const worker = taskQueue.startWorker();
wss.on('connection', (ws) => {
    console.log('Cliente WebSocket conectado');
    clients.add(ws);
    ws.send(JSON.stringify({
        type: 'init',
        agents: agents_1.AGENTS,
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
    res.json(agents_1.AGENTS);
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
    }
    catch (error) {
        res.status(500).json({ error: error.message });
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
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.post('/api/tasks/:id/approve', async (req, res) => {
    try {
        const { approvedBy } = req.body;
        res.json({ message: 'Tarea aprobada', taskId: req.params.id, approvedBy });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
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
//# sourceMappingURL=index.js.map