import { useEffect, useRef, useState } from 'react';
import { eventBus } from '@/office/eventBus';

interface ActivityLogEntry {
  id: string;
  timestamp: Date;
  agentName: string;
  agentRole: string;
  action: string;
  details: string;
  type: 'status' | 'output' | 'error';
}

export function ActivityLog() {
  const [logs, setLogs] = useState<ActivityLogEntry[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Escuchar eventos de estado de agentes
    const handleAgentStatus = ({ agentId, status }: { agentId: string; status: string }) => {
      const agentNames: Record<string, string> = {
        'lead-001': 'Alex',
        'backend-001': 'Sam',
        'frontend-001': 'Jordan',
        'content-001': 'Olivia',
        'qa-001': 'Casey',
        'scheduler-001': 'Taylor',
      };
      
      const agentRoles: Record<string, string> = {
        'lead-001': 'Lead',
        'backend-001': 'Backend',
        'frontend-001': 'Frontend',
        'content-001': 'Content',
        'qa-001': 'QA',
        'scheduler-001': 'Scheduler',
      };

      const statusLabels: Record<string, string> = {
        'idle': 'inactivo',
        'working': 'trabajando',
        'waiting_approval': 'pensando',
        'error': 'en error',
      };

      const newLog: ActivityLogEntry = {
        id: Date.now().toString(),
        timestamp: new Date(),
        agentName: agentNames[agentId] || agentId,
        agentRole: agentRoles[agentId] || 'Agent',
        action: 'Cambio de estado',
        details: `Ahora está ${statusLabels[status] || status}`,
        type: status === 'error' ? 'error' : 'status',
      };

      setLogs(prev => [newLog, ...prev].slice(0, 50)); // Mantener últimos 50 logs
    };

    // Escuchar eventos de output de tareas
    const handleTaskOutput = ({ agentId, output }: { agentId: string; output: string }) => {
      const agentNames: Record<string, string> = {
        'lead-001': 'Alex',
        'backend-001': 'Sam',
        'frontend-001': 'Jordan',
        'content-001': 'Olivia',
        'qa-001': 'Casey',
        'scheduler-001': 'Taylor',
      };
      
      const agentRoles: Record<string, string> = {
        'lead-001': 'Lead',
        'backend-001': 'Backend',
        'frontend-001': 'Frontend',
        'content-001': 'Content',
        'qa-001': 'QA',
        'scheduler-001': 'Scheduler',
      };

      const newLog: ActivityLogEntry = {
        id: Date.now().toString(),
        timestamp: new Date(),
        agentName: agentNames[agentId] || agentId,
        agentRole: agentRoles[agentId] || 'Agent',
        action: 'Generó output',
        details: output.substring(0, 100) + (output.length > 100 ? '...' : ''),
        type: 'output',
      };

      setLogs(prev => [newLog, ...prev].slice(0, 50));
    };

    eventBus.on('agent_status_changed', handleAgentStatus);
    eventBus.on('agent_output', handleTaskOutput);

    return () => {
      eventBus.off('agent_status_changed', handleAgentStatus);
      eventBus.off('agent_output', handleTaskOutput);
    };
  }, []);

  // Auto-scroll al top cuando hay nuevos logs
  useEffect(() => {
    if (scrollRef.current && isOpen) {
      scrollRef.current.scrollTop = 0;
    }
  }, [logs, isOpen]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'text-red-400 border-red-800/50 bg-red-900/20';
      case 'output':
        return 'text-green-400 border-green-800/50 bg-green-900/20';
      default:
        return 'text-blue-400 border-blue-800/50 bg-blue-900/20';
    }
  };

  return (
    <>
      {/* Botón toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg border border-gray-700 shadow-lg transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <span className="text-sm font-medium">Activity Log</span>
        {logs.length > 0 && (
          <span className="ml-1 px-1.5 py-0.5 text-xs bg-[#4FD1C5] text-gray-900 rounded-full">
            {logs.length}
          </span>
        )}
      </button>

      {/* Panel desplegable */}
      {isOpen && (
        <div className="fixed bottom-16 right-4 z-50 w-96 max-h-96 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
            <h3 className="text-sm font-semibold text-gray-200">Registro de Actividad</h3>
            <button
              onClick={() => setLogs([])}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              Limpiar
            </button>
          </div>

          {/* Lista de logs */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-2 space-y-2 max-h-80"
          >
            {logs.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                No hay actividad registrada
              </div>
            ) : (
              logs.map((log) => (
                <div
                  key={log.id}
                  className={`p-3 rounded-lg border text-sm ${getTypeColor(log.type)}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">
                      {log.agentName} 
                      <span className="text-gray-500 text-xs ml-1">({log.agentRole})</span>
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatTime(log.timestamp)}
                    </span>
                  </div>
                  <div className="text-gray-300 font-medium mb-1">{log.action}</div>
                  <div className="text-gray-400 text-xs leading-relaxed">{log.details}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
}
