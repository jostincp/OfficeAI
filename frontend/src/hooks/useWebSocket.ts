import { useEffect, useRef, useState, useCallback } from 'react';
import { useChatStore } from '@/store/chat-store';
import { useOfficeStore } from '@/store/office-store';
import { AGENTS } from '@/config/agents';
import { eventBus } from '@/office/eventBus';

const WS_URL = 'wss://officeai.testjostin.pro/ws';

export type AgentStatus = 'idle' | 'working' | 'error' | 'waiting_approval';

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: AgentStatus;
  currentTask?: string;
}

export interface AgentEvent {
  type: 'AGENT_THINKING' | 'AGENT_IDLE' | 'AGENT_WORKING' | 'AGENT_ERROR' | 'init' | 'agent_status' | 'task_update' | 'agent_output';
  agentId?: string;
  taskId?: string;
  status?: AgentStatus;
  output?: string;
  agents?: Agent[];
  timestamp?: number;
}

export function useWebSocket() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<AgentEvent | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const setWebSocket = useChatStore((s) => s.setWebSocket);
  const addAgentResponse = useChatStore((s) => s.addAgentResponse);
  const updateAgentStatus = useOfficeStore((s) => s.updateAgentStatus);
  const incrementAgentTasks = useOfficeStore((s) => s.incrementAgentTasks);

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;
      setWebSocket(ws);

      ws.onopen = () => {
        console.log('✅ WebSocket conectado');
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const data: AgentEvent = JSON.parse(event.data);
          setLastEvent(data);

          switch (data.type) {
            case 'init':
              if (data.agents) {
                setAgents(data.agents);
              }
              break;
            case 'agent_status':
              if (data.agentId && data.status) {
                // Actualizar en el store de office
                updateAgentStatus(data.agentId, data.status);
                
                // Emitir evento para Phaser
                eventBus.emit('agent_status_changed', {
                  agentId: data.agentId,
                  status: data.status
                });
                
                setAgents(prev => 
                  prev.map(agent => 
                    agent.id === data.agentId 
                      ? { ...agent, status: data.status! }
                      : agent
                  )
                );
              }
              break;
            case 'task_update':
              // Cuando una tarea se completa, incrementar el contador
              if (data.status === 'completed' && data.taskId) {
                // Encontrar qué agente completó la tarea
                const agentId = data.agentId; // Necesitamos que el backend envíe esto
                if (agentId) {
                  incrementAgentTasks(agentId);
                }
              }
              break;
            case 'AGENT_THINKING':
              if (data.agentId) {
                updateAgentStatus(data.agentId, 'waiting_approval');
                setAgents(prev => 
                  prev.map(agent => 
                    agent.id === data.agentId 
                      ? { ...agent, status: 'waiting_approval' }
                      : agent
                  )
                );
              }
              break;
            case 'AGENT_WORKING':
              if (data.agentId) {
                updateAgentStatus(data.agentId, 'working');
                setAgents(prev => 
                  prev.map(agent => 
                    agent.id === data.agentId 
                      ? { ...agent, status: 'working' }
                      : agent
                  )
                );
              }
              break;
            case 'AGENT_IDLE':
              if (data.agentId) {
                updateAgentStatus(data.agentId, 'idle');
                setAgents(prev => 
                  prev.map(agent => 
                    agent.id === data.agentId 
                      ? { ...agent, status: 'idle' }
                      : agent
                  )
                );
              }
              break;
            case 'AGENT_ERROR':
              if (data.agentId) {
                updateAgentStatus(data.agentId, 'error');
                setAgents(prev => 
                  prev.map(agent => 
                    agent.id === data.agentId 
                      ? { ...agent, status: 'error' }
                      : agent
                  )
                );
              }
              break;
            case 'agent_output':
              if (data.agentId && data.output) {
                // Emitir evento para Activity Log
                eventBus.emit('agent_output', {
                  agentId: data.agentId,
                  output: data.output
                });
                
                // Agregar respuesta al chat
                const agent = AGENTS.find(a => a.id === data.agentId);
                const agentName = agent ? `${agent.name} (${agent.role})` : data.agentId;
                addAgentResponse(data.agentId, agentName, data.output);
              }
              break;
          }
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      };

      ws.onclose = () => {
        console.log('🔌 WebSocket desconectado');
        setIsConnected(false);
        
        // Reconectar en 3 segundos
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 3000);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (err) {
      console.error('Error creating WebSocket:', err);
    }
  }, [updateAgentStatus, incrementAgentTasks]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      wsRef.current?.close();
    };
  }, [connect]);

  return { agents, isConnected, lastEvent };
}
