import { Bell, Settings, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth-context";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { type Notification } from "@shared/schema";

export default function Navbar() {
  const auth = useAuth();
  const [, setLocation] = useLocation();

  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ["/api/notifications"],
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleLogout = () => {
    auth.logout();
    setLocation("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b h-16 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold">SENAI Projetos</h1>
        {auth.user && (
          <Badge variant={auth.user.type === "professor" ? "default" : "secondary"} data-testid="user-type-badge">
            {auth.user.type === "professor" ? "Professor" : "Estudante"}
          </Badge>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <Button 
            variant="ghost" 
            size="icon"
            data-testid="notification-button"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-5 w-5 text-xs flex items-center justify-center p-0" 
                data-testid="notification-count"
              >
                {unreadCount}
              </Badge>
            )}
          </Button>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative" data-testid="button-user-menu">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel data-testid="user-name">
              {auth.user?.name}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Configurações
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} data-testid="button-logout">
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
