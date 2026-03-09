import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { StatisticsCardProps } from '@/types/component-props';
import { BarChart3, Calendar, TrendingUp } from 'lucide-react';
import { memo } from 'react';

function FormatDate(date_string: string | null): string {
  if (!date_string) return 'Never';
  const date = new Date(date_string);
  if (isNaN(date.getTime())) return 'Never';
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export const StatisticsCard = memo(function StatisticsCard({
  statistics
}: StatisticsCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <BarChart3 className="h-4 w-4" />
          Statistics
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="space-y-4 pt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-muted-foreground flex items-center gap-1 text-xs">
              <TrendingUp className="h-3 w-3" />
              Total Count
            </p>
            <p className="text-2xl font-bold">{statistics.total_count}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground flex items-center gap-1 text-xs">
              <Calendar className="h-3 w-3" />
              Last Updated
            </p>
            <p className="text-sm font-medium">
              {FormatDate(statistics.last_date)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
