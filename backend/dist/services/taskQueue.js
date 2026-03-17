"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskQueue = void 0;
const bullmq_1 = require("bullmq");
const ioredis_1 = require("ioredis");
const llm_1 = require("./llm");
const agents_1 = require("../config/agents");
class TaskQueue {
    redis;
    taskQueue;
    llmService;
    onTaskUpdate;
    onAgentStatus;
    constructor(redisUrl, onTaskUpdate, onAgentStatus) {
        this.redis = new ioredis_1.Redis(redisUrl, { maxRetriesPerRequest: null });
        this.taskQueue = new bullmq_1.Queue('officeai-tasks', {
            connection: this.redis
        });
        this.llmService = new llm_1.LLMService();
        this.onTaskUpdate = onTaskUpdate;
        this.onAgentStatus = onAgentStatus;
    }
    async addTask(task) {
        const taskData = {
            taskId: task.id,
            projectId: task.projectId,
            title: task.title,
            description: task.description,
            assignedTo: task.assignedTo,
            requiresApproval: task.requiresApproval
        };
        await this.taskQueue.add(`task-${task.id}`, taskData, {
            priority: this.getPriority(task.assignedTo),
            attempts: 3,
            backoff: { type: 'exponential', delay: 5000 }
        });
    }
    startWorker() {
        const worker = new bullmq_1.Worker('officeai-tasks', async (job) => this.processTask(job), { connection: this.redis });
        worker.on('completed', (job) => {
            console.log(`✅ Tarea completada: ${job.data.taskId}`);
        });
        worker.on('failed', (job, err) => {
            console.error(`❌ Tarea fallida: ${job?.data.taskId}`, err);
            if (job) {
                this.onTaskUpdate(job.data.taskId, 'failed');
            }
        });
        return worker;
    }
    async processTask(job) {
        const { taskId, assignedTo, title, description, context, requiresApproval } = job.data;
        const agent = agents_1.AGENTS.find(a => a.role === assignedTo);
        if (!agent) {
            throw new Error(`Agente no encontrado para rol: ${assignedTo}`);
        }
        this.onAgentStatus(agent.id, 'working', taskId);
        this.onTaskUpdate(taskId, 'in_progress');
        const startTime = Date.now();
        try {
            if (requiresApproval) {
                this.onTaskUpdate(taskId, 'waiting_approval');
                this.onAgentStatus(agent.id, 'waiting_approval', taskId);
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
            const prompt = `Tarea: ${title}\n\nDescripción: ${description}`;
            const response = await this.llmService.generate(assignedTo, prompt, context);
            const duration = Date.now() - startTime;
            const result = {
                output: response.content,
                tokensUsed: response.tokensUsed,
                cost: response.cost,
                duration
            };
            this.onTaskUpdate(taskId, 'completed', result, agent.id);
            this.onAgentStatus(agent.id, 'idle');
            return result;
        }
        catch (error) {
            this.onAgentStatus(agent.id, 'error', taskId);
            throw error;
        }
    }
    getPriority(role) {
        const priorities = {
            lead: 100,
            scheduler: 90,
            qa: 70,
            backend: 60,
            frontend: 50,
            content: 40
        };
        return priorities[role] || 50;
    }
    async getQueueStatus() {
        const [waiting, active, completed, failed] = await Promise.all([
            this.taskQueue.getWaitingCount(),
            this.taskQueue.getActiveCount(),
            this.taskQueue.getCompletedCount(),
            this.taskQueue.getFailedCount()
        ]);
        return { waiting, active, completed, failed };
    }
    async close() {
        await this.taskQueue.close();
        await this.redis.quit();
    }
}
exports.TaskQueue = TaskQueue;
//# sourceMappingURL=taskQueue.js.map