import { Worker } from 'bullmq';
import { Task, TaskResult, AgentRole, TaskStatus } from '../types';
export interface TaskData {
    taskId: string;
    projectId: string;
    title: string;
    description: string;
    assignedTo: AgentRole;
    context?: string;
    requiresApproval: boolean;
}
export declare class TaskQueue {
    private redis;
    private taskQueue;
    private llmService;
    private onTaskUpdate;
    private onAgentStatus;
    constructor(redisUrl: string, onTaskUpdate: (taskId: string, status: TaskStatus, result?: TaskResult, agentId?: string) => void, onAgentStatus: (agentId: string, status: string, taskId?: string) => void);
    addTask(task: Task): Promise<void>;
    startWorker(): Worker<TaskData>;
    private processTask;
    private getPriority;
    getQueueStatus(): Promise<{
        waiting: number;
        active: number;
        completed: number;
        failed: number;
    }>;
    close(): Promise<void>;
}
//# sourceMappingURL=taskQueue.d.ts.map