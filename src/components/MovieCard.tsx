import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, Plus, Check } from 'lucide-react';
import { Movie } from '@/types';
import { useState } from 'react';

interface MovieCardProps {
  movie: Movie;
  index?: number;
}

const MovieCard = ({ movie, index = 0 }: MovieCardProps) => {
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsInWatchlist(!isInWatchlist);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.05, y: -10 }}
      className="group relative"
    >
      <Link to={`/movie/${movie.id}`}>
        <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-card shadow-lg">
          {/* Poster Image */}
          <img
            src={imageError ? '/placeholder.svg' : movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImageError(true)}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Rating Badge */}
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md">
            <Star className="h-3 w-3 text-reviewflix-gold fill-reviewflix-gold" />
            <span className="text-xs font-semibold">{movie.rating.toFixed(1)}</span>
          </div>

          {/* Watchlist Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleWatchlistToggle}
            className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${
              isInWatchlist
                ? 'bg-primary text-primary-foreground'
                : 'bg-background/80 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground'
            }`}
          >
            {isInWatchlist ? (
              <Check className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </motion.button>

          {/* Hover Info */}
          <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="font-display text-lg leading-tight">{movie.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {movie.year} • {movie.genre.slice(0, 2).join(', ')}
            </p>
          </div>
        </div>

        {/* Title below card (visible on mobile) */}
        <div className="mt-2 md:hidden">
          <h3 className="font-medium text-sm truncate">{movie.title}</h3>
          <p className="text-xs text-muted-foreground">{movie.year}</p>
        </div>
      </Link>
    </motion.div>
  );
};

export default MovieCard;
