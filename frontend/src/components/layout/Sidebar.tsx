import { useOfficeStore } from "@/store/office-store";

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

  const statusColors: Record<string, string> = {
    idle: "bg-gray-500",
    working: "bg-green-500",
    error: "bg-red-500",
    waiting_approval: "bg-yellow-500",
  };

  return (
    <aside className="w-64 flex-shrink-0 border-r border-gray-800 bg-gray-900 flex flex-col h-full">
      <div className="border-b border-gray-800 p-4">
        <h2 className="text-sm font-semibold text-gray-300">Agentes</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {Object.values(agents).map((agent) => (
          <button
            key={agent.id}
            onClick={() => selectAgent(agent.id === selectedAgentId ? null : agent.id)}
            className={`w-full flex items-center gap-3 rounded-lg p-2 text-left transition-colors ${
              agent.id === selectedAgentId
                ? "bg-gray-800"
                : "hover:bg-gray-800/50"
            }`}
          >
            <div className={`h-2 w-2 rounded-full ${statusColors[agent.status] || "bg-gray-500"}`} />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-200 truncate">{agent.name}</div>
              <div className="text-xs text-gray-500">{statusLabels[agent.status] || agent.status}</div>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}
