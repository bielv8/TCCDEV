import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { formatDate } from "@/lib/date-utils";

interface TimelineItem {
  week: number;
  title: string;
  status: 'completed' | 'current' | 'pending';
  startDate: Date;
  endDate: Date;
  tasks: string[];
  deliverable: string;
  evaluation: string;
}

export default function Timeline() {
  // Sample timeline data - in real app this would come from API
  const timelineItems: TimelineItem[] = [
    {
      week: 1,
      title: "Planejamento Inicial",
      status: "completed",
      startDate: new Date('2025-09-23'),
      endDate: new Date('2025-09-29'),
      tasks: [
        "Escolha do tema do projeto",
        "Análise de requisitos funcionais",
        "Definição da arquitetura inicial",
        "Prototipação UI/UX no Figma"
      ],
      deliverable: "Protótipo navegável e documentação inicial",
      evaluation: "Conceito (0-10)"
    },
    {
      week: 2,
      title: "Documentação Técnica",
      status: "current",
      startDate: new Date('2025-09-30'),
      endDate: new Date('2025-10-06'),
      tasks: [
        "Diagrama de entidades (DER)",
        "Casos de uso detalhados",
        "Manual de instalação",
        "Estrutura inicial do projeto Django"
      ],
      deliverable: "Documentação técnica completa",
      evaluation: "Documentação (0-10)"
    },
    {
      week: 3,
      title: "Configuração e Models",
      status: "pending",
      startDate: new Date('2025-10-07'),
      endDate: new Date('2025-10-13'),
      tasks: [
        "Configuração do ambiente Django",
        "Criação dos models principais",
        "Configuração do banco PostgreSQL",
        "Migrações e fixtures iniciais"
      ],
      deliverable: "Base do sistema funcionando",
      evaluation: "Implementação (0-10)"
    }
  ];

  return (
    <Card data-testid="timeline-card">
      <CardHeader>
        <CardTitle className="text-xl text-primary" data-testid="timeline-title">
          Cronograma de Desenvolvimento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6" data-testid="timeline-items">
          {timelineItems.map((item) => (
            <div key={item.week} className="timeline-item pl-10" data-testid={`timeline-item-${item.week}`}>
              <div 
                className="absolute left-3 w-4 h-4 rounded-full border-2 border-white shadow-md z-10"
                style={{
                  backgroundColor: item.status === 'completed' ? 'hsl(158, 64%, 52%)' :
                                 item.status === 'current' ? 'hsl(15, 90%, 60%)' :
                                 'hsl(210, 40%, 96%)'
                }}
                data-testid={`timeline-dot-${item.week}`}
              />
              
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold" data-testid={`timeline-week-title-${item.week}`}>
                  Semana {item.week} - {item.title}
                </h3>
                <Badge 
                  className={`week-status ${item.status}`}
                  data-testid={`timeline-status-${item.week}`}
                >
                  {item.status === 'completed' ? 'Concluída' : 
                   item.status === 'current' ? 'Em Andamento' : 'Pendente'}
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground mb-2" data-testid={`timeline-dates-${item.week}`}>
                {formatDate(item.startDate)} - {formatDate(item.endDate)}
              </p>
              
              <ul className="text-sm space-y-1 mb-3" data-testid={`timeline-tasks-${item.week}`}>
                {item.tasks.map((task, index) => (
                  <li key={index}>• {task}</li>
                ))}
              </ul>
              
              <div className="bg-muted px-3 py-2 rounded text-sm mb-2" data-testid={`timeline-deliverable-${item.week}`}>
                <strong>Entregável:</strong> {item.deliverable}
              </div>
              
              <div data-testid={`timeline-evaluation-${item.week}`}>
                <Badge variant="outline" className="text-xs">
                  Avaliação: {item.evaluation}
                </Badge>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <Button 
            variant="ghost" 
            className="text-primary hover:underline text-sm"
            data-testid="view-full-schedule-button"
          >
            Ver cronograma completo
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
