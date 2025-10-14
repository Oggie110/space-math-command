import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CelestialBody } from '@/types/game';
import { Sparkles } from 'lucide-react';

interface PlanetFactModalProps {
  body: CelestialBody;
  open: boolean;
  onContinue: () => void;
}

export const PlanetFactModal = ({ body, open, onContinue }: PlanetFactModalProps) => {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl bg-card/95 backdrop-blur-sm border-2 border-primary">
        <div className="text-center space-y-6 py-6">
          <div className="animate-float">
            <div className="text-8xl mb-4">{body.emoji}</div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-primary animate-glow-pulse" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {body.name} Unlocked!
              </h2>
              <Sparkles className="w-5 h-5 text-primary animate-glow-pulse" />
            </div>
            
            <p className="text-sm text-muted-foreground uppercase tracking-wider">
              {body.type === 'planet' ? 'Planet' : body.type === 'moon' ? 'Moon' : body.type === 'dwarf' ? 'Dwarf Planet' : body.type === 'asteroid' ? 'Asteroid' : 'Kuiper Object'}
            </p>
          </div>
          
          <div className="bg-muted/30 rounded-xl p-6 border border-border">
            <p className="text-lg leading-relaxed">{body.fact}</p>
          </div>
          
          <Button
            size="lg"
            onClick={onContinue}
            className="w-full bg-primary hover:bg-primary/90 shadow-glow-primary text-lg h-14"
          >
            Continue Journey 🚀
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
