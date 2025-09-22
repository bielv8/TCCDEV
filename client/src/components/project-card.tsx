import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type Project } from "@shared/schema";
import { 
  TrendingUp, 
  Edit3, 
  Heart, 
  BookOpen, 
  Briefcase, 
  Calendar, 
  Star, 
  Zap 
} from "lucide-react";

interface ProjectCardProps {
  project: Project;
}

const projectIcons = {
  1: TrendingUp,
  2: Edit3,
  3: Heart,
  4: BookOpen,
  5: Briefcase,
  6: Calendar,
  7: Star,
  8: Zap,
};

export default function ProjectCard({ project }: ProjectCardProps) {
  const Icon = projectIcons[project.theme as keyof typeof projectIcons] || BookOpen;

  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="project-card" data-testid={`project-card-${project.theme}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Icon className="w-8 h-8 text-primary" data-testid={`project-icon-${project.theme}`} />
            <Badge variant="outline" className="bg-primary/10 text-primary" data-testid={`project-badge-${project.theme}`}>
              Tema {project.theme}
            </Badge>
          </div>
          
          <h3 className="font-semibold text-lg mb-2" data-testid={`project-title-${project.theme}`}>
            {project.title.split(' ').slice(0, 3).join(' ')}
            {project.title.split(' ').length > 3 && '...'}
          </h3>
          
          <p className="text-sm text-muted-foreground line-clamp-3" data-testid={`project-description-${project.theme}`}>
            {project.description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
