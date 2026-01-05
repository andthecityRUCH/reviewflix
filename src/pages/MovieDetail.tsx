import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Clock, Calendar, User, ArrowLeft, Plus, Check } from 'lucide-react';
import Navbar from '@/components/Navbar';
import MovieCard from '@/components/MovieCard';
import ReviewCard from '@/components/ReviewCard';
import ReviewForm from '@/components/ReviewForm';
import { Button } from '@/components/ui/button';
import { movieApi, reviewApi } from '@/services/api';
import { Movie, Review } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const [movieData, reviewsData, similarData] = await Promise.all([
          movieApi.getById(id),
          reviewApi.getByMovie(id),
          movieApi.getSimilar(id),
        ]);
        setMovie(movieData || null);
        setReviews(reviewsData);
        setSimilarMovies(similarData);
      } catch (error) {
        console.error('Failed to fetch movie:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleReviewSubmit = async (rating: number, content: string) => {
    if (!user || !id) return;
    const newReview = await reviewApi.create({
      movieId: id,
      userId: user.id,
      username: user.username,
      rating,
      content,
    });
    setReviews([newReview, ...reviews]);
  };

  const handleDeleteReview = async (reviewId: string) => {
    await reviewApi.delete(reviewId);
    setReviews(reviews.filter((r) => r.id !== reviewId));
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : movie?.rating || 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl mb-4">Movie Not Found</h1>
          <Link to="/">
            <Button variant="hero">Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Backdrop */}
      <div className="relative h-[60vh] min-h-[400px]">
        <img
          src={movie.backdrop}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent" />
        
        {/* Back Button */}
        <Link
          to="/"
          className="absolute top-20 left-4 md:left-8 z-10"
        >
          <Button variant="glass" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 -mt-40 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Poster & Quick Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full max-w-[300px] mx-auto rounded-lg shadow-2xl"
              />
              <div className="mt-6 space-y-3">
                <Button
                  variant={isInWatchlist ? "secondary" : "hero"}
                  className="w-full"
                  onClick={() => setIsInWatchlist(!isInWatchlist)}
                >
                  {isInWatchlist ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      In Watchlist
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Add to Watchlist
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Movie Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <h1 className="font-display text-4xl md:text-6xl mb-4">{movie.title}</h1>
            
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 text-reviewflix-gold fill-reviewflix-gold" />
                <span className="font-semibold text-foreground">{averageRating.toFixed(1)}</span>
                <span className="text-sm">({reviews.length} reviews)</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{movie.year}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{movie.runtime} min</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{movie.director}</span>
              </div>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genre.map((g) => (
                <span
                  key={g}
                  className="px-3 py-1 bg-secondary rounded-full text-sm font-medium"
                >
                  {g}
                </span>
              ))}
            </div>

            {/* Description */}
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              {movie.description}
            </p>

            {/* Cast */}
            <div className="mb-8">
              <h3 className="font-display text-xl mb-3">Cast</h3>
              <div className="flex flex-wrap gap-2">
                {movie.cast.map((actor) => (
                  <span
                    key={actor}
                    className="px-3 py-1 bg-card border border-border rounded-full text-sm"
                  >
                    {actor}
                  </span>
                ))}
              </div>
            </div>

            {/* Review Form */}
            <div className="mb-8">
              <h3 className="font-display text-2xl mb-4">Write a Review</h3>
              <ReviewForm movieId={movie.id} onSubmit={handleReviewSubmit} />
            </div>

            {/* Reviews */}
            <div className="mb-8">
              <h3 className="font-display text-2xl mb-4">
                Reviews ({reviews.length})
              </h3>
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <ReviewCard
                      key={review.id}
                      review={review}
                      onDelete={handleDeleteReview}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-card rounded-lg p-8 text-center border border-border">
                  <p className="text-muted-foreground">
                    No reviews yet. Be the first to review this movie!
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Similar Movies */}
        {similarMovies.length > 0 && (
          <section className="py-12">
            <h2 className="font-display text-2xl mb-6">Similar Movies</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
              {similarMovies.map((m, index) => (
                <MovieCard key={m.id} movie={m} index={index} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default MovieDetail;