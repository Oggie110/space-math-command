import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { StarField } from '@/components/StarField';
import { Rocket, Target, Map, Star } from 'lucide-react';
import { loadPlayerStats } from '@/utils/gameLogic';
import { getCompletedWaypointsCount, getTotalWaypoints } from '@/utils/campaignLogic';

const StartMenu = () => {
  const navigate = useNavigate();
  
  const stats = loadPlayerStats();
  const completedWaypoints = stats.campaignProgress ? getCompletedWaypointsCount(stats.campaignProgress) : 0;
  const totalWaypoints = getTotalWaypoints();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <StarField />
      
      <div className="max-w-2xl w-full relative z-10">
        <div className="text-center mb-12 animate-float">
          <div className="inline-flex items-center gap-3 mb-4">
            <Rocket className="w-16 h-16 text-primary animate-glow-pulse" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Space Math Command
          </h1>
          <p className="text-xl text-muted-foreground">
            Master multiplication while exploring the cosmos
          </p>
        </div>

        <div className="grid gap-6 max-w-md mx-auto">
          <Button
            size="lg"
            className="w-full h-20 text-xl font-bold bg-primary hover:bg-primary/90 shadow-glow-primary transition-all hover:scale-105 relative overflow-hidden"
            onClick={() => navigate('/campaign')}
          >
            <div className="flex items-center justify-center w-full">
              <Map className="w-6 h-6 mr-3" />
              <div className="flex flex-col items-start">
                <span>Play Campaign</span>
                {completedWaypoints > 0 && (
                  <span className="text-xs opacity-80 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    {completedWaypoints}/{totalWaypoints} waypoints
                  </span>
                )}
              </div>
            </div>
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="w-full h-20 text-xl font-bold border-2 hover:border-primary transition-all hover:scale-105"
            onClick={() => navigate('/practice')}
          >
            <Target className="w-6 h-6 mr-3" />
            Practice Tables
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StartMenu;
