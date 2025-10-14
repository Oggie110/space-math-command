import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StarField } from '@/components/StarField';
import { Progress } from '@/components/ui/progress';
import { GameSettings, Question } from '@/types/game';
import { generateQuestions, loadPlayerStats } from '@/utils/gameLogic';
import { CheckCircle2, XCircle, Zap } from 'lucide-react';

const Game = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const settings = location.state?.settings as GameSettings;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    if (!settings) {
      navigate('/');
      return;
    }

    const stats = loadPlayerStats();
    const generatedQuestions = generateQuestions(settings, stats);
    setQuestions(generatedQuestions);
  }, [settings, navigate]);

  if (!settings || questions.length === 0) {
    return null;
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleSubmit = () => {
    const answer = parseInt(userAnswer);
    const correct = answer === currentQuestion.answer;
    
    setIsCorrect(correct);
    setShowFeedback(true);

    const updatedQuestions = [...questions];
    updatedQuestions[currentIndex] = {
      ...currentQuestion,
      userAnswer: answer,
      correct,
    };
    setQuestions(updatedQuestions);

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setUserAnswer('');
        setShowFeedback(false);
      } else {
        navigate('/results', { state: { questions: updatedQuestions } });
      }
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && userAnswer && !showFeedback) {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <StarField />

      <div className="max-w-2xl w-full relative z-10">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Question {currentIndex + 1} of {questions.length}</span>
            <span className="flex items-center gap-1">
              <Zap className="w-4 h-4 text-primary" />
              {questions.filter(q => q.correct).length} correct
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question card */}
        <div className="bg-card/90 backdrop-blur-sm border-2 border-border rounded-2xl p-8 shadow-glow-primary">
          <div className="text-center mb-8">
            <div className="text-6xl font-bold mb-6 flex items-center justify-center gap-4">
              <span className="text-primary">{currentQuestion.num1}</span>
              <span className="text-muted-foreground">×</span>
              <span className="text-secondary">{currentQuestion.num2}</span>
              <span className="text-muted-foreground">=</span>
              <span className="text-accent">?</span>
            </div>

            {!showFeedback ? (
              <div className="max-w-xs mx-auto">
                <Input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter answer"
                  className="text-center text-2xl h-16 mb-4"
                  autoFocus
                />
                <Button
                  onClick={handleSubmit}
                  disabled={!userAnswer}
                  className="w-full h-12 bg-primary hover:bg-primary/90 shadow-glow-primary"
                >
                  Submit Answer
                </Button>
              </div>
            ) : (
              <div className={`animate-scale-in ${isCorrect ? 'text-success' : 'text-destructive'}`}>
                {isCorrect ? (
                  <div className="flex flex-col items-center gap-4">
                    <CheckCircle2 className="w-20 h-20 animate-glow-pulse" />
                    <div className="text-2xl font-bold">Correct! 🚀</div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <XCircle className="w-20 h-20" />
                    <div className="text-2xl font-bold">Not quite!</div>
                    <div className="text-lg">
                      The answer is <span className="text-primary font-bold">{currentQuestion.answer}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
