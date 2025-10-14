import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { StarField } from '@/components/StarField';
import { RankBadge, getRankFromXP } from '@/components/RankBadge';
import { StarRating } from '@/components/StarRating';
import { PlanetFactModal } from '@/components/PlanetFactModal';
import { Question } from '@/types/game';
import { updateWeakAreas, loadPlayerStats, savePlayerStats, syncStatsToCloud } from '@/utils/gameLogic';
import { calculateStars, calculateCampaignXP, completeWaypoint, initializeCampaignProgress, isLegPerfected, getLegById } from '@/utils/campaignLogic';
import { celestialBodies } from '@/data/campaignRoute';
import { Trophy, Home, RotateCcw, CheckCircle2, XCircle, Star as StarIcon, ArrowLeft } from 'lucide-react';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const questions = location.state?.questions as Question[];
  const { campaignMode, legId, waypointIndex, isReplay } = location.state || {};
  
  const [showPlanetModal, setShowPlanetModal] = useState(false);
  const [unlockedBody, setUnlockedBody] = useState<string | null>(null);

  useEffect(() => {
    if (!questions) {
      navigate('/');
      return;
    }

    const stats = loadPlayerStats();
    const score = questions.filter(q => q.correct).length;
    
    if (campaignMode) {
      const xpEarned = calculateCampaignXP(score, questions.length, isReplay || false);
      const campaignProgress = stats.campaignProgress || initializeCampaignProgress();
      
      const updatedProgress = completeWaypoint(
        campaignProgress,
        legId,
        waypointIndex,
        score,
        questions.length
      );
      
      const updatedStats = {
        totalXP: stats.totalXP + xpEarned,
        weakAreas: updateWeakAreas(questions, stats.weakAreas),
        campaignProgress: updatedProgress,
      };

      savePlayerStats(updatedStats);
      syncStatsToCloud(updatedStats);
      
      // Check if leg was just perfected
      if (waypointIndex === 4 && isLegPerfected(updatedProgress, legId)) {
        const leg = getLegById(legId);
        if (leg) {
          setUnlockedBody(leg.toBodyId);
          setShowPlanetModal(true);
        }
      }
    } else {
      // Practice mode
      const xpEarned = score * 10;
      
      const updatedStats = {
        totalXP: stats.totalXP + xpEarned,
        weakAreas: updateWeakAreas(questions, stats.weakAreas),
        campaignProgress: stats.campaignProgress,
      };

      savePlayerStats(updatedStats);
      syncStatsToCloud(updatedStats);
    }
  }, [questions, navigate, campaignMode, legId, waypointIndex, isReplay]);

  if (!questions) {
    return null;
  }

  const stats = loadPlayerStats();
  const rank = getRankFromXP(stats.totalXP);
  const score = questions.filter(q => q.correct).length;
  const percentage = Math.round((score / questions.length) * 100);
  
  const stars = campaignMode ? calculateStars(score, questions.length) : 0;
  const xpEarned = campaignMode 
    ? calculateCampaignXP(score, questions.length, isReplay || false)
    : score * 10;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <StarField />

      <div className="max-w-6xl w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Question Review - Left side on desktop */}
          <div className="bg-card/90 backdrop-blur-sm border-2 border-border rounded-2xl p-6 shadow-glow-primary lg:order-1 order-2">
            <h2 className="text-xl font-bold mb-4">Question Review</h2>
            <div className="space-y-2">
              {questions.map((q, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    q.correct ? 'bg-success/10 border border-success/20' : 'bg-destructive/10 border border-destructive/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {q.correct ? (
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    ) : (
                      <XCircle className="w-5 h-5 text-destructive" />
                    )}
                    <span className="font-mono">
                      {q.num1} × {q.num2} = {q.answer}
                    </span>
                  </div>
                  {!q.correct && (
                    <span className="text-sm text-muted-foreground">
                      Your answer: {q.userAnswer || '—'}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Stats and Actions - Right side on desktop */}
          <div className="space-y-6 lg:order-2 order-1">
            <div className="bg-card/90 backdrop-blur-sm border-2 border-border rounded-2xl p-6 shadow-glow-primary">
              <div className="text-center mb-6">
                <Trophy className="w-16 h-16 text-primary mx-auto mb-4 animate-float" />
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {campaignMode ? 'Waypoint Complete!' : 'Mission Complete!'}
                </h1>
                
                {campaignMode && (
                  <div className="mb-4">
                    <StarRating stars={stars} size="lg" animated />
                  </div>
                )}
                
                <div className="text-6xl font-bold text-primary mb-4">{percentage}%</div>
                <p className="text-lg text-muted-foreground">
                  {score} out of {questions.length} correct
                </p>
                
                {campaignMode && stars < 3 && (
                  <p className="text-sm text-yellow-400 mt-2">
                    {stars === 2 ? 'Get 90%+ for 3 stars!' : 'Get 70%+ for 2 stars, 90%+ for 3 stars!'}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-muted/50 rounded-xl p-4 text-center border border-border">
                  <div className="text-3xl font-bold text-success mb-1">
                    +{xpEarned}{isReplay && ' (50%)'}
                  </div>
                  <div className="text-sm text-muted-foreground">XP Earned</div>
                </div>
                <div className="bg-muted/50 rounded-xl p-4 text-center border border-border">
                  <div className="text-3xl font-bold text-primary mb-1">{stats.totalXP}</div>
                  <div className="text-sm text-muted-foreground">Total XP</div>
                </div>
              </div>

              {!campaignMode && <RankBadge rank={rank} xp={stats.totalXP} className="mb-6" />}

              <div className="flex gap-3">
                {campaignMode ? (
                  <>
                    {stars < 3 && (
                      <Button
                        onClick={() => navigate('/game', { 
                          state: { 
                            settings: location.state.settings,
                            campaignMode: true,
                            legId,
                            waypointIndex,
                            isReplay: true,
                          } 
                        })}
                        className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-background"
                      >
                        <StarIcon className="w-4 h-4 mr-2" />
                        Retry for 3★
                      </Button>
                    )}
                    <Button
                      onClick={() => navigate('/campaign')}
                      className="flex-1 bg-primary hover:bg-primary/90 shadow-glow-primary"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Continue
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => navigate('/select-tables')}
                    className="flex-1 bg-primary hover:bg-primary/90 shadow-glow-primary"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Play Again
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {!campaignMode && (
          <Button
            variant="outline"
            onClick={() => navigate('/practice')}
            className="w-full mt-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        )}
      </div>

      {/* Planet Unlock Modal */}
      {unlockedBody && (
        <PlanetFactModal
          body={celestialBodies[unlockedBody]}
          open={showPlanetModal}
          onContinue={() => {
            setShowPlanetModal(false);
            navigate('/campaign');
          }}
        />
      )}
    </div>
  );
};

export default Results;
