import { motion } from 'framer-motion';
import { Star, ThumbsUp, Trash2 } from 'lucide-react';
import { Review } from '@/types';
import { Button } from './ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface ReviewCardProps {
  review: Review;
  onDelete?: (id: string) => void;
  showMovieTitle?: boolean;
  movieTitle?: string;
}

const ReviewCard = ({ review, onDelete, showMovieTitle, movieTitle }: ReviewCardProps) => {
  const { user } = useAuth();
  const isOwner = user?.id === review.userId;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 10 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating
            ? 'text-reviewflix-gold fill-reviewflix-gold'
            : 'text-muted-foreground/30'
        }`}
      />
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-lg p-5 border border-border hover:border-primary/30 transition-colors"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${review.username}`}
            alt={review.username}
            className="h-10 w-10 rounded-full border-2 border-primary/30"
          />
          <div>
            <p className="font-medium">{review.username}</p>
            <p className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</p>
          </div>
        </div>
        {isOwner && onDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(review.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Movie Title (if showing) */}
      {showMovieTitle && movieTitle && (
        <p className="text-sm text-primary font-medium mb-2">
          Reviewed: {movieTitle}
        </p>
      )}

      {/* Rating */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex gap-0.5">{renderStars(review.rating)}</div>
        <span className="text-sm font-semibold">{review.rating}/10</span>
      </div>

      {/* Content */}
      <p className="text-muted-foreground leading-relaxed">{review.content}</p>

      {/* Footer */}
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
        <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
          <ThumbsUp className="h-4 w-4" />
          <span className="text-sm">{review.likes}</span>
        </button>
      </div>
    </motion.div>
  );
};

export default ReviewCard;
