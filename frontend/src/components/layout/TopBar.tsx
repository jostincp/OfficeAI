import { useOfficeStore } from "@/store/office-store";

interface TopBarProps {
  isMobile?: boolean;
}

export function TopBar({ isMobile: _isMobile = false }: TopBarProps) {
  const connectionStatus = useOfficeStore((s) => s.connectionStatus);

  const statusColors: Record<string, string> = {
    connecting: "bg-yellow-500",
    connected: "bg-green-500",
    disconnected: "bg-gray-500",
    error: "bg-red-500",
  };

  const statusLabels: Record<string, string> = {
    connecting: "Conectando...",
    connected: "Conectado",
    disconnected: "Desconectado",
    error: "Error",
  };

  return (
    <header className="flex h-12 shrink-0 items-center border-b border-gray-800 bg-gray-900 px-4 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold text-white">OfficeAI</span>
        <span className="text-xs text-gray-400">v1.0</span>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${statusColors[connectionStatus] || "bg-gray-500"} ${connectionStatus === "connecting" ? "animate-pulse" : ""}`} />
          <span className="text-xs text-gray-400">{statusLabels[connectionStatus] || connectionStatus}</span>
        </div>
      </div>
    </header>
  );
}
