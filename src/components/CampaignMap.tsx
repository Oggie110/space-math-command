import { useEffect, useRef } from 'react';
import { CampaignProgress } from '@/types/game';
import { campaignLegs, celestialBodies } from '@/data/campaignRoute';
import { getWaypointProgress } from '@/utils/campaignLogic';
import { StarRating } from './StarRating';
import { Rocket } from 'lucide-react';

interface CampaignMapProps {
  progress: CampaignProgress;
  onWaypointClick?: (legId: string, waypointIndex: number) => void;
  onPlanetClick?: (bodyId: string) => void;
}

export const CampaignMap = ({ progress, onWaypointClick, onPlanetClick }: CampaignMapProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentWaypointRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (currentWaypointRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const element = currentWaypointRef.current;
      const scrollPosition = element.offsetLeft - container.clientWidth / 2 + element.clientWidth / 2;
      container.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    }
  }, [progress.currentLegId, progress.currentWaypointIndex]);

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="overflow-x-auto pb-6 pt-20 hide-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="flex items-center gap-2 min-w-max px-4">
          {campaignLegs.map((leg, legIndex) => {
            const fromBody = celestialBodies[leg.fromBodyId];
            const toBody = celestialBodies[leg.toBodyId];
            const isLegUnlocked = progress.unlockedLegIds.includes(leg.id);

            return (
              <div key={leg.id} className="flex items-center gap-2">
                {/* Starting planet (only show for first leg) */}
                {legIndex === 0 && (
                  <button
                    onClick={() => onPlanetClick?.(fromBody.id)}
                    className="flex flex-col items-center gap-1 group"
                  >
                    <div className="text-4xl hover:scale-110 transition-transform">
                      {fromBody.emoji}
                    </div>
                    <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                      {fromBody.name}
                    </span>
                  </button>
                )}

                {/* Waypoints */}
                <div className="flex items-center gap-2">
                  {Array.from({ length: 5 }).map((_, waypointIndex) => {
                    const waypointProgress = getWaypointProgress(progress, leg.id, waypointIndex);
                    const isCurrent = leg.id === progress.currentLegId && waypointIndex === progress.currentWaypointIndex;
                    const isCompleted = waypointProgress?.completed || false;
                    const stars = waypointProgress?.stars || 0;
                    const canPlay = isLegUnlocked;

                    return (
                      <div key={waypointIndex} className="relative">
                        <button
                          ref={isCurrent ? currentWaypointRef : undefined}
                          onClick={() => canPlay && onWaypointClick?.(leg.id, waypointIndex)}
                          disabled={!canPlay}
                          className={`
                            w-12 h-12 rounded-full border-2 transition-all relative
                            ${!canPlay ? 'opacity-30 cursor-not-allowed bg-muted border-muted' : ''}
                            ${isCurrent && !isCompleted ? 'border-primary bg-primary/20 animate-glow-pulse scale-110' : ''}
                            ${isCompleted && stars === 3 ? 'border-yellow-400 bg-yellow-400/20 shadow-glow-primary' : ''}
                            ${isCompleted && stars < 3 ? 'border-muted bg-muted/20' : ''}
                            ${!isCompleted && !isCurrent && canPlay ? 'border-border bg-card hover:border-primary hover:scale-105' : ''}
                          `}
                        >
                          {isCurrent && !isCompleted && (
                            <span className="absolute -top-8 left-1/2 animate-float">
                              <img 
                                src="/SpaceshipTransparent.png" 
                                alt="Current position" 
                                className="-translate-x-[85%] h-24 w-auto object-contain" 
                              />
                            </span>
                          )}
                          {isCompleted && (
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                              <StarRating stars={stars} size="sm" showEmpty={false} />
                            </div>
                          )}
                          {!isCompleted && !isCurrent && (
                            <div className="w-2 h-2 rounded-full bg-muted absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Destination planet */}
                <button
                  onClick={() => onPlanetClick?.(toBody.id)}
                  className={`flex flex-col items-center gap-1 group ${!isLegUnlocked ? 'opacity-40' : ''}`}
                  disabled={!isLegUnlocked}
                >
                  <div className="text-4xl hover:scale-110 transition-transform">
                    {toBody.emoji}
                  </div>
                  <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                    {toBody.name}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};
