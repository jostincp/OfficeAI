import { z } from 'zod';

export const AgentRole = z.enum([
  'lead',
  'backend',
  'frontend',
  'content',
  'qa',
  'scheduler'
]);

export type AgentRole = z.infer<typeof AgentRole>;

export interface Agent {
  id: string;
  role: AgentRole;
  name: string;
  model: string;
  status: 'idle' | 'working' | 'error' | 'waiting_approval';
  currentTask?: string;
  avatar?: string;
}

export const TaskStatus = z.enum([
  'pending',
  'in_progress',
  'completed',
  'failed',
  'waiting_approval'
]);

export type TaskStatus = z.infer<typeof TaskStatus>;

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  assignedTo: AgentRole;
  status: TaskStatus;
  dependencies: string[];
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  result?: TaskResult;
  requiresApproval: boolean;
  approvedBy?: string;
}

export interface TaskResult {
  output: string;
  artifacts?: string[];
  tokensUsed: number;
  cost: number;
  duration: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  documentation: string;
  status: 'planning' | 'in_progress' | 'completed' | 'failed';
  tasks: Task[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProjectRequest {
  name: string;
  description: string;
  documentation: string;
}

export interface CreateTaskRequest {
  projectId: string;
  title: string;
  description: string;
  assignedTo: AgentRole;
  dependencies?: string[];
  requiresApproval?: boolean;
}

export interface AgentStatusEvent {
  type: 'agent_status';
  agentId: string;
  status: Agent['status'];
  currentTask?: string;
  timestamp: number;
}

export interface TaskUpdateEvent {
  type: 'task_update';
  taskId: string;
  status: TaskStatus;
  agentId?: string;
  result?: TaskResult;
  timestamp: number;
}

export interface ProjectUpdateEvent {
  type: 'project_update';
  projectId: string;
  status: Project['status'];
  timestamp: number;
}

export interface ProjectCreatedEvent {
  type: 'project_created';
  projectId: string;
  agentId: string;
  timestamp: number;
}

export type OrchestratorEvent = 
  | AgentStatusEvent 
  | TaskUpdateEvent 
  | ProjectUpdateEvent
  | ProjectCreatedEvent;
