import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar, ArrowLeft, Code, Layers, Package, FileText } from "lucide-react";
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
    // Show complete theme details and schedule
    return (
      <div className="min-h-screen p-6" data-testid="theme-details-view">
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
          
          <h1 className="text-4xl font-bold text-primary mb-4" data-testid="theme-title">
            {selectedProject.title}
          </h1>
          <Badge variant="outline" className="mb-4" data-testid="theme-badge">
            Tema {selectedProject.theme}
          </Badge>
        </div>

        {/* Project Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Description and Context */}
          <div className="space-y-6">
            <Card data-testid="project-description">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Descrição do Projeto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {selectedProject.description}
                </p>
              </CardContent>
            </Card>

            <Card data-testid="project-context">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="w-5 h-5" />
                  Contexto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {selectedProject.context}
                </p>
              </CardContent>
            </Card>

            <Card data-testid="project-problem">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Problema a Resolver
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {selectedProject.problem}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Technical Details */}
          <div className="space-y-6">
            <Card data-testid="project-architecture">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Arquitetura
                </CardTitle>
              </CardHeader>
              <CardContent>
                {Array.isArray(selectedProject.architecture) ? (
                  <div className="space-y-2">
                    {(selectedProject.architecture as string[]).map((item, index) => (
                      <Badge key={index} variant="secondary" className="mr-2 mb-2">
                        {item}
                      </Badge>
                    ))}
                  </div>
                ) : typeof selectedProject.architecture === 'object' && selectedProject.architecture !== null ? (
                  <div className="space-y-2">
                    {Object.entries(selectedProject.architecture as Record<string, any>).map(([key, value], index) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium">{key}:</span> {Array.isArray(value) ? value.join(', ') : String(value)}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">{String(selectedProject.architecture)}</p>
                )}
              </CardContent>
            </Card>

            <Card data-testid="project-technologies">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="w-5 h-5" />
                  Tecnologias
                </CardTitle>
              </CardHeader>
              <CardContent>
                {Array.isArray(selectedProject.technologies) ? (
                  <div className="space-y-2">
                    {(selectedProject.technologies as string[]).map((tech, index) => (
                      <Badge key={index} variant="outline" className="mr-2 mb-2">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                ) : typeof selectedProject.technologies === 'object' && selectedProject.technologies !== null ? (
                  <div className="space-y-2">
                    {Object.entries(selectedProject.technologies as Record<string, any>).map(([key, value], index) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium">{key}:</span> {Array.isArray(value) ? value.join(', ') : String(value)}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">{String(selectedProject.technologies)}</p>
                )}
              </CardContent>
            </Card>

            <Card data-testid="project-modules">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Módulos
                </CardTitle>
              </CardHeader>
              <CardContent>
                {Array.isArray(selectedProject.modules) ? (
                  <ul className="space-y-1">
                    {(selectedProject.modules as string[]).map((module, index) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        • {module}
                      </li>
                    ))}
                  </ul>
                ) : typeof selectedProject.modules === 'object' && selectedProject.modules !== null ? (
                  <div className="space-y-2">
                    {Object.entries(selectedProject.modules as Record<string, any>).map(([key, value], index) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium">{key}:</span> {Array.isArray(value) ? value.join(', ') : String(value)}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">{String(selectedProject.modules)}</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Deliverables */}
        <Card className="mb-8" data-testid="project-deliverables">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Entregáveis do Projeto
            </CardTitle>
          </CardHeader>
          <CardContent>
            {Array.isArray(selectedProject.deliverables) ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(selectedProject.deliverables as string[]).map((deliverable, index) => (
                  <div key={index} className="bg-muted/50 px-4 py-3 rounded-lg">
                    <p className="text-sm font-medium">{deliverable}</p>
                  </div>
                ))}
              </div>
            ) : typeof selectedProject.deliverables === 'object' && selectedProject.deliverables !== null ? (
              <div className="space-y-2">
                {Object.entries(selectedProject.deliverables as Record<string, any>).map(([key, value], index) => (
                  <div key={index} className="bg-muted/50 px-4 py-3 rounded-lg">
                    <p className="text-sm font-medium">{key}: {Array.isArray(value) ? value.join(', ') : String(value)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">{String(selectedProject.deliverables)}</p>
            )}
          </CardContent>
        </Card>

        <Separator className="mb-8" />

        {/* Simplified Weekly Timeline */}
        <Card data-testid="weekly-timeline-card">
          <CardHeader>
            <CardTitle>Cronograma Semanal</CardTitle>
            <CardDescription>
              Cronograma detalhado para {selectedProject.title}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {scheduleLoading ? (
              <div className="animate-pulse space-y-4">
                {[...Array(11)].map((_, i) => (
                  <div key={i} className="h-24 bg-muted rounded"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-6" data-testid="weekly-timeline">
                {schedule.map((week) => (
                  <div key={week.id} className="timeline-item pl-10" data-testid={`timeline-week-${week.weekNumber}`}>
                    <div className="absolute left-3 w-4 h-4 rounded-full border-2 border-white shadow-md z-10 bg-primary">
                    </div>
                    
                    <div className="bg-card rounded-lg border p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold" data-testid={`week-${week.weekNumber}-title`}>
                          Semana {week.weekNumber} - {week.title}
                        </h3>
                        <span className="text-sm text-muted-foreground" data-testid={`week-${week.weekNumber}-dates`}>
                          {formatDate(week.startDate)} - {formatDate(week.endDate)}
                        </span>
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
                ))}
              </div>
            )}
          </CardContent>
        </Card>
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