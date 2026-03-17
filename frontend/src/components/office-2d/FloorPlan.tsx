import { useOfficeStore } from "@/store/office-store";

const AGENT_COLORS: Record<string, string> = {
  'lead-001': '#4FD1C5',
  'backend-001': '#63B3ED',
  'frontend-001': '#F6AD55',
  'content-001': '#F687B3',
  'qa-001': '#A3BFFA',
  'scheduler-001': '#9AE6B4',
};

export function FloorPlan() {
  const agents = useOfficeStore((s) => s.agents);
  const agentList = Object.values(agents);

  return (
    <div className="relative h-full w-full bg-[#0a0a0a] overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="grid grid-cols-3 gap-8 p-8">
          {agentList.map((agent, index) => {
            const row = Math.floor(index / 3);
            const col = index % 3;
            const x = 100 + col * 200;
            const y = 100 + row * 150;
            
            return (
              <div
                key={agent.id}
                className="relative flex flex-col items-center"
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                }}
              >
                {/* Escritorio */}
                <div className="w-32 h-20 bg-gray-800 rounded-lg border-2 border-gray-700 relative">
                  {/* Monitor */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-10 bg-gray-900 rounded border border-gray-600">
                    <div className={`absolute inset-1 rounded ${agent.status === 'working' ? 'animate-pulse bg-green-500/20' : 'bg-gray-800'}`} />
                  </div>
                </div>
                
                {/* Agente */}
                <div 
                  className="absolute -top-8 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shadow-lg transition-all"
                  style={{ 
                    backgroundColor: AGENT_COLORS[agent.id] || '#666',
                    boxShadow: agent.status === 'working' ? `0 0 20px ${AGENT_COLORS[agent.id]}` : 'none',
                  }}
                >
                  {agent.name.charAt(0)}
                </div>
                
                {/* Nombre y estado */}
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-center">
                  <div className="text-sm font-medium text-gray-300 whitespace-nowrap">{agent.name}</div>
                  <div className={`text-xs ${
                    agent.status === 'working' ? 'text-green-400' : 
                    agent.status === 'error' ? 'text-red-400' : 
                    'text-gray-500'
                  }`}>
                    {agent.status === 'idle' ? 'Inactivo' :
                     agent.status === 'working' ? 'Trabajando' :
                     agent.status === 'error' ? 'Error' :
                     agent.status === 'waiting_approval' ? 'Esperando' :
                     agent.status}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
