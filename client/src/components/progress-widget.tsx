import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface WeekProgress {
  week: number;
  progress: number;
  status: 'completed' | 'current' | 'pending';
}

export default function ProgressWidget() {
  const weeklyProgress: WeekProgress[] = [
    { week: 1, progress: 100, status: 'completed' },
    { week: 2, progress: 75, status: 'current' },
    { week: 3, progress: 0, status: 'pending' },
  ];

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-accent';
      case 'current':
        return 'bg-secondary';
      default:
        return 'bg-muted';
    }
  };

  return (
    <Card data-testid="progress-widget">
      <CardHeader>
        <CardTitle className="text-primary" data-testid="progress-widget-title">
          Progresso Semanal
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {weeklyProgress.map((item) => (
          <div key={item.week} data-testid={`progress-week-${item.week}`}>
            <div className="flex justify-between mb-2">
              <span className="text-sm" data-testid={`progress-week-label-${item.week}`}>
                Semana {item.week}
              </span>
              <span 
                className={`text-sm ${
                  item.status === 'completed' ? 'text-accent' :
                  item.status === 'current' ? 'text-secondary' :
                  'text-muted-foreground'
                }`}
                data-testid={`progress-percentage-${item.week}`}
              >
                {item.progress}%
              </span>
            </div>
            <Progress 
              value={item.progress} 
              className="h-2"
              data-testid={`progress-bar-${item.week}`}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
