import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

interface ReviewFormProps {
  movieId: string;
  onSubmit: (rating: number, content: string) => Promise<void>;
}

const ReviewForm = ({ movieId, onSubmit }: ReviewFormProps) => {
  const { user, isAuthenticated } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || !content.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(rating, content);
      setRating(0);
      setContent('');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-lg p-6 border border-border text-center"
      >
        <p className="text-muted-foreground mb-4">
          Sign in to write a review and share your thoughts!
        </p>
        <Link to="/auth">
          <Button variant="hero">Sign In to Review</Button>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="bg-card rounded-lg p-6 border border-border"
    >
      <div className="flex items-center gap-3 mb-4">
        <img
          src={user?.avatar}
          alt={user?.username}
          className="h-10 w-10 rounded-full border-2 border-primary"
        />
        <div>
          <p className="font-medium">{user?.username}</p>
          <p className="text-xs text-muted-foreground">Writing a review</p>
        </div>
      </div>

      {/* Star Rating */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Your Rating</label>
        <div className="flex gap-1">
          {Array.from({ length: 10 }, (_, i) => (
            <motion.button
              key={i}
              type="button"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setRating(i + 1)}
              onMouseEnter={() => setHoverRating(i + 1)}
              onMouseLeave={() => setHoverRating(0)}
              className="focus:outline-none"
            >
              <Star
                className={`h-6 w-6 transition-colors ${
                  i < (hoverRating || rating)
                    ? 'text-reviewflix-gold fill-reviewflix-gold'
                    : 'text-muted-foreground/30'
                }`}
              />
            </motion.button>
          ))}
          {(hoverRating || rating) > 0 && (
            <span className="ml-2 text-sm font-semibold">
              {hoverRating || rating}/10
            </span>
          )}
        </div>
      </div>

      {/* Review Content */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Your Review</label>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your thoughts about this movie..."
          rows={4}
          className="bg-secondary/50 border-border focus:border-primary resize-none"
          maxLength={1000}
        />
        <p className="text-xs text-muted-foreground mt-1 text-right">
          {content.length}/1000
        </p>
      </div>

      <Button
        type="submit"
        variant="hero"
        disabled={rating === 0 || !content.trim() || isSubmitting}
        className="w-full"
      >
        {isSubmitting ? (
          'Submitting...'
        ) : (
          <>
            <Send className="h-4 w-4 mr-2" />
            Submit Review
          </>
        )}
      </Button>
    </motion.form>
  );
};

export default ReviewForm;
