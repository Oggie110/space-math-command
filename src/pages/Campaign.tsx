import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { StarField } from '@/components/StarField';
import { ArrowLeft, Rocket } from 'lucide-react';

const Campaign = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <StarField />
      
      <Button
        variant="outline"
        size="icon"
        className="absolute top-4 left-4 z-20 bg-card/90 backdrop-blur-sm border-2 hover:border-primary transition-colors"
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="w-5 h-5" />
      </Button>
      
      <div className="max-w-2xl w-full relative z-10 text-center">
        <div className="animate-float mb-8">
          <Rocket className="w-20 h-20 text-primary animate-glow-pulse mx-auto mb-6" />
        </div>
        
        <div className="bg-card/90 backdrop-blur-sm border-2 border-border rounded-2xl p-12 shadow-glow-primary">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Campaign Mode
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Journey through the solar system, unlock planets, and discover space facts as you master multiplication!
          </p>
          <div className="inline-block px-6 py-3 bg-primary/10 border border-primary/30 rounded-lg">
            <p className="text-primary font-semibold">
              🚀 Coming Soon
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Campaign;
