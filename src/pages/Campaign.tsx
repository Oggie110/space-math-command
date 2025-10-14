import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { StarField } from '@/components/StarField';
import { CampaignMap } from '@/components/CampaignMap';
import { PlanetFactModal } from '@/components/PlanetFactModal';
import { StarRating } from '@/components/StarRating';
import { RankBadge, getRankFromXP } from '@/components/RankBadge';
import { ArrowLeft, Rocket, Trophy } from 'lucide-react';
import { loadPlayerStats } from '@/utils/gameLogic';
import { initializeCampaignProgress, generateCampaignMission, getLegById, getCompletedWaypointsCount, getTotalWaypoints, getTotalStarsEarned, isReplayAttempt } from '@/utils/campaignLogic';
import { celestialBodies, getChapterName } from '@/data/campaignRoute';

const Campaign = () => {
  const navigate = useNavigate();
  const [showPlanetModal, setShowPlanetModal] = useState(false);
  const [selectedPlanetId, setSelectedPlanetId] = useState<string | null>(null);

  const stats = loadPlayerStats();
  const campaignProgress = stats.campaignProgress || initializeCampaignProgress();
  
  const currentLeg = getLegById(campaignProgress.currentLegId);
  const currentBody = currentLeg ? celestialBodies[currentLeg.toBodyId] : celestialBodies.moon;
  const fromBody = currentLeg ? celestialBodies[currentLeg.fromBodyId] : celestialBodies.earth;
  
  const completedWaypoints = getCompletedWaypointsCount(campaignProgress);
  const totalWaypoints = getTotalWaypoints();
  const totalStars = getTotalStarsEarned(campaignProgress);
  const maxStars = totalWaypoints * 3;
  const rank = getRankFromXP(stats.totalXP);

  const handleStartMission = () => {
    if (!currentLeg) return;
    
    const settings = generateCampaignMission(currentLeg.id);
    const isReplay = isReplayAttempt(campaignProgress, currentLeg.id, campaignProgress.currentWaypointIndex);
    
    navigate('/game', {
      state: {
        settings,
        campaignMode: true,
        legId: currentLeg.id,
        waypointIndex: campaignProgress.currentWaypointIndex,
        isReplay,
      },
    });
  };

  const handleWaypointClick = (legId: string, waypointIndex: number) => {
    const settings = generateCampaignMission(legId);
    const isReplay = isReplayAttempt(campaignProgress, legId, waypointIndex);
    
    navigate('/game', {
      state: {
        settings,
        campaignMode: true,
        legId,
        waypointIndex,
        isReplay,
      },
    });
  };

  const handlePlanetClick = (bodyId: string) => {
    setSelectedPlanetId(bodyId);
    setShowPlanetModal(true);
  };

  return (
    <div className="min-h-screen flex flex-col p-4 relative">
      <StarField />

      <div className="flex-1 flex flex-col items-center justify-center max-w-7xl w-full mx-auto relative z-10 gap-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Solar System Campaign
          </h1>
          <p className="text-muted-foreground">
            Master multiplication across the cosmos
          </p>
        </div>

        {/* Rank Badge */}
        <div className="w-full max-w-2xl">
          <div className="bg-card/90 backdrop-blur-sm border-2 border-border rounded-2xl p-6 shadow-glow-primary">
            <RankBadge rank={rank} xp={stats.totalXP} />
          </div>
        </div>

        {/* Current Mission Card */}
        <div className="w-full max-w-2xl">
          <div className="bg-card/90 backdrop-blur-sm border-2 border-border rounded-2xl p-6 shadow-glow-primary">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-4xl">{fromBody.emoji}</div>
                <div className="text-2xl text-muted-foreground">→</div>
                <div className="text-4xl">{currentBody.emoji}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground uppercase tracking-wider">
                  {currentLeg ? getChapterName(currentLeg.chapter) : 'Inner System'}
                </div>
                <div className="text-lg font-bold">
                  Waypoint {campaignProgress.currentWaypointIndex + 1}/5
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">
                {fromBody.name} → {currentBody.name}
              </h2>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Trophy className="w-4 h-4" />
                  Tables: {currentBody.focusTables.join(', ')}
                </div>
              </div>
            </div>

            <Button
              size="lg"
              onClick={handleStartMission}
              className="w-full bg-primary hover:bg-primary/90 shadow-glow-primary text-lg h-14"
            >
              <Rocket className="w-5 h-5 mr-2" />
              Start Mission
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-2xl">
          <div className="bg-card/90 backdrop-blur-sm border-2 border-border rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-primary">{completedWaypoints}/{totalWaypoints}</div>
            <div className="text-xs text-muted-foreground">Waypoints</div>
          </div>
          <div className="bg-card/90 backdrop-blur-sm border-2 border-border rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">{totalStars}/{maxStars}</div>
            <div className="text-xs text-muted-foreground">Stars</div>
          </div>
          <div className="bg-card/90 backdrop-blur-sm border-2 border-border rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-secondary">{stats.totalXP}</div>
            <div className="text-xs text-muted-foreground">Total XP</div>
          </div>
        </div>

        {/* Campaign Map */}
        <div className="w-full bg-card/90 backdrop-blur-sm border-2 border-border rounded-2xl p-6 shadow-glow-primary">
          <h3 className="text-xl font-bold mb-4 text-center">Your Journey</h3>
          <CampaignMap
            progress={campaignProgress}
            onWaypointClick={handleWaypointClick}
            onPlanetClick={handlePlanetClick}
          />
        </div>

        {/* Back to Main Menu */}
        <Button
          variant="outline"
          onClick={() => navigate('/')}
          className="mt-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Main Menu
        </Button>
      </div>

      {/* Planet Fact Modal */}
      {selectedPlanetId && (
        <PlanetFactModal
          body={celestialBodies[selectedPlanetId]}
          open={showPlanetModal}
          onContinue={() => setShowPlanetModal(false)}
        />
      )}
    </div>
  );
};

export default Campaign;
