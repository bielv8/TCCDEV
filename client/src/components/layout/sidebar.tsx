import { Link, useLocation } from "wouter";
import { Home, Folder, Calendar, Users, Clipboard } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { type Professor } from "@shared/schema";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Projetos", href: "/projects", icon: Folder },
  { name: "Cronograma", href: "/schedule", icon: Calendar },
  { name: "Professores", href: "/professors", icon: Users },
  { name: "Entregáveis", href: "/deliverables", icon: Clipboard },
];

export default function Sidebar() {
  const [location] = useLocation();
  const { data: professors = [] } = useQuery<Professor[]>({
    queryKey: ["/api/professors"],
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  const getAvatarColor = (index: number) => {
    const colors = ['bg-primary', 'bg-secondary', 'bg-accent'];
    return colors[index % colors.length];
  };

  return (
    <div className="w-64 bg-card shadow-lg overflow-y-auto border-r border-border" data-testid="sidebar">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-primary mb-4" data-testid="sidebar-title">
          Menu Principal
        </h2>
        <nav className="space-y-2" data-testid="sidebar-navigation">
          {navigation.map((item) => {
            const isActive = location === item.href || 
                           (item.href === "/" && location === "/") ||
                           (item.href !== "/" && location.startsWith(item.href));
            
            return (
              <Link key={item.name} href={item.href}>
                <div className={`sidebar-item ${isActive ? 'active' : ''}`} data-testid={`nav-link-${item.name.toLowerCase()}`}>
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
      
      {/* Professor Info */}
      <div className="p-6 border-t border-border" data-testid="professors-info">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Professores
        </h3>
        <div className="space-y-3">
          {professors.map((professor, index) => (
            <div key={professor.id} className="flex items-center space-x-3" data-testid={`professor-info-${professor.id}`}>
              <Avatar className="w-8 h-8">
                <AvatarFallback className={`text-sm font-medium text-white ${getAvatarColor(index)}`}>
                  {getInitials(professor.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium" data-testid={`professor-name-${professor.id}`}>
                  {professor.name}
                </p>
                <p className="text-xs text-muted-foreground" data-testid={`professor-specialty-${professor.id}`}>
                  {professor.specialty}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
