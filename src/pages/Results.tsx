import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { StarField } from '@/components/StarField';
import { RankBadge, getRankFromXP } from '@/components/RankBadge';
import { Question } from '@/types/game';
import { calculateXP, updateWeakAreas, loadPlayerStats, savePlayerStats, syncStatsToCloud } from '@/utils/gameLogic';
import { Trophy, Home, RotateCcw, CheckCircle2, XCircle } from 'lucide-react';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const questions = location.state?.questions as Question[];

  useEffect(() => {
    if (!questions) {
      navigate('/');
      return;
    }

    const stats = loadPlayerStats();
    const score = questions.filter(q => q.correct).length;
    const xpEarned = calculateXP(score, questions.length);
    
    const updatedStats = {
      totalXP: stats.totalXP + xpEarned,
      weakAreas: updateWeakAreas(questions, stats.weakAreas),
    };

    savePlayerStats(updatedStats);
    
    // Background sync to cloud (non-blocking)
    syncStatsToCloud(updatedStats);
  }, [questions, navigate]);

  if (!questions) {
    return null;
  }

  const stats = loadPlayerStats();
  const rank = getRankFromXP(stats.totalXP);
  const score = questions.filter(q => q.correct).length;
  const xpEarned = calculateXP(score, questions.length);
  const percentage = Math.round((score / questions.length) * 100);

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
                  Mission Complete!
                </h1>
                <div className="text-6xl font-bold text-primary mb-4">{percentage}%</div>
                <p className="text-lg text-muted-foreground">
                  {score} out of {questions.length} correct
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-muted/50 rounded-xl p-4 text-center border border-border">
                  <div className="text-3xl font-bold text-success mb-1">+{xpEarned}</div>
                  <div className="text-sm text-muted-foreground">XP Earned</div>
                </div>
                <div className="bg-muted/50 rounded-xl p-4 text-center border border-border">
                  <div className="text-3xl font-bold text-primary mb-1">{stats.totalXP}</div>
                  <div className="text-sm text-muted-foreground">Total XP</div>
                </div>
              </div>

              <RankBadge rank={rank} xp={stats.totalXP} className="mb-6" />

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="flex-1"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
                <Button
                  onClick={() => navigate('/select-tables')}
                  className="flex-1 bg-primary hover:bg-primary/90 shadow-glow-primary"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Play Again
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
