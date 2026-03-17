import { useEffect, type ReactNode } from "react";
import { ChatDialog } from "@/components/chat/ChatDialog";
import { ChatDockBar } from "@/components/chat/ChatDockBar";
import { useOfficeStore } from "@/store/office-store";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

interface AppShellProps {
  children?: ReactNode;
  isMobile?: boolean;
}

export function AppShell({ children, isMobile = false }: AppShellProps) {
  const sidebarCollapsed = useOfficeStore((s) => s.sidebarCollapsed);
  const setSidebarCollapsed = useOfficeStore((s) => s.setSidebarCollapsed);
  const connectionStatus = useOfficeStore((s) => s.connectionStatus);

  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  }, [isMobile, setSidebarCollapsed]);

  useEffect(() => {
    if (connectionStatus === "connected") {
      console.log("✅ Conectado al orchestrator");
    }
  }, [connectionStatus]);

  return (
    <div className="flex h-screen w-screen flex-col bg-gray-950 text-gray-100">
      <TopBar isMobile={isMobile} />
      <div className="relative flex flex-1 overflow-hidden">
        <main className="relative flex flex-1 flex-col overflow-hidden">
          <div className="relative flex-1 overflow-hidden">{children}</div>
          <ChatDialog />
          <ChatDockBar />
        </main>

        {isMobile ? (
          <>
            <button
              type="button"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="fixed bottom-0 left-1/2 z-20 flex h-10 w-full max-w-xs -translate-x-1/2 items-center justify-center border-t border-gray-800 bg-gray-900 shadow-lg"
            >
              <div className="h-1 w-12 rounded-full bg-gray-600" />
            </button>
            {!sidebarCollapsed && (
              <>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setSidebarCollapsed(true)}
                  className="fixed inset-0 z-30 bg-black/30"
                />
                <aside className="fixed inset-x-0 bottom-10 top-12 z-40 overflow-hidden rounded-t-xl border-t border-gray-700 bg-gray-900 shadow-xl">
                  <Sidebar />
                </aside>
              </>
            )}
          </>
        ) : (
          <Sidebar />
        )}
      </div>
    </div>
  );
}
