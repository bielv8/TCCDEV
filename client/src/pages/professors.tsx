import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Users, BookOpen } from "lucide-react";
import { type Professor } from "@shared/schema";

export default function Professors() {
  const { data: professors = [], isLoading } = useQuery<Professor[]>({
    queryKey: ["/api/professors"],
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  const getAvatarColor = (index: number) => {
    const colors = [
      'bg-primary text-primary-foreground',
      'bg-secondary text-secondary-foreground', 
      'bg-accent text-accent-foreground'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="p-6" data-testid="professors-container">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2" data-testid="professors-title">
          Corpo Docente
        </h1>
        <p className="text-muted-foreground" data-testid="professors-subtitle">
          Conheça os professores responsáveis pelos projetos acadêmicos
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card data-testid="stat-total-professors">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Professores</p>
                <p className="text-2xl font-bold text-primary">{professors.length}</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card data-testid="stat-specialties">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Especialidades</p>
                <p className="text-2xl font-bold text-secondary">8</p>
              </div>
              <BookOpen className="w-8 h-8 text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card data-testid="stat-projects">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Temas de Projeto</p>
                <p className="text-2xl font-bold text-accent">8</p>
              </div>
              <Mail className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Professors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8" data-testid="professors-grid">
        {professors.map((professor, index) => (
          <Card key={professor.id} className="overflow-hidden" data-testid={`professor-card-${professor.id}`}>
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <Avatar className="w-20 h-20">
                  <AvatarFallback className={`text-lg font-bold ${getAvatarColor(index)}`}>
                    {getInitials(professor.name)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-xl" data-testid={`professor-${professor.id}-name`}>
                {professor.name}
              </CardTitle>
              <CardDescription className="text-base" data-testid={`professor-${professor.id}-specialty`}>
                {professor.specialty}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Expertise */}
              <div>
                <h4 className="font-semibold mb-2 text-sm">Áreas de Expertise</h4>
                <div className="flex flex-wrap gap-1" data-testid={`professor-${professor.id}-expertise`}>
                  {(professor.expertise as string[]).map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Responsibility */}
              <div>
                <h4 className="font-semibold mb-2 text-sm">Responsabilidades</h4>
                <p className="text-sm text-muted-foreground" data-testid={`professor-${professor.id}-responsibility`}>
                  {getResponsibilities(professor.specialty)}
                </p>
              </div>

              {/* Contact */}
              {professor.email && (
                <div className="pt-4 border-t">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    data-testid={`professor-${professor.id}-email`}
                    onClick={() => window.open(`mailto:${professor.email}`, '_blank')}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Contato
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Information */}
      <Card className="mt-8" data-testid="additional-info-card">
        <CardHeader>
          <CardTitle>Orientação e Suporte</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Horários de Orientação</h4>
            <p className="text-sm text-muted-foreground">
              Os professores estão disponíveis para orientação individual e em grupo durante o desenvolvimento dos projetos. 
              Agende sua sessão através dos canais oficiais da escola.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Metodologia de Avaliação</h4>
            <p className="text-sm text-muted-foreground">
              A avaliação dos projetos é contínua e considera os entregáveis semanais, a participação nas orientações, 
              a qualidade técnica da implementação e a apresentação final.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Recursos de Apoio</h4>
            <p className="text-sm text-muted-foreground">
              Além das orientações presenciais, os estudantes têm acesso a materiais complementares, 
              tutoriais técnicos e sessões de dúvidas coletivas.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function getResponsibilities(specialty: string): string {
  const responsibilities: Record<string, string> = {
    "Back-end & APIs": "Responsável pela orientação em arquitetura de software, desenvolvimento de APIs REST, integração com bancos de dados e boas práticas de desenvolvimento back-end.",
    "Front-end & UI/UX": "Especialista em desenvolvimento de interfaces de usuário, experiência do usuário, design responsivo e tecnologias front-end modernas.",
    "Banco de Dados & Arquitetura": "Focado na modelagem de dados, otimização de performance, arquitetura de sistemas e gestão de bancos de dados relacionais."
  };
  
  return responsibilities[specialty] || "Orientação geral em desenvolvimento de software.";
}
