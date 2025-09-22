import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { type Notification } from "@shared/schema";

export default function Navbar() {
  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ["/api/notifications"],
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary text-primary-foreground shadow-lg" data-testid="navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold" data-testid="navbar-title">
                SENAI - Desenvolvimento de Sistemas
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Button 
                variant="ghost" 
                size="sm"
                className="flex items-center space-x-2 bg-primary-foreground/10 hover:bg-primary-foreground/20"
                data-testid="notification-button"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="bg-secondary text-white text-xs px-2 py-1 rounded-full" data-testid="notification-count">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </div>
            
            <div className="flex items-center space-x-2" data-testid="user-info">
              <User className="w-5 h-5" />
              <span>Estudante</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
