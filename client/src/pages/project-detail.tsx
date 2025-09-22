import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Calendar, Clock, Users } from "lucide-react";
import { type Project, type WeeklySchedule } from "@shared/schema";
import { formatDate } from "@/lib/date-utils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function ProjectDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: project, isLoading: projectLoading } = useQuery<Project>({
    queryKey: ["/api/projects", id],
  });

  const { data: schedule = [], isLoading: scheduleLoading } = useQuery<WeeklySchedule[]>({
    queryKey: ["/api/projects", id, "schedule"],
  });

  const updateScheduleStatus = useMutation({
    mutationFn: async ({ scheduleId, status }: { scheduleId: string; status: 'completed' | 'pending' | 'current' }) => {
      return apiRequest('PATCH', `/api/schedule/${scheduleId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", id, "schedule"] });
      toast({
        title: "Status atualizado",
        description: "O status da semana foi atualizado com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status da semana.",
        variant: "destructive",
      });
    },
  });

  const toggleWeekStatus = (scheduleId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    updateScheduleStatus.mutate({ scheduleId, status: newStatus });
  };

  if (projectLoading || scheduleLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/2"></div>
          <div className="h-24 bg-muted rounded"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive">Projeto não encontrado</h2>
          <Button onClick={() => setLocation("/")} className="mt-4">
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6" data-testid="project-detail-container">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => setLocation("/")}
          className="mb-4"
          data-testid="button-back"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao Dashboard
        </Button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2" data-testid="project-title">
              {project.title}
            </h1>
            <div className="flex items-center space-x-4 text-muted-foreground">
              <Badge variant="outline" data-testid="project-theme">
                Tema {project.theme}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Project Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <Card data-testid="project-overview-card">
            <CardHeader>
              <CardTitle>Visão Geral do Projeto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Descrição</h3>
                <p className="text-muted-foreground" data-testid="project-description">
                  {project.description}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Contexto</h3>
                <p className="text-muted-foreground" data-testid="project-context">
                  {project.context}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Problemática</h3>
                <p className="text-muted-foreground" data-testid="project-problem">
                  {project.problem}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Technical Info */}
        <div className="space-y-6">
          <Card data-testid="technologies-card">
            <CardHeader>
              <CardTitle>Tecnologias</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2" data-testid="technologies-list">
                {(project.technologies as string[]).map((tech) => (
                  <Badge key={tech} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card data-testid="modules-card">
            <CardHeader>
              <CardTitle>Módulos Principais</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2" data-testid="modules-list">
                {(project.modules as string[]).map((module, index) => (
                  <li key={index} className="text-sm">
                    • {module}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Weekly Schedule */}
      <Card data-testid="schedule-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Cronograma Detalhado (11 Semanas)
          </CardTitle>
          <CardDescription>
            Planejamento semanal com entregáveis e critérios de avaliação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto" data-testid="schedule-timeline">
            {schedule.map((week) => (
              <div key={week.id} className="border border-border rounded-lg p-4" data-testid={`week-${week.weekNumber}`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium" data-testid={`week-${week.weekNumber}-title`}>
                    Semana {week.weekNumber} - {week.title}
                  </h4>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-muted-foreground" data-testid={`week-${week.weekNumber}-dates`}>
                      {formatDate(week.startDate)} - {formatDate(week.endDate)}
                    </span>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        className={`week-status ${week.status}`}
                        data-testid={`week-${week.weekNumber}-status`}
                      >
                        {week.status === 'completed' ? 'Concluída' : 
                         week.status === 'current' ? 'Em Andamento' : 'Pendente'}
                      </Badge>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">Concluída:</span>
                        <Switch
                          checked={week.status === 'completed'}
                          onCheckedChange={() => toggleWeekStatus(week.id, week.status || 'pending')}
                          disabled={updateScheduleStatus.isPending}
                          data-testid={`week-${week.weekNumber}-toggle`}
                        />
                      </div>
                    </div>
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
                
                <div className="mb-3">
                  <div className="bg-accent/10 text-accent px-3 py-2 rounded text-sm" data-testid={`week-${week.weekNumber}-deliverable`}>
                    <strong>Entregável:</strong> {week.deliverable}
                  </div>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium mb-1">Critérios de Avaliação:</h5>
                  <ul className="text-xs text-muted-foreground space-y-1" data-testid={`week-${week.weekNumber}-criteria`}>
                    {(week.evaluationCriteria as string[]).map((criteria, index) => (
                      <li key={index}>• {criteria}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
