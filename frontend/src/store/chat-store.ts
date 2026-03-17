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

  sendMessage: (text: string) => Promise<void>;
  toggleDock: () => void;
  setDockExpanded: (expanded: boolean) => void;
  setTargetAgent: (agentId: string) => void;
  clearError: () => void;
}

const API_URL = import.meta.env.VITE_ORCHESTRATOR_URL || 'http://localhost:3000';

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isStreaming: false,
  dockExpanded: false,
  targetAgentId: null,
  error: null,

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
      // Crear proyecto con la documentación del usuario
      const response = await fetch(`${API_URL}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `Proyecto: ${trimmed.slice(0, 50)}`,
          description: 'Creado desde el chat',
          documentation: trimmed,
        }),
      });

      if (!response.ok) {
        throw new Error('Error creando proyecto');
      }

      const project = await response.json();

      const assistantMsg: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: `✅ Proyecto creado: **${project.name}**\n\nID: \`${project.id}\`\n\nEl equipo está analizando tu solicitud. Revisa el panel de actividad para ver el progreso.`,
        timestamp: Date.now(),
        agentName: 'Alex (Lead)',
      };

      set((s) => ({
        messages: [...s.messages, assistantMsg],
        isStreaming: false,
      }));

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
