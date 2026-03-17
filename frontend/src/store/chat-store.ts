import { create } from "zustand";

export type MessageRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  agentName?: string;
}

interface ChatState {
  messages: ChatMessage[];
  isStreaming: boolean;
  dockExpanded: boolean;
  targetAgentId: string | null;
  error: string | null;
  ws: WebSocket | null;

  sendMessage: (text: string) => Promise<void>;
  addAgentResponse: (agentId: string, agentName: string, content: string) => void;
  setWebSocket: (ws: WebSocket) => void;
  toggleDock: () => void;
  setDockExpanded: (expanded: boolean) => void;
  setTargetAgent: (agentId: string) => void;
  clearError: () => void;
}

const WS_URL = import.meta.env.VITE_ORCHESTRATOR_URL?.replace('https:', 'wss:').replace('http:', 'ws:') || 'ws://localhost:3000';

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isStreaming: false,
  dockExpanded: false,
  targetAgentId: null,
  error: null,
  ws: null,

  setWebSocket: (ws) => set({ ws }),

  addAgentResponse: (agentId, agentName, content) => {
    const agentMsg: ChatMessage = {
      id: generateId(),
      role: "assistant",
      content: content,
      timestamp: Date.now(),
      agentName: agentName,
    };

    set((s) => ({
      messages: [...s.messages, agentMsg],
      isStreaming: false,
    }));
  },

  sendMessage: async (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = {
      id: generateId(),
      role: "user",
      content: trimmed,
      timestamp: Date.now(),
    };

    set((s) => ({
      messages: [...s.messages, userMsg],
      isStreaming: true,
      dockExpanded: true,
      error: null,
    }));

    try {
      const ws = get().ws;
      
      if (ws && ws.readyState === WebSocket.OPEN) {
        // Enviar por WebSocket al Lead (Alex)
        ws.send(JSON.stringify({
          type: 'CREATE_TASK',
          text: trimmed,
          agentId: 'lead-001'
        }));

        const assistantMsg: ChatMessage = {
          id: generateId(),
          role: "assistant",
          content: `✅ Tarea enviada a **Alex (Lead)**\n\n"${trimmed.substring(0, 100)}${trimmed.length > 100 ? '...' : ''}"\n\nEl equipo está analizando tu solicitud...`,
          timestamp: Date.now(),
          agentName: 'Alex (Lead)',
        };

        set((s) => ({
          messages: [...s.messages, assistantMsg],
          isStreaming: false,
        }));
      } else {
        throw new Error('WebSocket no conectado');
      }
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Error desconocido',
        isStreaming: false,
      });
    }
  },

  toggleDock: () => {
    set((s) => ({ dockExpanded: !s.dockExpanded }));
  },

  setDockExpanded: (expanded) => {
    set({ dockExpanded: expanded });
  },

  setTargetAgent: (agentId) => {
    set({ targetAgentId: agentId });
  },

  clearError: () => set({ error: null }),
}));
