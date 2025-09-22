import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, CheckCircle } from "lucide-react";
import { type Project, type WeeklySchedule } from "@shared/schema";
import { formatDate, getWeekProgress } from "@/lib/date-utils";

export default function Schedule() {
  const { data: projects = [], isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  // Fetch schedule data for the first project (or you could make this configurable)
  const firstProjectId = projects[0]?.id;
  const { data: schedule = [], isLoading: scheduleLoading } = useQuery<WeeklySchedule[]>({
    queryKey: ["/api/projects", firstProjectId, "schedule"],
    enabled: !!firstProjectId,
  });

  if (projectsLoading || scheduleLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/2"></div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Calculate schedule metrics from real data
  const totalWeeks = schedule.length || 11;
  const completedWeeks = schedule.filter(week => week.status === 'completed').length;
  const currentWeekData = schedule.find(week => week.status === 'current');
  const currentWeek = currentWeekData?.weekNumber || 1;
  const progressPercentage = totalWeeks > 0 ? Math.round((completedWeeks / totalWeeks) * 100) : 0;

  return (
    <div className="p-6" data-testid="schedule-container">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2" data-testid="schedule-title">
          Cronograma Geral
        </h1>
        <p className="text-muted-foreground" data-testid="schedule-subtitle">
          Acompanhe o progresso semanal dos projetos acadêmicos
        </p>
      </div>

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

      {/* Weekly Timeline */}
      <Card data-testid="weekly-timeline-card">
        <CardHeader>
          <CardTitle>Timeline Semanal</CardTitle>
          <CardDescription>
            Cronograma detalhado para todos os temas de projeto
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
    </div>
  );
}

