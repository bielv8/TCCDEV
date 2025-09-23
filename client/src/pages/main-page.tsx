import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, CheckCircle, ArrowLeft } from "lucide-react";
import { type Project, type WeeklySchedule } from "@shared/schema";
import { projectThemes } from "@/data/projects";
import { formatDate } from "@/lib/date-utils";

export default function MainPage() {
  const { themeId } = useParams();
  const [selectedTheme, setSelectedTheme] = useState<number | null>(
    themeId ? parseInt(themeId) : null
  );

  const { data: projects = [], isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  // Get schedule for the selected theme's project
  const selectedProject = projects.find(p => p.theme === selectedTheme);
  const { data: schedule = [], isLoading: scheduleLoading } = useQuery<WeeklySchedule[]>({
    queryKey: ["/api/projects", selectedProject?.id, "schedule"],
    enabled: !!selectedProject?.id,
  });

  const handleThemeClick = (themeId: number) => {
    setSelectedTheme(themeId);
    // Update URL without navigation
    window.history.pushState({}, '', `/theme/${themeId}`);
  };

  const handleBackToThemes = () => {
    setSelectedTheme(null);
    window.history.pushState({}, '', '/');
  };

  if (selectedTheme && selectedProject) {
    // Show schedule for selected theme
    const totalWeeks = schedule.length || 11;
    const completedWeeks = schedule.filter(week => week.status === 'completed').length;
    const currentWeekData = schedule.find(week => week.status === 'current');
    const currentWeek = currentWeekData?.weekNumber || 1;
    const progressPercentage = totalWeeks > 0 ? Math.round((completedWeeks / totalWeeks) * 100) : 0;

    return (
      <div className="min-h-screen p-6" data-testid="schedule-view">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={handleBackToThemes}
            className="mb-4"
            data-testid="back-to-themes"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar aos Temas
          </Button>
          
          <h1 className="text-3xl font-bold text-primary mb-2" data-testid="theme-title">
            {selectedProject.title}
          </h1>
          <p className="text-muted-foreground mb-4" data-testid="theme-description">
            {selectedProject.description}
          </p>
          <Badge variant="outline" className="mb-4" data-testid="theme-badge">
            Tema {selectedProject.theme}
          </Badge>
        </div>

        {scheduleLoading ? (
          <div className="animate-pulse space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-muted rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-muted rounded"></div>
          </div>
        ) : (
          <>
            {/* Progress Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card data-testid="progress-total-weeks">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total de Semanas</p>
                      <p className="text-2xl font-bold text-primary">{totalWeeks}</p>
                    </div>
                    <Calendar className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="progress-current-week">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Semana Atual</p>
                      <p className="text-2xl font-bold text-secondary">{currentWeek}</p>
                    </div>
                    <Clock className="w-8 h-8 text-secondary" />
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="progress-completed-weeks">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Semanas Concluídas</p>
                      <p className="text-2xl font-bold text-accent">{completedWeeks}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-accent" />
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="progress-percentage">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Progresso Geral</p>
                      <p className="text-2xl font-bold text-primary">{progressPercentage}%</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">{progressPercentage}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Progress Bar */}
            <Card className="mb-8" data-testid="progress-bar-card">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Progresso do Projeto</span>
                    <span>{progressPercentage}%</span>
                  </div>
                  <Progress value={progressPercentage} className="w-full" />
                </div>
              </CardContent>
            </Card>

            {/* Weekly Timeline */}
            <Card data-testid="weekly-timeline-card">
              <CardHeader>
                <CardTitle>Cronograma Semanal</CardTitle>
                <CardDescription>
                  Cronograma detalhado para {selectedProject.title}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6" data-testid="weekly-timeline">
                  {schedule.map((week) => {
                    const status = week.status || 'pending';

                    return (
                      <div key={week.id} className="timeline-item pl-10" data-testid={`timeline-week-${week.weekNumber}`}>
                        <div className="absolute left-3 w-4 h-4 rounded-full border-2 border-white shadow-md z-10"
                             style={{
                               backgroundColor: status === 'completed' ? 'hsl(158, 64%, 52%)' :
                                              status === 'current' ? 'hsl(15, 90%, 60%)' :
                                              'hsl(210, 40%, 96%)'
                             }}>
                        </div>
                        
                        <div className="bg-card rounded-lg border p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold" data-testid={`week-${week.weekNumber}-title`}>
                              Semana {week.weekNumber} - {week.title}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-muted-foreground" data-testid={`week-${week.weekNumber}-dates`}>
                                {formatDate(week.startDate)} - {formatDate(week.endDate)}
                              </span>
                              <Badge 
                                className={`week-status ${status}`}
                                data-testid={`week-${week.weekNumber}-status`}
                              >
                                {status === 'completed' ? 'Concluída' : 
                                 status === 'current' ? 'Em Andamento' : 'Pendente'}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="mb-3">
                            <h5 className="text-sm font-medium mb-1">Tarefas:</h5>
                            <ul className="text-sm text-muted-foreground space-y-1" data-testid={`week-${week.weekNumber}-tasks`}>
                              {(week.tasks as string[]).map((task, index) => (
                                <li key={index}>• {task}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="bg-muted/50 px-3 py-2 rounded text-sm" data-testid={`week-${week.weekNumber}-deliverable`}>
                            <strong>Entregável:</strong> {week.deliverable}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    );
  }

  // Show theme selection
  return (
    <div className="min-h-screen p-6" data-testid="themes-view">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-primary mb-4" data-testid="main-title">
          Temas de Projetos SENAI
        </h1>
        <p className="text-xl text-muted-foreground mb-2" data-testid="main-subtitle">
          Selecione um tema para ver o cronograma completo
        </p>
        <p className="text-sm text-muted-foreground">
          Período: 23/09/2025 - 09/12/2025 | Semestre: 2025.2
        </p>
      </div>

      {projectsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-48 bg-muted rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="themes-grid">
          {projectThemes.map((theme) => {
            const project = projects.find(p => p.theme === theme.id);
            
            return (
              <Card 
                key={theme.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow duration-200 hover:border-primary/50"
                onClick={() => handleThemeClick(theme.id)}
                data-testid={`theme-card-${theme.id}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2" data-testid={`theme-title-${theme.id}`}>
                        {theme.title}
                      </CardTitle>
                      <Badge variant="outline" className="mb-2" data-testid={`theme-number-${theme.id}`}>
                        Tema {theme.id}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4" data-testid={`theme-description-${theme.id}`}>
                    {theme.description}
                  </p>
                  
                  {project && (
                    <div className="space-y-2">
                      <div className="text-xs text-muted-foreground">
                        <strong>Contexto:</strong> {project.context}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <strong>Problema:</strong> {project.problem}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-4 flex justify-between items-center">
                    <Badge variant="secondary" data-testid={`theme-status-${theme.id}`}>
                      {project ? 'Com Cronograma' : 'Disponível'}
                    </Badge>
                    <Button size="sm" variant="outline" data-testid={`theme-button-${theme.id}`}>
                      Ver Cronograma
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}