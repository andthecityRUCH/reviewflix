// Movie and Review Types for ReviewFlix

export interface Movie {
  id: string;
  title: string;
  year: number;
  poster: string;
  backdrop: string;
  genre: string[];
  rating: number;
  description: string;
  director: string;
  cast: string[];
  runtime: number;
  releaseDate: string;
}

export interface Review {
  id: string;
  movieId: string;
  userId: string;
  username: string;
  rating: number;
  content: string;
  createdAt: string;
  likes: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  joinedAt: string;
  reviewCount: number;
  watchlist: string[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
