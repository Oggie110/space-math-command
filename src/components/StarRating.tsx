import { Star } from 'lucide-react';

interface StarRatingProps {
  stars: 0 | 1 | 2 | 3;
  size?: 'sm' | 'md' | 'lg';
  showEmpty?: boolean;
  animated?: boolean;
}

export const StarRating = ({ stars, size = 'md', showEmpty = true, animated = false }: StarRatingProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
  };
  
  const iconSize = sizeClasses[size];
  
  return (
    <div className="flex gap-1">
      {[1, 2, 3].map((i) => (
        <Star
          key={i}
          className={`${iconSize} transition-all ${
            i <= stars
              ? 'fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]'
              : showEmpty
                ? 'text-muted'
                : 'hidden'
          } ${animated && i <= stars ? 'animate-scale-in' : ''}`}
          style={animated && i <= stars ? { animationDelay: `${(i - 1) * 0.15}s` } : undefined}
        />
      ))}
    </div>
  );
};
