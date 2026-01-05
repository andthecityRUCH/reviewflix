import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import MovieRow from '@/components/MovieRow';
import { movieApi } from '@/services/api';
import { Movie } from '@/types';

const Index = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allMovies, topRatedMovies] = await Promise.all([
          movieApi.getAll(),
          movieApi.getTopRated(),
        ]);
        setMovies(allMovies);
        setTopRated(topRatedMovies);
      } catch (error) {
        console.error('Failed to fetch movies:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const featuredMovie = movies[0];
  const actionMovies = movies.filter((m) => m.genre.includes('Action'));
  const dramaMovies = movies.filter((m) => m.genre.includes('Drama'));
  const sciFiMovies = movies.filter((m) => m.genre.includes('Sci-Fi'));

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      {featuredMovie && <HeroSection movie={featuredMovie} />}

      {/* Movie Rows */}
      <div className="relative z-10 -mt-20 pb-20">
        <MovieRow title="Top Rated" movies={topRated} />
        <MovieRow title="Action & Adventure" movies={actionMovies} />
        <MovieRow title="Drama" movies={dramaMovies} />
        <MovieRow title="Sci-Fi & Fantasy" movies={sciFiMovies} />
        <MovieRow title="All Movies" movies={movies} />
      </div>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-10">
        <div className="container mx-auto px-4 text-center">
          <p className="font-display text-2xl text-primary mb-2">REVIEWFLIX</p>
          <p className="text-muted-foreground text-sm">
            Your destination for honest movie reviews
          </p>
          <p className="text-muted-foreground/50 text-xs mt-4">
            © 2024 ReviewFlix. Built with MERN Stack.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;