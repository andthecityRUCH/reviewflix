import { motion } from 'framer-motion';
import { Play, Star, Clock, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Movie } from '@/types';
import { Link } from 'react-router-dom';

interface HeroSectionProps {
  movie: Movie;
}

const HeroSection = ({ movie }: HeroSectionProps) => {
  return (
    <div className="relative h-[85vh] min-h-[600px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={movie.backdrop}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
      </div>

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl"
        >
          {/* Featured Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-1.5 rounded-full mb-4"
          >
            <Star className="h-4 w-4 fill-primary" />
            <span className="text-sm font-medium">Featured Movie</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="font-display text-5xl md:text-7xl lg:text-8xl leading-none mb-4"
          >
            {movie.title}
          </motion.h1>

          {/* Meta Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6"
          >
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 text-reviewflix-gold fill-reviewflix-gold" />
              <span className="font-semibold text-foreground">{movie.rating.toFixed(1)}</span>
            </div>
            <span>{movie.year}</span>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{movie.runtime} min</span>
            </div>
            <div className="flex gap-2">
              {movie.genre.map((g) => (
                <span
                  key={g}
                  className="px-2 py-0.5 bg-secondary rounded-full text-xs"
                >
                  {g}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-lg text-muted-foreground leading-relaxed mb-8 line-clamp-3"
          >
            {movie.description}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap gap-4"
          >
            <Link to={`/movie/${movie.id}`}>
              <Button variant="hero" size="xl">
                <Play className="h-5 w-5 mr-2 fill-current" />
                Write Review
              </Button>
            </Link>
            <Link to={`/movie/${movie.id}`}>
              <Button variant="glass" size="xl">
                <Info className="h-5 w-5 mr-2" />
                More Info
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-6 h-10 rounded-full border-2 border-muted-foreground/50 flex items-start justify-center p-1"
        >
          <motion.div className="w-1.5 h-3 bg-muted-foreground/50 rounded-full" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroSection;
