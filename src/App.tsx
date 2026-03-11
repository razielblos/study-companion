import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/AppLayout";
import { Onboarding } from "@/components/Onboarding";
import { useStore } from "@/store/useStore";
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

const queryClient = new QueryClient();

const AppContent = () => {
  const onboardingDone = useStore((s) => s.profile.onboardingDone);
  if (!onboardingDone) return <Onboarding />;
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
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
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
