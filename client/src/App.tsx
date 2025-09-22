import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import Dashboard from "@/pages/dashboard";
import ProjectDetail from "@/pages/project-detail";
import Schedule from "@/pages/schedule";
import LoginPage from "@/pages/login";
import NotFound from "@/pages/not-found";
import { AuthProvider, useAuth } from "@/contexts/auth-context";

function AuthenticatedRouter() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/projects/:id" component={ProjectDetail} />
      <Route path="/schedule" component={Schedule} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const auth = useAuth();

  if (auth.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!auth.user) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex h-screen pt-16">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <AuthenticatedRouter />
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <AppContent />
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
