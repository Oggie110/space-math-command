import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { StarField } from '@/components/StarField';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { GameSettings } from '@/types/game';

const SelectTables = () => {
  const navigate = useNavigate();
  const [selectedTables, setSelectedTables] = useState<number[]>([]);
  const [rangeStart, setRangeStart] = useState<number | null>(null);

  const tables = Array.from({ length: 12 }, (_, i) => i + 1);

  const toggleTable = (num: number) => {
    if (selectedTables.includes(num)) {
      setSelectedTables(selectedTables.filter(n => n !== num));
    } else {
      setSelectedTables([...selectedTables, num].sort((a, b) => a - b));
    }
  };

  const selectRange = (start: number, end: number) => {
    const range = [];
    for (let i = Math.min(start, end); i <= Math.max(start, end); i++) {
      range.push(i);
    }
    setSelectedTables(range);
    setRangeStart(null);
  };

  const handleTableClick = (num: number) => {
    if (rangeStart === null) {
      setRangeStart(num);
    } else {
      selectRange(rangeStart, num);
    }
  };

  const startGame = () => {
    if (selectedTables.length === 0) return;

    const settings: GameSettings = {
      selectedTables,
      maxMultiplier: 12,
      questionsPerRound: 4,
    };

    navigate('/game', { state: { settings } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <StarField />

      <div className="max-w-2xl w-full relative z-10">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-primary hover:text-primary/80"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>

        <div className="bg-card/90 backdrop-blur-sm border-2 border-border rounded-2xl p-6 shadow-glow-primary">
          <h2 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Select Multiplication Tables
          </h2>
          <p className="text-center text-muted-foreground mb-6">
            {rangeStart ? 'Click another number to select a range' : 'Click to toggle, or select range'}
          </p>

          <div className="grid grid-cols-4 gap-3 mb-6">
            {tables.map(num => (
              <button
                key={num}
                onClick={() => {
                  handleTableClick(num);
                  if (!rangeStart) toggleTable(num);
                }}
                className={`
                  h-16 rounded-xl font-bold text-lg transition-all
                  ${selectedTables.includes(num)
                    ? 'bg-primary text-primary-foreground shadow-glow-primary scale-105'
                    : 'bg-card hover:bg-muted border-2 border-border'
                  }
                  ${rangeStart === num ? 'ring-2 ring-secondary' : ''}
                `}
              >
                {num}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedTables([]);
                setRangeStart(null);
              }}
              className="flex-1"
              disabled={selectedTables.length === 0}
            >
              Clear Selection
            </Button>
            <Button
              onClick={startGame}
              disabled={selectedTables.length === 0}
              className="flex-1 bg-primary hover:bg-primary/90 shadow-glow-primary"
            >
              Start Game
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {selectedTables.length > 0 && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg text-center">
              <span className="text-sm text-muted-foreground">Selected tables: </span>
              <span className="font-bold text-primary">
                {selectedTables.join(', ')}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectTables;
