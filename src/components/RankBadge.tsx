export type Rank = 'cadet' | 'captain' | 'commander';

interface RankBadgeProps {
  rank: Rank;
  xp: number;
  className?: string;
}

const RANK_CONFIG = {
  cadet: {
    name: 'Space Cadet',
    image: '/rank-cadet.png',
    color: 'text-muted-foreground',
    xpRequired: 0,
    nextRank: 500,
  },
  captain: {
    name: 'Space Captain',
    image: '/rank-captain.png',
    color: 'text-primary',
    xpRequired: 500,
    nextRank: 2000,
  },
  commander: {
    name: 'Space Commander',
    image: '/rank-commander.png',
    color: 'text-secondary',
    xpRequired: 2000,
    nextRank: null,
  },
};

export const RankBadge = ({ rank, xp, className = '' }: RankBadgeProps) => {
  const config = RANK_CONFIG[rank];
  
  const progress = config.nextRank 
    ? ((xp - config.xpRequired) / (config.nextRank - config.xpRequired)) * 100
    : 100;

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-card border-2 border-border shadow-glow-primary overflow-hidden animate-glow-pulse">
          <img 
            src={config.image} 
            alt={config.name}
            className="w-20 h-20 object-cover rounded-xl"
          />
        </div>
        <div>
          <div className={`text-lg font-bold ${config.color}`}>{config.name}</div>
          <div className="text-sm text-muted-foreground font-semibold">{xp} XP</div>
        </div>
      </div>
      
      {config.nextRank && (
        <div className="w-full">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Next rank: {config.nextRank} XP</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export const getRankFromXP = (xp: number): Rank => {
  if (xp >= 2000) return 'commander';
  if (xp >= 500) return 'captain';
  return 'cadet';
};
