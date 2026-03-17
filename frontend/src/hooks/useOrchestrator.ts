import { useEffect, useRef, useState, useCallback } from 'react';
import type { Agent, Project, OrchestratorEvent } from '../types/orchestrator';

// Convertir URL HTTP a WebSocket
const HTTP_URL = import.meta.env.VITE_ORCHESTRATOR_URL || 'http://localhost:3000';
const WS_URL = (HTTP_URL.replace('https:', 'wss:').replace('http:', 'ws:')) + '/ws';

interface UseOrchestratorReturn {
  agents: Agent[];
  projects: Project[];
  isConnected: boolean;
  error: string | null;
  createProject: (name: string, description: string, documentation: string) => Promise<void>;
  refreshAgents: () => Promise<void>;
}

export function useOrchestrator(): UseOrchestratorReturn {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('✅ Conectado al orchestrator');
        setIsConnected(true);
        setError(null);
      };

      ws.onmessage = (event) => {
        try {
          const data: OrchestratorEvent = JSON.parse(event.data);
          handleEvent(data);
        } catch (err) {
          console.error('Error parsing message:', err);
        }
      };

      ws.onclose = () => {
        console.log('🔌 Desconectado del orchestrator');
        setIsConnected(false);
        
        // Reconectar en 3 segundos
        reconnectTimerRef.current = setTimeout(() => {
          connect();
        }, 3000);
      };

      ws.onerror = (err) => {
        console.error('WebSocket error:', err);
        setError('Error de conexión');
      };
    } catch (err) {
      setError('No se pudo conectar');
    }
  }, []);

  const handleEvent = useCallback((event: OrchestratorEvent) => {
    switch (event.type) {
      case 'init':
        if ('agents' in event) {
          setAgents(event.agents);
          setProjects(event.projects);
        }
        break;
      case 'agent_status':
        setAgents(prev => 
          prev.map(agent => 
            agent.id === event.agentId 
              ? { ...agent, status: event.status, currentTask: event.currentTask }
              : agent
          )
        );
        break;
      case 'task_update':
        // Actualizar estado de tareas en proyectos
        setProjects(prev => 
          prev.map(project => ({
            ...project,
            tasks: project.tasks.map(task =>
              task.id === event.taskId
                ? { ...task, status: event.status, result: event.result }
                : task
            )
          }))
        );
        break;
      case 'project_update':
        setProjects(prev =>
          prev.map(project =>
            project.id === event.projectId
              ? { ...project, status: event.status }
              : project
          )
        );
        break;
    }
  }, []);

  const createProject = useCallback(async (
    name: string, 
    description: string, 
    documentation: string
  ): Promise<void> => {
    const response = await fetch(`${HTTP_URL}/api/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, documentation })
    });

    if (!response.ok) {
      throw new Error('Error creando proyecto');
    }
  }, []);

  const refreshAgents = useCallback(async (): Promise<void> => {
    const response = await fetch(`${HTTP_URL}/api/agents`);
    if (response.ok) {
      const data = await response.json();
      setAgents(data);
    }
  }, []);

  useEffect(() => {
    connect();
    
    return () => {
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }
      wsRef.current?.close();
    };
  }, [connect]);

  return {
    agents,
    projects,
    isConnected,
    error,
    createProject,
    refreshAgents
  };
}
