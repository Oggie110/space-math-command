import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PlayerStats } from '@/types/game';
import { AlertCircle } from 'lucide-react';

interface WeakAreasDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stats: PlayerStats;
}

export const WeakAreasDialog = ({ open, onOpenChange, stats }: WeakAreasDialogProps) => {
  const weakAreasList = Object.entries(stats.weakAreas)
    .map(([pair, count]) => ({ pair, count }))
    .sort((a, b) => b.count - a.count);

  const getDifficultyColor = (count: number) => {
    if (count >= 5) return 'text-destructive';
    if (count >= 3) return 'text-warning';
    return 'text-success';
  };

  const getDifficultyLabel = (count: number) => {
    if (count >= 5) return 'Needs lots of practice';
    if (count >= 3) return 'Getting better';
    return 'Almost there';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-primary" />
            Areas You're Practicing
          </DialogTitle>
          <DialogDescription>
            Focus on these multiplication pairs to improve your skills
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-2 max-h-[400px] overflow-y-auto">
          {weakAreasList.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Great job! No weak areas yet.</p>
              <p className="text-sm mt-2">Keep practicing to maintain your skills!</p>
            </div>
          ) : (
            weakAreasList.map(({ pair, count }) => (
              <div
                key={pair}
                className="flex items-center justify-between p-3 bg-card/50 border border-border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className={`text-2xl font-bold ${getDifficultyColor(count)}`}>
                    {pair.replace('x', ' × ')}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${getDifficultyColor(count)}`}>
                    {getDifficultyLabel(count)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Missed {count} {count === 1 ? 'time' : 'times'}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
