import { useEffect, useRef, useState, useCallback } from 'react';

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
  type: 'AGENT_THINKING' | 'AGENT_IDLE' | 'AGENT_WORKING' | 'AGENT_ERROR' | 'init' | 'agent_status';
  agentId?: string;
  status?: AgentStatus;
  agents?: Agent[];
  timestamp?: number;
}

export function useWebSocket() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<AgentEvent | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

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
                setAgents(prev => 
                  prev.map(agent => 
                    agent.id === data.agentId 
                      ? { ...agent, status: data.status! }
                      : agent
                  )
                );
              }
              break;
            case 'AGENT_THINKING':
            case 'AGENT_WORKING':
              if (data.agentId) {
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
                setAgents(prev => 
                  prev.map(agent => 
                    agent.id === data.agentId 
                      ? { ...agent, status: 'error' }
                      : agent
                  )
                );
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
  }, []);

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
