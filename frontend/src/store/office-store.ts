import { create } from "zustand";

type AgentStatus = 'idle' | 'working' | 'error' | 'waiting_approval';

interface Agent {
  id: string;
  name: string;
  status: AgentStatus;
  position: { x: number; y: number };
  currentTask?: string;
  confirmed: boolean;
  tasksCompleted?: number;
}

type ViewMode = "2d" | "3d";
type ThemeMode = "light" | "dark";

interface OfficeState {
  agents: Record<string, Agent>;
  viewMode: ViewMode;
  theme: ThemeMode;
  sidebarCollapsed: boolean;
  connectionStatus: "connected" | "disconnected" | "connecting";
  selectedAgentId: string | null;
  
  // Actions
  setAgents: (agents: Array<{ id: string; name: string; status: string; currentTask?: string }>) => void;
  setViewMode: (mode: ViewMode) => void;
  setTheme: (theme: ThemeMode) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setConnectionStatus: (status: OfficeState["connectionStatus"]) => void;
  selectAgent: (id: string | null) => void;
  toggleSidebar: () => void;
}

const initialAgents: Agent[] = [
  { id: 'lead-001', name: 'Alex', status: 'idle', position: { x: 100, y: 100 }, confirmed: true, tasksCompleted: 0 },
  { id: 'backend-001', name: 'Sam', status: 'idle', position: { x: 200, y: 100 }, confirmed: true, tasksCompleted: 0 },
  { id: 'frontend-001', name: 'Jordan', status: 'idle', position: { x: 300, y: 100 }, confirmed: true, tasksCompleted: 0 },
  { id: 'content-001', name: 'Olivia', status: 'idle', position: { x: 400, y: 100 }, confirmed: true, tasksCompleted: 0 },
  { id: 'qa-001', name: 'Casey', status: 'idle', position: { x: 500, y: 100 }, confirmed: true, tasksCompleted: 0 },
  { id: 'scheduler-001', name: 'Taylor', status: 'idle', position: { x: 600, y: 100 }, confirmed: true, tasksCompleted: 0 },
];

const initialAgentsRecord: Record<string, Agent> = {};
initialAgents.forEach(a => {
  initialAgentsRecord[a.id] = a;
});

export const useOfficeStore = create<OfficeState>((set) => ({
  agents: initialAgentsRecord,
  viewMode: "2d",
  theme: "dark",
  sidebarCollapsed: false,
  connectionStatus: "connecting",
  selectedAgentId: null,

  setAgents: (agents) => {
    set((state) => {
      const newAgents = { ...state.agents };
      agents.forEach((agentData) => {
        if (newAgents[agentData.id]) {
          newAgents[agentData.id] = {
            ...newAgents[agentData.id],
            status: agentData.status as AgentStatus,
            currentTask: agentData.currentTask,
          };
        } else {
          newAgents[agentData.id] = {
            id: agentData.id,
            name: agentData.name,
            status: agentData.status as AgentStatus,
            position: { x: 100 + Math.random() * 500, y: 100 + Math.random() * 300 },
            confirmed: true,
          };
        }
      });
      return { agents: newAgents };
    });
  },

  setViewMode: (mode) => set({ viewMode: mode }),
  setTheme: (theme) => set({ theme }),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setConnectionStatus: (status) => set({ connectionStatus: status }),
  selectAgent: (id) => set({ selectedAgentId: id }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
}));
