import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import ProjectCard from "@/components/project-card";
import Timeline from "@/components/timeline";
import ProgressWidget from "@/components/progress-widget";
import ProjectInterestModal from "@/components/project-interest-modal";
import GroupManagementPanel from "@/components/group-management-panel";
import { type Project, type Notification } from "@shared/schema";
import { Folder, Clock, Calendar, TrendingUp, HeartIcon, GithubIcon, UsersIcon } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

interface Group {
  id: string;
  name: string;
  projectId: string;
  status: "pending" | "approved" | "rejected";
}

export default function Dashboard() {
  const auth = useAuth();
  const { data: projects = [], isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ["/api/notifications"],
  });

  const { data: groups = [] } = useQuery<Group[]>({
    queryKey: ["/api/groups"],
  });

  const getProjectGroup = (projectId: string) => {
    return groups.find(group => group.projectId === projectId && group.status === "approved");
  };

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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2" data-testid="dashboard-title">
            Dashboard de Projetos
          </h1>
          <p className="text-muted-foreground" data-testid="dashboard-subtitle">
            {auth.user?.type === "professor" 
              ? "Gerencie projetos e aprove grupos de estudantes."
              : "Demonstre interesse e cadastre seu grupo nos projetos disponíveis."
            }
          </p>
          <p className="text-sm text-muted-foreground">
            Período: 23/09/2025 - 09/12/2025 | Semestre: 2025.2
          </p>
        </div>
        {auth.user?.githubProfile && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <GithubIcon className="w-4 h-4" />
            <span>GitHub: {auth.user.githubProfile.split('/').pop()}</span>
          </div>
        )}
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
                <p className="text-xs text-muted-foreground">Protótipo Figma</p>
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

      {/* Group Management for Professors */}
      {auth.user?.type === "professor" && (
        <div className="mb-8">
          <GroupManagementPanel />
        </div>
      )}

      {/* Project Selection */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-primary mb-4" data-testid="projects-section-title">
          Temas de Projetos Disponíveis
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-testid="projects-grid">
          {projects.map((project) => {
            const assignedGroup = getProjectGroup(project.id);
            return (
              <Card key={project.id} data-testid={`enhanced-project-card-${project.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg" data-testid={`project-title-${project.id}`}>
                        {project.title}
                      </CardTitle>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline" data-testid={`project-theme-${project.id}`}>
                          Tema {project.theme}
                        </Badge>
                        {assignedGroup ? (
                          <Badge variant="destructive" data-testid={`project-assigned-group-${project.id}`}>
                            Tema Fixado - {assignedGroup.name}
                          </Badge>
                        ) : (
                          <Badge variant="default" className="bg-green-100 text-green-700" data-testid={`project-available-${project.id}`}>
                            Disponível
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4" data-testid={`project-description-${project.id}`}>
                    {project.description}
                  </p>
                  
                  {assignedGroup && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                      <p className="text-sm font-medium text-blue-800">
                        📋 Entregas do projeto:
                      </p>
                      <ul className="text-xs text-blue-700 mt-1 space-y-1">
                        {Array.isArray(project.deliverables) && project.deliverables.map((deliverable, index) => (
                          <li key={index}>• {deliverable}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <UsersIcon className="h-4 w-4" />
                        {Array.isArray(project.modules) ? project.modules.length : 0} módulos
                      </div>
                      {assignedGroup && (
                        <span className="text-green-600 font-medium">
                          Atribuído ao {assignedGroup.name}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      {auth.user?.type === "student" && !assignedGroup && (
                        <ProjectInterestModal projectId={project.id} projectTitle={project.title}>
                          <Button variant="outline" size="sm" data-testid={`button-interest-${project.id}`}>
                            <HeartIcon className="w-4 h-4 mr-1" />
                            Interesse
                          </Button>
                        </ProjectInterestModal>
                      )}
                      
                      <ProjectCard key={`original-${project.id}`} project={project} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
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
          <Card data-testid="notifications-sidebar">
            <CardHeader>
              <CardTitle className="text-primary">Notificações Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4" data-testid="notification-list">
                {notifications.slice(0, 3).map((notification) => (
                  <div 
                    key={notification.id} 
                    className="flex items-start space-x-3"
                    data-testid={`notification-${notification.id}`}
                  >
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <div>
                      <p className="text-sm font-medium" data-testid={`notification-title-${notification.id}`}>
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground" data-testid={`notification-message-${notification.id}`}>
                        {notification.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <ProgressWidget />
          
          {/* Quick Actions */}
          <Card data-testid="quick-actions-card">
            <CardHeader>
              <CardTitle className="text-primary">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {auth.user?.type === "student" ? (
                <>
                  <Button className="w-full" data-testid="button-submit-deliverable">
                    Marcar Entrega Concluída
                  </Button>
                  <Button variant="secondary" className="w-full" data-testid="button-view-my-interests">
                    Meus Interesses
                  </Button>
                  <Button variant="outline" className="w-full" data-testid="button-view-my-group">
                    Meu Grupo
                  </Button>
                </>
              ) : (
                <>
                  <Button className="w-full" data-testid="button-approve-groups">
                    Aprovar Grupos
                  </Button>
                  <Button variant="secondary" className="w-full" data-testid="button-schedule-meeting">
                    Agendar Orientação
                  </Button>
                  <Button variant="outline" className="w-full" data-testid="button-view-all-interests">
                    Ver Todos os Interesses
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
