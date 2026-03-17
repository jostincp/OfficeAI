export interface AgentConfig {
  id: string;
  name: string;
  role: string;
  model: string;
  status: 'idle' | 'working' | 'error' | 'waiting_approval';
  avatar: string;
}

export const AGENTS: AgentConfig[] = [
  {
    id: 'lead-001',
    name: 'Alex',
    role: 'Lead',
    model: 'kimi-k2.5',
    status: 'idle',
    avatar: '/avatars/lead.png'
  },
  {
    id: 'backend-001',
    name: 'Sam',
    role: 'Backend',
    model: 'deepseek-coder',
    status: 'idle',
    avatar: '/avatars/backend.png'
  },
  {
    id: 'frontend-001',
    name: 'Jordan',
    role: 'Frontend',
    model: 'deepseek-coder',
    status: 'idle',
    avatar: '/avatars/frontend.png'
  },
  {
    id: 'content-001',
    name: 'Olivia',
    role: 'Content',
    model: 'minimax-m2.5',
    status: 'idle',
    avatar: '/avatars/content.png'
  },
  {
    id: 'qa-001',
    name: 'Casey',
    role: 'QA',
    model: 'kimi-k2.5',
    status: 'idle',
    avatar: '/avatars/qa.png'
  },
  {
    id: 'scheduler-001',
    name: 'Taylor',
    role: 'Scheduler',
    model: 'kimi-k2.5',
    status: 'idle',
    avatar: '/avatars/scheduler.png'
  }
];
