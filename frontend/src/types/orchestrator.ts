export interface Agent {
  id: string;
  role: 'lead' | 'backend' | 'frontend' | 'content' | 'qa' | 'scheduler';
  name: string;
  model: string;
  status: 'idle' | 'working' | 'error' | 'waiting_approval';
  currentTask?: string;
  avatar?: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  assignedTo: Agent['role'];
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'waiting_approval';
  dependencies: string[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
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
  createdAt: string;
  updatedAt: string;
}

// Eventos WebSocket del orchestrator
export interface InitEvent {
  type: 'init';
  agents: Agent[];
  projects: Project[];
  timestamp: number;
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
  status: Task['status'];
  result?: TaskResult;
  timestamp: number;
}

export interface ProjectUpdateEvent {
  type: 'project_update';
  projectId: string;
  status: Project['status'];
  timestamp: number;
}

export type OrchestratorEvent = 
  | InitEvent 
  | AgentStatusEvent 
  | TaskUpdateEvent 
  | ProjectUpdateEvent;
