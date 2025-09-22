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

  if (projectsLoading) {
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

  // Calculate overall schedule metrics
  const totalWeeks = 11;
  const currentWeek = 2; // Based on the current date (simulated)
  const completedWeeks = 1;
  const progressPercentage = Math.round((currentWeek / totalWeeks) * 100);

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
            {Array.from({ length: totalWeeks }, (_, index) => {
              const weekNumber = index + 1;
              const startDate = new Date('2025-09-23');
              startDate.setDate(startDate.getDate() + index * 7);
              const endDate = new Date(startDate);
              endDate.setDate(endDate.getDate() + 6);
              
              const status = weekNumber < currentWeek ? 'completed' : 
                           weekNumber === currentWeek ? 'current' : 'pending';

              return (
                <div key={weekNumber} className="timeline-item pl-10" data-testid={`timeline-week-${weekNumber}`}>
                  <div className="absolute left-3 w-4 h-4 rounded-full border-2 border-white shadow-md z-10"
                       style={{
                         backgroundColor: status === 'completed' ? 'hsl(158, 64%, 52%)' :
                                        status === 'current' ? 'hsl(15, 90%, 60%)' :
                                        'hsl(210, 40%, 96%)'
                       }}>
                  </div>
                  
                  <div className="bg-card rounded-lg border p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold" data-testid={`week-${weekNumber}-title`}>
                        Semana {weekNumber} - {getWeekTitle(weekNumber)}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground" data-testid={`week-${weekNumber}-dates`}>
                          {formatDate(startDate)} - {formatDate(endDate)}
                        </span>
                        <Badge 
                          className={`week-status ${status}`}
                          data-testid={`week-${weekNumber}-status`}
                        >
                          {status === 'completed' ? 'Concluída' : 
                           status === 'current' ? 'Em Andamento' : 'Pendente'}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="text-sm text-muted-foreground mb-2" data-testid={`week-${weekNumber}-description`}>
                      {getWeekDescription(weekNumber)}
                    </div>
                    
                    <div className="bg-muted/50 px-3 py-2 rounded text-sm" data-testid={`week-${weekNumber}-deliverable`}>
                      <strong>Entregável:</strong> {getWeekDeliverable(weekNumber)}
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

function getWeekTitle(weekNumber: number): string {
  const titles = [
    "Planejamento Inicial",
    "Documentação Técnica",
    "Configuração e Models",
    "Autenticação e Usuários",
    "Funcionalidades Core",
    "Interface e UX",
    "Funcionalidades Avançadas",
    "API e Integração",
    "Testes e Qualidade",
    "Documentação Final",
    "Apresentação Final"
  ];
  return titles[weekNumber - 1] || "Semana";
}

function getWeekDescription(weekNumber: number): string {
  const descriptions = [
    "Escolha do tema, análise de requisitos e prototipação inicial",
    "Elaboração do DER, casos de uso e documentação técnica",
    "Setup do ambiente Django e criação dos models principais",
    "Implementação do sistema de autenticação e perfis de usuário",
    "Desenvolvimento das funcionalidades principais do sistema",
    "Criação da interface responsiva e melhorias de UX",
    "Implementação de recursos avançados específicos do projeto",
    "Desenvolvimento da API REST e integração com frontend",
    "Testes automatizados, correção de bugs e otimizações",
    "Finalização da documentação e preparação da apresentação",
    "Apresentação final e defesa do projeto"
  ];
  return descriptions[weekNumber - 1] || "Atividades da semana";
}

function getWeekDeliverable(weekNumber: number): string {
  const deliverables = [
    "Protótipo navegável e documentação inicial",
    "Documentação técnica completa",
    "Base do sistema funcionando",
    "Sistema de usuários completo",
    "Funcionalidades principais implementadas",
    "Interface completa e responsiva",
    "Recursos avançados implementados",
    "API REST documentada e funcional",
    "Sistema testado e refinado",
    "Documentação completa e apresentação",
    "Apresentação e defesa do projeto"
  ];
  return deliverables[weekNumber - 1] || "Entregável da semana";
}
