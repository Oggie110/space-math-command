import { RankBadge, Rank } from '@/components/RankBadge';

const RANKS_SHOWCASE: { rank: Rank; xp: number }[] = [
  { rank: 'cadet', xp: 0 },
  { rank: 'captain', xp: 500 },
  { rank: 'commander', xp: 2000 },
  { rank: 'fleet-admiral', xp: 5000 },
  { rank: 'star-marshal', xp: 10000 },
  { rank: 'cosmic-guardian', xp: 25000 },
  { rank: 'galactic-legend', xp: 50000 },
];

export default function RanksPreview() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-foreground">
          All Rank Badges
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {RANKS_SHOWCASE.map(({ rank, xp }) => (
            <div 
              key={rank}
              className="bg-card/90 backdrop-blur-sm border-2 border-border rounded-2xl p-6 shadow-glow-primary"
            >
              <RankBadge rank={rank} xp={xp} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
