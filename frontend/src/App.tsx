import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PhaserOffice } from "@/components/office-2d/PhaserOffice";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useOfficeStore } from "@/store/office-store";
import { useResponsive } from "@/hooks/useResponsive";

function ConnectionBootstrap({ message }: { message: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1a1a2e] px-6">
      <div className="flex w-full max-w-md flex-col items-center rounded-3xl border border-gray-700 bg-gray-900/80 px-8 py-10 text-center shadow-2xl">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#4FD1C5] border-t-transparent" />
        <p className="mt-4 text-sm text-gray-300">{message}</p>
      </div>
    </div>
  );
}

export function App() {
  const { agents, isConnected, lastEvent } = useWebSocket();
  const { isMobile } = useResponsive();
  const setAgents = useOfficeStore((s) => s.setAgents);
  
  // Sincronizar agentes con el store
  useEffect(() => {
    if (agents.length > 0) {
      setAgents(agents);
    }
  }, [agents, setAgents]);

  // Log de eventos para Activity Log
  useEffect(() => {
    if (lastEvent) {
      console.log('Evento recibido:', lastEvent);
      // Aquí se puede integrar con un Activity Log
    }
  }, [lastEvent]);

  if (!isConnected) {
    return <ConnectionBootstrap message="Conectando a la oficina..." />;
  }

  return (
    <AppShell isMobile={isMobile}>
      <PhaserOffice />
    </AppShell>
  );
}
