import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import ProjectCard from "@/components/project-card";
import Timeline from "@/components/timeline";
import ProgressWidget from "@/components/progress-widget";
import NotificationPanel from "@/components/notification-panel";
import { type Project, type Notification } from "@shared/schema";
import { Folder, Clock, Calendar, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const { data: projects = [], isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ["/api/notifications"],
  });

  if (projectsLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const totalProjects = projects.length;
  const weeksRemaining = 11;
  const nextDeadline = 3;
  const overallProgress = 18;

  return (
    <div className="p-6" data-testid="dashboard-container">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2" data-testid="dashboard-title">
          Dashboard de Projetos
        </h1>
        <p className="text-muted-foreground" data-testid="dashboard-subtitle">
          Período: 23/09/2025 - 09/12/2025 | Semestre: 2025.2
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card data-testid="stat-card-projects">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Projetos Disponíveis</p>
                <p className="text-2xl font-bold text-primary" data-testid="stat-projects-count">
                  {totalProjects}
                </p>
              </div>
              <Folder className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card data-testid="stat-card-weeks">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Semanas Restantes</p>
                <p className="text-2xl font-bold text-secondary" data-testid="stat-weeks-remaining">
                  {weeksRemaining}
                </p>
              </div>
              <Clock className="w-8 h-8 text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card data-testid="stat-card-deadline">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Próxima Entrega</p>
                <p className="text-2xl font-bold text-accent" data-testid="stat-next-deadline">
                  {nextDeadline} dias
                </p>
              </div>
              <Calendar className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card data-testid="stat-card-progress">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Progresso Geral</p>
                <p className="text-2xl font-bold text-primary" data-testid="stat-overall-progress">
                  {overallProgress}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Selection */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-primary mb-4" data-testid="projects-section-title">
          Temas de Projetos Disponíveis
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="projects-grid">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Timeline Section */}
        <div className="lg:col-span-2">
          <Timeline />
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <NotificationPanel notifications={notifications} />
          <ProgressWidget />
          
          {/* Quick Actions */}
          <Card data-testid="quick-actions-card">
            <CardHeader>
              <CardTitle className="text-primary">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" data-testid="button-submit-deliverable">
                Enviar Entregável
              </Button>
              <Button variant="secondary" className="w-full" data-testid="button-schedule-meeting">
                Agendar Orientação
              </Button>
              <Button variant="outline" className="w-full" data-testid="button-view-resources">
                Ver Recursos
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
