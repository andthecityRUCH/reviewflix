import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Film, Star, Calendar, Edit2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ReviewCard from '@/components/ReviewCard';
import MovieCard from '@/components/MovieCard';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { reviewApi, movieApi } from '@/services/api';
import { Review, Movie } from '@/types';

const Profile = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [watchlistMovies, setWatchlistMovies] = useState<Movie[]>([]);
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [activeTab, setActiveTab] = useState<'reviews' | 'watchlist'>('reviews');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const [userReviews, movies] = await Promise.all([
          reviewApi.getByUser(user.id),
          movieApi.getAll(),
        ]);
        setReviews(userReviews);
        setAllMovies(movies);
        setWatchlistMovies(
          movies.filter((m) => user.watchlist.includes(m.id))
        );
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleDeleteReview = async (reviewId: string) => {
    await reviewApi.delete(reviewId);
    setReviews(reviews.filter((r) => r.id !== reviewId));
  };

  const getMovieTitle = (movieId: string) => {
    return allMovies.find((m) => m.id === movieId)?.title || 'Unknown Movie';
  };

  if (authLoading) {
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

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl p-6 md:p-8 border border-border mb-8"
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-primary"
                />
                <button className="absolute bottom-0 right-0 p-2 bg-primary rounded-full hover:bg-primary/80 transition-colors">
                  <Edit2 className="h-4 w-4 text-primary-foreground" />
                </button>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="font-display text-3xl md:text-4xl mb-2">
                  {user.username}
                </h1>
                <p className="text-muted-foreground mb-4">{user.email}</p>

                {/* Stats */}
                <div className="flex flex-wrap justify-center md:justify-start gap-6">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-reviewflix-gold" />
                    <span className="font-semibold">{reviews.length}</span>
                    <span className="text-muted-foreground">Reviews</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Film className="h-5 w-5 text-primary" />
                    <span className="font-semibold">{watchlistMovies.length}</span>
                    <span className="text-muted-foreground">Watchlist</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Joined {new Date(user.joinedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <Button
              variant={activeTab === 'reviews' ? 'hero' : 'secondary'}
              onClick={() => setActiveTab('reviews')}
            >
              <Star className="h-4 w-4 mr-2" />
              My Reviews
            </Button>
            <Button
              variant={activeTab === 'watchlist' ? 'hero' : 'secondary'}
              onClick={() => setActiveTab('watchlist')}
            >
              <Film className="h-4 w-4 mr-2" />
              Watchlist
            </Button>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
              />
            </div>
          ) : activeTab === 'reviews' ? (
            <motion.div
              key="reviews"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {reviews.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {reviews.map((review) => (
                    <ReviewCard
                      key={review.id}
                      review={review}
                      onDelete={handleDeleteReview}
                      showMovieTitle
                      movieTitle={getMovieTitle(review.movieId)}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-card rounded-lg p-12 text-center border border-border">
                  <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h2 className="font-display text-2xl mb-2">No Reviews Yet</h2>
                  <p className="text-muted-foreground mb-6">
                    Start reviewing movies to build your collection
                  </p>
                  <Link to="/browse">
                    <Button variant="hero">Browse Movies</Button>
                  </Link>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="watchlist"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {watchlistMovies.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {watchlistMovies.map((movie, index) => (
                    <MovieCard key={movie.id} movie={movie} index={index} />
                  ))}
                </div>
              ) : (
                <div className="bg-card rounded-lg p-12 text-center border border-border">
                  <Film className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h2 className="font-display text-2xl mb-2">Watchlist Empty</h2>
                  <p className="text-muted-foreground mb-6">
                    Add movies to your watchlist to keep track of what to watch
                  </p>
                  <Link to="/browse">
                    <Button variant="hero">Discover Movies</Button>
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;