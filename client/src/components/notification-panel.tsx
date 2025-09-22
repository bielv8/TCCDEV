import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Notification } from "@shared/schema";

interface NotificationPanelProps {
  notifications: Notification[];
}

export default function NotificationPanel({ notifications }: NotificationPanelProps) {
  const getNotificationDotClass = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'notification-dot high';
      case 'medium':
        return 'notification-dot medium';
      default:
        return 'notification-dot low';
    }
  };

  const getNotificationTypeText = (type: string) => {
    switch (type) {
      case 'deadline':
        return 'Entrega próxima';
      case 'feedback':
        return 'Feedback disponível';
      case 'announcement':
        return 'Nova orientação';
      default:
        return 'Notificação';
    }
  };

  return (
    <Card data-testid="notification-panel">
      <CardHeader>
        <CardTitle className="text-primary" data-testid="notification-panel-title">
          Notificações Recentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4" data-testid="notification-list">
          {notifications.slice(0, 3).map((notification) => (
            <div 
              key={notification.id} 
              className="flex items-start space-x-3"
              data-testid={`notification-${notification.id}`}
            >
              <div 
                className={`${getNotificationDotClass(notification.priority || 'low')} mt-2`}
                data-testid={`notification-dot-${notification.id}`}
              />
              <div>
                <p className="text-sm font-medium" data-testid={`notification-title-${notification.id}`}>
                  {notification.title}
                </p>
                <p className="text-xs text-muted-foreground" data-testid={`notification-message-${notification.id}`}>
                  {notification.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
