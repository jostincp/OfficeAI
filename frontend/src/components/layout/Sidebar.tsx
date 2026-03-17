import { useOfficeStore } from "@/store/office-store";

interface AgentInfo {
  id: string;
  name: string;
  role: string;
  status: string;
  model: string;
  tasksCompleted: number;
}

const AGENT_MODELS: Record<string, string> = {
  'lead-001': 'Kimi K2.5',
  'backend-001': 'DeepSeek Coder',
  'frontend-001': 'DeepSeek Coder',
  'content-001': 'MiniMax M2.5',
  'qa-001': 'Kimi K2.5',
  'scheduler-001': 'Kimi K2.5',
};

const AGENT_ROLES: Record<string, string> = {
  'lead-001': 'Lead',
  'backend-001': 'Backend',
  'frontend-001': 'Frontend',
  'content-001': 'Content',
  'qa-001': 'QA',
  'scheduler-001': 'Scheduler',
};

export function Sidebar() {
  const agents = useOfficeStore((s) => s.agents);
  const selectedAgentId = useOfficeStore((s) => s.selectedAgentId);
  const selectAgent = useOfficeStore((s) => s.selectAgent);
  const collapsed = useOfficeStore((s) => s.sidebarCollapsed);

  if (collapsed) {
    return null;
  }

  const statusLabels: Record<string, string> = {
    idle: "Inactivo",
    working: "Trabajando",
    error: "Error",
    waiting_approval: "Esperando",
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'idle':
        return 'bg-gray-500';
      case 'working':
        return 'bg-green-500 animate-pulse';
      case 'error':
        return 'bg-red-500';
      case 'waiting_approval':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'idle':
        return 'text-gray-500';
      case 'working':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      case 'waiting_approval':
        return 'text-yellow-400';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <aside className="w-72 flex-shrink-0 border-r border-gray-800 bg-gray-900 flex flex-col h-full">
      <div className="border-b border-gray-800 p-4">
        <h2 className="text-sm font-semibold text-gray-300">Agentes</h2>
        <p className="text-xs text-gray-500 mt-1">{Object.keys(agents).length} activos</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {Object.values(agents).map((agent) => {
          const model = AGENT_MODELS[agent.id] || 'Unknown';
          const role = AGENT_ROLES[agent.id] || 'Agent';
          const tasksCompleted = agent.tasksCompleted || 0;
          
          return (
            <button
              key={agent.id}
              onClick={() => selectAgent(agent.id === selectedAgentId ? null : agent.id)}
              className={`w-full flex items-start gap-3 rounded-lg p-3 text-left transition-colors ${
                agent.id === selectedAgentId
                  ? "bg-gray-800 border border-gray-700"
                  : "hover:bg-gray-800/50 border border-transparent"
              }`}
            >
              {/* Indicador de estado */}
              <div className="mt-1">
                <div className={`h-3 w-3 rounded-full ${getStatusColor(agent.status)}`} />
              </div>
              
              {/* Info del agente */}
              <div className="flex-1 min-w-0">
                {/* Nombre y rol */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-200">{agent.name}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-gray-800 text-gray-400">
                    {role}
                  </span>
                </div>
                
                {/* Modelo de IA */}
                <div className="text-xs text-gray-500 mt-0.5">
                  {model}
                </div>
                
                {/* Estado y tareas */}
                <div className="flex items-center justify-between mt-1.5">
                  <span className={`text-xs ${getStatusTextColor(agent.status)}`}>
                    {statusLabels[agent.status] || agent.status}
                  </span>
                  <span className="text-xs text-gray-600">
                    {tasksCompleted} tareas
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
