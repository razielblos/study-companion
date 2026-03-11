import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/AppLayout";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { WorkspaceProvider, useWorkspace } from "@/contexts/WorkspaceContext";
import Dashboard from "./pages/Dashboard";
import Disciplinas from "./pages/Disciplinas";
import SubjectDetail from "./pages/SubjectDetail";
import Cronograma from "./pages/Cronograma";
import Tarefas from "./pages/Tarefas";
import Kanban from "./pages/Kanban";
import Notas from "./pages/Notas";
import LinksUteis from "./pages/LinksUteis";
import Arquivos from "./pages/Arquivos";
import Progresso from "./pages/Progresso";
import Configuracoes from "./pages/Configuracoes";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import RecuperarSenha from "./pages/RecuperarSenha";
import ResetPassword from "./pages/ResetPassword";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (user) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function WorkspaceGuard({ children }: { children: React.ReactNode }) {
  const { loading } = useWorkspace();
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted-foreground font-heading">Carregando workspace...</p>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}

const AppContent = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/cadastro" element={<PublicRoute><Cadastro /></PublicRoute>} />
        <Route path="/recuperar-senha" element={<PublicRoute><RecuperarSenha /></PublicRoute>} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route element={
          <ProtectedRoute>
            <WorkspaceProvider>
              <WorkspaceGuard>
                <AppLayout />
              </WorkspaceGuard>
            </WorkspaceProvider>
          </ProtectedRoute>
        }>
          <Route path="/" element={<Dashboard />} />
          <Route path="/disciplinas" element={<Disciplinas />} />
          <Route path="/disciplinas/:id" element={<SubjectDetail />} />
          <Route path="/cronograma" element={<Cronograma />} />
          <Route path="/tarefas" element={<Tarefas />} />
          <Route path="/kanban" element={<Kanban />} />
          <Route path="/notas" element={<Notas />} />
          <Route path="/links" element={<LinksUteis />} />
          <Route path="/arquivos" element={<Arquivos />} />
          <Route path="/progresso" element={<Progresso />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
