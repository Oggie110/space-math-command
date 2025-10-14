import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { StarField } from '@/components/StarField';
import { RankBadge, getRankFromXP } from '@/components/RankBadge';
import { loadPlayerStats } from '@/utils/gameLogic';
import { Rocket, Play } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(loadPlayerStats());
  const rank = getRankFromXP(stats.totalXP);

  useEffect(() => {
    setStats(loadPlayerStats());
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <StarField />
      
      <div className="max-w-2xl w-full relative z-10">
        <div className="text-center mb-8 animate-float">
          <div className="inline-flex items-center gap-3 mb-4">
            <Rocket className="w-12 h-12 text-primary animate-glow-pulse" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Space Math Command
          </h1>
          <p className="text-lg text-muted-foreground">
            Master multiplication while exploring the cosmos
          </p>
        </div>

        <div className="bg-card/90 backdrop-blur-sm border-2 border-border rounded-2xl p-6 shadow-glow-primary mb-6">
          <RankBadge rank={rank} xp={stats.totalXP} />
        </div>

        <div className="flex flex-col gap-4">
          <Button
            size="lg"
            className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 shadow-glow-primary transition-all hover:scale-105"
            onClick={() => navigate('/select-tables')}
          >
            <Play className="w-5 h-5 mr-2" />
            Start Mission
          </Button>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4">
              <div className="text-2xl font-bold text-primary">{stats.totalXP}</div>
              <div className="text-xs text-muted-foreground">Total XP</div>
            </div>
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4">
              <div className="text-2xl font-bold text-secondary">
                {Object.keys(stats.weakAreas).length}
              </div>
              <div className="text-xs text-muted-foreground">Tracking</div>
            </div>
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4">
              <div className="text-2xl font-bold text-success">
                {rank === 'commander' ? '★★★' : rank === 'captain' ? '★★☆' : '★☆☆'}
              </div>
              <div className="text-xs text-muted-foreground">Rank</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
