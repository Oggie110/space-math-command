import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { StarField } from '@/components/StarField';
import { RankBadge, getRankFromXP } from '@/components/RankBadge';
import { loadPlayerStats } from '@/utils/gameLogic';
import { SettingsDialog } from '@/components/SettingsDialog';
import { WeakAreasDialog } from '@/components/WeakAreasDialog';
import { Rocket, Play, Settings, ChevronRight } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(loadPlayerStats());
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [weakAreasOpen, setWeakAreasOpen] = useState(false);
  const rank = getRankFromXP(stats.totalXP);

  useEffect(() => {
    setStats(loadPlayerStats());
  }, []);

  const handleStatsUpdated = () => {
    setStats(loadPlayerStats());
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <StarField />
      
      {/* Settings Button - Top Right */}
      <Button
        variant="outline"
        size="icon"
        className="absolute top-4 right-4 z-20 bg-card/90 backdrop-blur-sm border-2 hover:border-primary transition-colors"
        onClick={() => setSettingsOpen(true)}
      >
        <Settings className="w-5 h-5" />
      </Button>
      
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
            Choose Tables
          </Button>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div 
              className="bg-card/50 backdrop-blur-sm border-2 border-secondary rounded-xl p-4 cursor-pointer hover:bg-card/70 hover:border-secondary/80 transition-all hover:scale-[1.02] relative group"
              onClick={() => setWeakAreasOpen(true)}
            >
              <div className="text-2xl font-bold text-secondary">
                {Object.keys(stats.weakAreas).length}
              </div>
              <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                Need Practice
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4">
              <div className="text-2xl font-bold text-primary">{stats.totalXP}</div>
              <div className="text-xs text-muted-foreground">Total XP</div>
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

      <SettingsDialog 
        open={settingsOpen} 
        onOpenChange={setSettingsOpen}
        onStatsUpdated={handleStatsUpdated}
      />
      
      <WeakAreasDialog 
        open={weakAreasOpen}
        onOpenChange={setWeakAreasOpen}
        stats={stats}
      />
    </div>
  );
};

export default Home;
