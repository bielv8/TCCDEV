import { type Project, type InsertProject, type WeeklySchedule, type InsertWeeklySchedule, type Professor, type InsertProfessor, type Notification, type InsertNotification } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Projects
  getProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  
  // Weekly Schedule
  getWeeklySchedule(projectId: string): Promise<WeeklySchedule[]>;
  getWeeklyScheduleItem(id: string): Promise<WeeklySchedule | undefined>;
  createWeeklyScheduleItem(schedule: InsertWeeklySchedule): Promise<WeeklySchedule>;
  updateWeeklyScheduleStatus(id: string, status: "pending" | "current" | "completed"): Promise<WeeklySchedule | undefined>;
  
  // Professors
  getProfessors(): Promise<Professor[]>;
  getProfessor(id: string): Promise<Professor | undefined>;
  createProfessor(professor: InsertProfessor): Promise<Professor>;
  
  // Notifications
  getNotifications(): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: string): Promise<Notification | undefined>;
}

export class MemStorage implements IStorage {
  private projects: Map<string, Project>;
  private weeklySchedules: Map<string, WeeklySchedule>;
  private professors: Map<string, Professor>;
  private notifications: Map<string, Notification>;

  constructor() {
    this.projects = new Map();
    this.weeklySchedules = new Map();
    this.professors = new Map();
    this.notifications = new Map();
    this.initializeData();
  }

  private initializeData() {
    // Initialize professors
    const professorsData = [
      {
        name: "Gabriel Eduardo",
        specialty: "Back-end & APIs",
        expertise: ["Django", "REST APIs", "PostgreSQL", "Arquitetura de Software"],
        email: "gabriel.eduardo@senai.br"
      },
      {
        name: "Guilherme Franco", 
        specialty: "Front-end & UI/UX",
        expertise: ["React", "JavaScript", "CSS", "Design System", "Prototipação"],
        email: "guilherme.franco@senai.br"
      },
      {
        name: "Silvano",
        specialty: "Banco de Dados & Arquitetura",
        expertise: ["PostgreSQL", "Modelagem de Dados", "Performance", "Arquitetura"],
        email: "silvano@senai.br"
      }
    ];

    professorsData.forEach(prof => {
      this.createProfessor(prof);
    });

    // Initialize projects with all 8 themes
    const projectsData = [
      {
        title: "Plataforma de Análise de Dados de Redes Sociais",
        description: "Sistema completo de Social Media Analytics com coleta em tempo real, análise de sentimentos usando NLP, identificação de tendências e sistema de alertas automáticos.",
        theme: 1,
        context: "Empresas e marcas precisam monitorar sua presença digital e compreender a percepção do público nas redes sociais. Atualmente, muitas utilizam planilhas ou ferramentas isoladas, sem automação nem análise inteligente.",
        problem: "O desafio para os alunos será desenvolver uma plataforma completa de análise de redes sociais, capaz de coletar dados em tempo real, analisar sentimentos, identificar tendências e gerar alertas, simulando um sistema profissional de Social Media Analytics.",
        architecture: {
          backend: "Django + Django REST Framework + Django Channels + Celery + Redis",
          database: "PostgreSQL",
          frontend: "HTML, CSS, JavaScript + Bootstrap/Tailwind"
        },
        technologies: ["django", "djangorestframework", "django-channels", "celery", "redis", "tweepy", "textblob", "nltk"],
        modules: ["Integração com Redes Sociais", "Coleta de Dados em Tempo Real", "Análise de Sentimentos", "Identificação de Tendências", "Dashboard Interativo", "Sistema de Alertas"],
        deliverables: ["Prototipação UI/UX", "Documentação Técnica e Funcional", "Projeto Django Funcional", "Apresentação Final"]
      },
      {
        title: "Portal de Notícias Comunitárias Colaborativo",
        description: "Portal completo para comunidades locais com sistema de publicação, comentários moderados, integração com mapas e API para aplicativos móveis.",
        theme: 2,
        context: "A comunidade local não possui um espaço centralizado para divulgação de notícias, eventos e informações importantes, dificultando a comunicação e engajamento entre moradores e órgãos locais.",
        problem: "O desafio dos alunos será criar um portal de notícias completo, permitindo publicação de artigos, comentários moderados, integração com mapas e API para apps mobile.",
        architecture: {
          backend: "Django + Django REST Framework",
          database: "PostgreSQL",
          frontend: "HTML, CSS, JavaScript + Bootstrap/Tailwind"
        },
        technologies: ["django", "django-rest-framework", "django-taggit", "django-summernote", "pillow", "folium", "geopy"],
        modules: ["Gestão de Usuários", "Publicação de Artigos", "Sistema de Comentários", "Destaques do Dia", "Mapas e Geolocalização", "API REST"],
        deliverables: ["Prototipação UI/UX", "Documentação Técnica e Funcional", "Projeto Django Funcional", "Apresentação Final"]
      },
      {
        title: "Sistema Completo de Clínica Médica (Morvan HealthCare)",
        description: "Sistema integrado para clínicas com agendamento online, prontuários digitais, emissão de receitas em PDF e dashboards analíticos.",
        theme: 3,
        context: "Muitas clínicas ainda utilizam papel ou sistemas fragmentados, dificultando o gerenciamento de pacientes, agendas, prontuários e relatórios.",
        problem: "O desafio dos alunos será criar um sistema integrado, onde pacientes, médicos, recepcionistas e administradores possam interagir de forma eficiente, com agendamento online, prontuários digitais e relatórios completos, simulando um ambiente de clínica real.",
        architecture: {
          backend: "Django + Django REST Framework + Django Allauth + Django Crispy Forms + Django Filter",
          database: "PostgreSQL",
          frontend: "HTML, CSS, JavaScript + Bootstrap/Tailwind"
        },
        technologies: ["django", "djangorestframework", "reportlab", "django-crispy-forms", "django-filter", "django-allauth", "pandas", "matplotlib", "psycopg2"],
        modules: ["Gestão de Usuários", "Agendamento Online", "Área do Paciente", "Área do Médico", "Área da Recepção", "Relatórios e Dashboards", "API REST"],
        deliverables: ["Prototipação UI/UX", "Documentação Técnica e Funcional", "Projeto Django Funcional", "Apresentação Final"]
      },
      {
        title: "Sistema de Gestão Escolar Avançado (SENAI School Manager)",
        description: "Plataforma escolar completa com dashboards específicos para cada perfil de usuário, integração com relatórios e exportação de dados acadêmicos.",
        theme: 4,
        context: "Muitas instituições de ensino ainda utilizam sistemas separados para matrículas, notas, frequência e relatórios, o que gera retrabalho, erros e demora na gestão escolar.",
        problem: "A Escola SENAI precisa de um sistema integrado que permita que alunos, professores, secretaria e coordenação tenham acesso a um mesmo ambiente de forma prática e segura. O desafio dos alunos será desenvolver uma plataforma escolar completa, com dashboards específicos para cada perfil de usuário, integração com relatórios e exportação de dados acadêmicos.",
        architecture: {
          backend: "Django + Django REST Framework",
          database: "PostgreSQL",
          frontend: "HTML, CSS, JavaScript + Bootstrap/Tailwind"
        },
        technologies: ["django", "djangorestframework", "django-crispy-forms", "django-filter", "reportlab", "django-import-export", "openpyxl", "psycopg2"],
        modules: ["Gestão de Usuários e Perfis", "Cadastro Escolar", "Gestão Acadêmica", "Dashboards Específicos", "Relatórios e Exportações", "API REST"],
        deliverables: ["Prototipação UI/UX", "Documentação Técnica e Funcional", "Projeto Django Funcional", "Apresentação Final"]
      },
      {
        title: "Plataforma de Vagas e Recrutamento Inteligente",
        description: "Plataforma de vagas inteligente que centraliza empresas, candidatos, vagas e utiliza algoritmos simples de matching para sugerir candidatos ou oportunidades automaticamente.",
        theme: 5,
        context: "Empresas locais enfrentam dificuldade em encontrar candidatos qualificados e estudantes/profissionais têm dificuldade em identificar oportunidades compatíveis.",
        problem: "O desafio dos alunos será criar uma plataforma de vagas inteligente, que centralize empresas, candidatos, vagas e que utilize algoritmos simples de matching para sugerir candidatos ou oportunidades automaticamente.",
        architecture: {
          backend: "Django + Django REST Framework",
          database: "PostgreSQL",
          frontend: "HTML, CSS, JavaScript + Bootstrap/Tailwind"
        },
        technologies: ["django", "djangorestframework", "django-crispy-forms", "django-filter", "pillow", "scikit-learn", "nltk", "psycopg2"],
        modules: ["Autenticação de Usuários", "Cadastro e Publicação de Vagas", "Sistema de Candidaturas", "Algoritmo de Matching", "Relatórios e Estatísticas", "API REST"],
        deliverables: ["Prototipação UI/UX", "Documentação Técnica e Funcional", "Projeto Django Funcional", "Apresentação Final"]
      },
      {
        title: "Plataforma de Eventos Acadêmicos",
        description: "Plataforma que centraliza todo o gerenciamento de eventos, permitindo emissão de certificados, avaliação de participantes e organização de fotos/documentação dos eventos.",
        theme: 6,
        context: "A escola realiza diversos eventos acadêmicos, palestras e workshops, mas atualmente não possui um sistema único para gerenciar inscrições, certificados, avaliações e registro de participantes.",
        problem: "O desafio dos alunos será criar uma plataforma que centralize todo o gerenciamento de eventos, permitindo emissão de certificados, avaliação de participantes e organização de fotos/documentação dos eventos.",
        architecture: {
          backend: "Django + Django REST Framework",
          database: "PostgreSQL",
          frontend: "HTML, CSS, JavaScript + Bootstrap/Tailwind"
        },
        technologies: ["django", "django-phonenumber-field", "django-qrcode", "python-decouple", "djangorestframework", "pillow", "psycopg2"],
        modules: ["Gestão de Usuários", "Cadastro e Gerenciamento de Eventos", "Sistema de Inscrição", "Emissão de Certificados", "Avaliação dos Eventos", "Galeria de Fotos"],
        deliverables: ["Prototipação UI/UX", "Documentação Técnica e Funcional", "Projeto Django Funcional", "Apresentação Final"]
      },
      {
        title: "Sistema de Avaliação de Professores",
        description: "Sistema seguro e confiável para que os alunos possam avaliar o desempenho dos professores de forma anônima, garantindo métricas, dashboards e relatórios comparativos.",
        theme: 7,
        context: "A escola precisa de uma forma estruturada e anônima para que os alunos possam avaliar o desempenho dos professores, permitindo que a coordenação identifique pontos fortes, oportunidades de melhoria e ofereça suporte pedagógico adequado.",
        problem: "O desafio dos alunos será criar um sistema seguro e confiável, garantindo anonimato, métricas, dashboards e relatórios comparativos.",
        architecture: {
          backend: "Django + Django REST Framework + Django Guardian",
          database: "PostgreSQL",
          frontend: "HTML, CSS, JavaScript + Bootstrap/Tailwind"
        },
        technologies: ["django", "django-chartjs", "django-anonymizer", "django-guardian", "djangorestframework", "psycopg2"],
        modules: ["Gestão de Usuários", "Questionários de Avaliação", "Dashboards", "Relatórios", "API REST"],
        deliverables: ["Prototipação UI/UX", "Documentação Técnica e Funcional", "Projeto Django Funcional", "Apresentação Final"]
      },
      {
        title: "Sistema de Gestão Acadêmica Inteligente",
        description: "Plataforma completa e analítica que combina gestão acadêmica, dashboards interativos e alertas automáticos, com análise preditiva para identificar riscos de evasão.",
        theme: 8,
        context: "A escola necessita de um sistema acadêmico integrado, capaz de gerenciar alunos, turmas, notas e frequência, e ainda prever possíveis riscos de evasão utilizando análise preditiva.",
        problem: "O desafio para os alunos será criar uma plataforma completa e analítica, que combine gestão acadêmica, dashboards interativos e alertas automáticos, simulando um sistema inteligente pronto para uso real.",
        architecture: {
          backend: "Django + Django REST Framework + Celery + Redis",
          database: "PostgreSQL",
          frontend: "HTML, CSS, JavaScript + Bootstrap/Tailwind"
        },
        technologies: ["django", "djangorestframework", "pandas", "scikit-learn", "celery", "redis", "matplotlib", "reportlab", "django-filter", "psycopg2"],
        modules: ["Gestão de Usuários e Perfis", "Cadastro Acadêmico Completo", "Dashboard Analítico", "Módulo Preditivo", "Alertas Automáticos", "API REST", "Relatórios Personalizados"],
        deliverables: ["Prototipação UI/UX", "Documentação Técnica e Funcional", "Projeto Django Funcional", "Apresentação Final"]
      }
    ];

    projectsData.forEach(project => {
      const createdProject = this.createProject(project);
      this.createWeeklyScheduleForProject(createdProject.then(p => p.id));
    });

    // Initialize sample notifications
    const notificationsData = [
      {
        title: "Entrega próxima",
        message: "Documentação técnica em 3 dias",
        type: "deadline" as const,
        priority: "high" as const,
        isRead: false
      },
      {
        title: "Feedback disponível",
        message: "Prototipação UI/UX avaliada",
        type: "feedback" as const,
        priority: "medium" as const,
        isRead: false
      },
      {
        title: "Nova orientação",
        message: "Prof. Gabriel - Arquitetura de APIs",
        type: "announcement" as const,
        priority: "medium" as const,
        isRead: false
      }
    ];

    notificationsData.forEach(notification => {
      this.createNotification(notification);
    });
  }

  private async createWeeklyScheduleForProject(projectIdPromise: Promise<string>) {
    const projectId = await projectIdPromise;
    const startDate = new Date('2025-09-23');
    
    const weeks = [
      {
        title: "Planejamento Inicial",
        tasks: ["Escolha do tema do projeto", "Análise de requisitos funcionais", "Definição da arquitetura inicial", "Prototipação UI/UX no Figma"],
        deliverable: "Protótipo navegável e documentação inicial",
        evaluationCriteria: ["Clareza na definição do escopo", "Qualidade do protótipo", "Viabilidade técnica", "Documentação de requisitos"]
      },
      {
        title: "Documentação Técnica",
        tasks: ["Diagrama de entidades (DER)", "Casos de uso detalhados", "Manual de instalação", "Estrutura inicial do projeto Django"],
        deliverable: "Documentação técnica completa",
        evaluationCriteria: ["DER bem estruturado", "Casos de uso detalhados", "Manual claro", "Setup funcional"]
      },
      {
        title: "Configuração e Models",
        tasks: ["Configuração do ambiente Django", "Criação dos models principais", "Configuração do banco PostgreSQL", "Migrações e fixtures iniciais"],
        deliverable: "Base do sistema funcionando",
        evaluationCriteria: ["Models bem definidos", "Banco configurado", "Migrações funcionais", "Estrutura organizada"]
      },
      {
        title: "Autenticação e Usuários",
        tasks: ["Sistema de autenticação", "Diferentes perfis de usuário", "Controle de permissões", "Interface de login"],
        deliverable: "Sistema de usuários completo",
        evaluationCriteria: ["Autenticação segura", "Perfis bem definidos", "Permissões funcionais", "Interface intuitiva"]
      },
      {
        title: "Funcionalidades Core",
        tasks: ["Implementação das funcionalidades principais", "CRUD básico", "Interfaces administrativas", "Validações de dados"],
        deliverable: "Funcionalidades principais implementadas",
        evaluationCriteria: ["CRUD funcional", "Validações adequadas", "Interface administrativa", "Código organizado"]
      },
      {
        title: "Interface e UX",
        tasks: ["Templates responsivos", "CSS avançado", "JavaScript interativo", "Melhorias de UX"],
        deliverable: "Interface completa e responsiva",
        evaluationCriteria: ["Design responsivo", "UX intuitiva", "Interatividade", "Consistência visual"]
      },
      {
        title: "Funcionalidades Avançadas",
        tasks: ["Recursos específicos do projeto", "Integrações externas", "Funcionalidades premium", "Otimizações"],
        deliverable: "Recursos avançados implementados",
        evaluationCriteria: ["Funcionalidades únicas", "Integrações funcionais", "Performance", "Inovação"]
      },
      {
        title: "API e Integração",
        tasks: ["API REST completa", "Documentação da API", "Testes automatizados", "Integração com frontend"],
        deliverable: "API REST documentada e funcional",
        evaluationCriteria: ["API bem estruturada", "Documentação clara", "Testes passando", "Integração correta"]
      },
      {
        title: "Testes e Qualidade",
        tasks: ["Testes unitários", "Testes de integração", "Correção de bugs", "Refatoração de código"],
        deliverable: "Sistema testado e refinado",
        evaluationCriteria: ["Cobertura de testes", "Bugs corrigidos", "Código limpo", "Performance otimizada"]
      },
      {
        title: "Documentação Final",
        tasks: ["Manual do usuário", "Guia de instalação", "Documentação técnica", "Preparação da apresentação"],
        deliverable: "Documentação completa e apresentação",
        evaluationCriteria: ["Manual completo", "Guia claro", "Documentação técnica", "Apresentação preparada"]
      },
      {
        title: "Apresentação Final",
        tasks: ["Demo ao vivo", "Defesa do projeto", "Entrega final", "Autoavaliação"],
        deliverable: "Apresentação e defesa do projeto",
        evaluationCriteria: ["Qualidade da apresentação", "Demonstração funcional", "Conhecimento técnico", "Capacidade de defesa"]
      }
    ];

    weeks.forEach((week, index) => {
      const weekStart = new Date(startDate.getTime() + index * 7 * 24 * 60 * 60 * 1000);
      const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000);
      
      this.createWeeklyScheduleItem({
        projectId,
        weekNumber: index + 1,
        title: week.title,
        startDate: weekStart,
        endDate: weekEnd,
        tasks: week.tasks,
        deliverable: week.deliverable,
        evaluationCriteria: week.evaluationCriteria,
        status: (index === 0 ? "completed" : index === 1 ? "current" : "pending") as "pending" | "current" | "completed"
      });
    });
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const project: Project = { 
      ...insertProject, 
      id, 
      createdAt: new Date() 
    };
    this.projects.set(id, project);
    return project;
  }

  // Weekly Schedule
  async getWeeklySchedule(projectId: string): Promise<WeeklySchedule[]> {
    return Array.from(this.weeklySchedules.values())
      .filter(schedule => schedule.projectId === projectId)
      .sort((a, b) => a.weekNumber - b.weekNumber);
  }

  async getWeeklyScheduleItem(id: string): Promise<WeeklySchedule | undefined> {
    return this.weeklySchedules.get(id);
  }

  async createWeeklyScheduleItem(schedule: InsertWeeklySchedule): Promise<WeeklySchedule> {
    const id = randomUUID();
    const weeklySchedule: WeeklySchedule = { 
      ...schedule, 
      id,
      status: schedule.status || "pending",
      projectId: schedule.projectId || null
    };
    this.weeklySchedules.set(id, weeklySchedule);
    return weeklySchedule;
  }

  async updateWeeklyScheduleStatus(id: string, status: "pending" | "current" | "completed"): Promise<WeeklySchedule | undefined> {
    const schedule = this.weeklySchedules.get(id);
    if (schedule) {
      schedule.status = status;
      this.weeklySchedules.set(id, schedule);
    }
    return schedule;
  }

  // Professors
  async getProfessors(): Promise<Professor[]> {
    return Array.from(this.professors.values());
  }

  async getProfessor(id: string): Promise<Professor | undefined> {
    return this.professors.get(id);
  }

  async createProfessor(professor: InsertProfessor): Promise<Professor> {
    const id = randomUUID();
    const prof: Professor = { 
      ...professor, 
      id,
      avatar: professor.avatar || null,
      email: professor.email || null
    };
    this.professors.set(id, prof);
    return prof;
  }

  // Notifications
  async getNotifications(): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const id = randomUUID();
    const notif: Notification = { 
      ...notification, 
      id, 
      createdAt: new Date(),
      priority: notification.priority || "medium",
      isRead: notification.isRead || false
    };
    this.notifications.set(id, notif);
    return notif;
  }

  async markNotificationAsRead(id: string): Promise<Notification | undefined> {
    const notification = this.notifications.get(id);
    if (notification) {
      notification.isRead = true;
      this.notifications.set(id, notification);
    }
    return notification;
  }
}

export const storage = new MemStorage();
