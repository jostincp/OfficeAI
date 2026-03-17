import { Queue, Worker, Job } from 'bullmq';
import { Redis } from 'ioredis';
import { Task, TaskResult, AgentRole, TaskStatus } from '../types';
import { LLMService } from './llm';
import { AGENTS } from '../config/agents';

export interface TaskData {
  taskId: string;
  projectId: string;
  title: string;
  description: string;
  assignedTo: AgentRole;
  context?: string;
  requiresApproval: boolean;
}

export class TaskQueue {
  private redis: Redis;
  private taskQueue: Queue<TaskData>;
  private llmService: LLMService;
  private onTaskUpdate: (taskId: string, status: TaskStatus, result?: TaskResult, agentId?: string) => void;
  private onAgentStatus: (agentId: string, status: string, taskId?: string) => void;

  constructor(
    redisUrl: string,
    onTaskUpdate: (taskId: string, status: TaskStatus, result?: TaskResult, agentId?: string) => void,
    onAgentStatus: (agentId: string, status: string, taskId?: string) => void
  ) {
    this.redis = new Redis(redisUrl, { maxRetriesPerRequest: null });
    this.taskQueue = new Queue<TaskData>('officeai-tasks', { 
      connection: this.redis as any 
    });
    this.llmService = new LLMService();
    this.onTaskUpdate = onTaskUpdate;
    this.onAgentStatus = onAgentStatus;
  }

  async addTask(task: Task): Promise<void> {
    const taskData: TaskData = {
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

  startWorker(): Worker<TaskData> {
    const worker = new Worker<TaskData>(
      'officeai-tasks',
      async (job) => this.processTask(job),
      { connection: this.redis as any }
    );

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

  private async processTask(job: Job<TaskData>): Promise<TaskResult> {
    const { taskId, assignedTo, title, description, context, requiresApproval } = job.data;
    
    const agent = AGENTS.find(a => a.role === assignedTo);
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

      const result: TaskResult = {
        output: response.content,
        tokensUsed: response.tokensUsed,
        cost: response.cost,
        duration
      };

      // Emitir evento de output para el Activity Log
      this.onAgentStatus(agent.id, 'output', taskId);
      
      this.onTaskUpdate(taskId, 'completed', result, agent.id);
      this.onAgentStatus(agent.id, 'idle');

      return result;
    } catch (error) {
      this.onAgentStatus(agent.id, 'error', taskId);
      throw error;
    }
  }

  private getPriority(role: AgentRole): number {
    const priorities: Record<AgentRole, number> = {
      lead: 100,
      scheduler: 90,
      qa: 70,
      backend: 60,
      frontend: 50,
      content: 40
    };
    return priorities[role] || 50;
  }

  async getQueueStatus(): Promise<{ waiting: number; active: number; completed: number; failed: number }> {
    const [waiting, active, completed, failed] = await Promise.all([
      this.taskQueue.getWaitingCount(),
      this.taskQueue.getActiveCount(),
      this.taskQueue.getCompletedCount(),
      this.taskQueue.getFailedCount()
    ]);

    return { waiting, active, completed, failed };
  }

  async close(): Promise<void> {
    await this.taskQueue.close();
    await this.redis.quit();
  }
}
