// API Service Layer - Replace these with Express API calls
// This structure makes it easy to swap mock data with real API endpoints

import { mockMovies, mockReviews, mockUsers } from "@/data/mockData";
import { Movie, Review, User } from "@/types";

// Base URL for your Express backend - update when deploying
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Simulated delay to mimic real API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ============ MOVIE ENDPOINTS ============

export const movieApi = {
  // GET /api/movies
  async getAll(): Promise<Movie[]> {
    await delay(300);
    // TODO: Replace with: fetch(`${API_BASE_URL}/movies`)
    return mockMovies;
  },

  // GET /api/movies/:id
  async getById(id: string): Promise<Movie | undefined> {
    await delay(200);
    // TODO: Replace with: fetch(`${API_BASE_URL}/movies/${id}`)
    return mockMovies.find(m => m.id === id);
  },

  // GET /api/movies/:id/similar
  async getSimilar(id: string): Promise<Movie[]> {
    await delay(300);
    const movie = mockMovies.find(m => m.id === id);
    if (!movie) return [];
    
    // TODO: Replace with: fetch(`${API_BASE_URL}/movies/${id}/similar`)
    // Simple similarity: same genre
    return mockMovies
      .filter(m => m.id !== id && m.genre.some(g => movie.genre.includes(g)))
      .slice(0, 4);
  },

  // GET /api/movies/search?q=query
  async search(query: string): Promise<Movie[]> {
    await delay(200);
    // TODO: Replace with: fetch(`${API_BASE_URL}/movies/search?q=${query}`)
    const lowerQuery = query.toLowerCase();
    return mockMovies.filter(
      m => m.title.toLowerCase().includes(lowerQuery) ||
           m.genre.some(g => g.toLowerCase().includes(lowerQuery))
    );
  },

  // GET /api/movies/top-rated
  async getTopRated(): Promise<Movie[]> {
    await delay(300);
    // TODO: Replace with: fetch(`${API_BASE_URL}/movies/top-rated`)
    return [...mockMovies].sort((a, b) => b.rating - a.rating).slice(0, 5);
  },
};

// ============ REVIEW ENDPOINTS ============

export const reviewApi = {
  // GET /api/reviews/movie/:movieId
  async getByMovie(movieId: string): Promise<Review[]> {
    await delay(200);
    // TODO: Replace with: fetch(`${API_BASE_URL}/reviews/movie/${movieId}`)
    return mockReviews.filter(r => r.movieId === movieId);
  },

  // GET /api/reviews/user/:userId
  async getByUser(userId: string): Promise<Review[]> {
    await delay(200);
    // TODO: Replace with: fetch(`${API_BASE_URL}/reviews/user/${userId}`)
    return mockReviews.filter(r => r.userId === userId);
  },

  // POST /api/reviews
  async create(review: Omit<Review, 'id' | 'createdAt' | 'likes'>): Promise<Review> {
    await delay(300);
    // TODO: Replace with: fetch(`${API_BASE_URL}/reviews`, { method: 'POST', body: JSON.stringify(review) })
    const newReview: Review = {
      ...review,
      id: `r${Date.now()}`,
      createdAt: new Date().toISOString(),
      likes: 0,
    };
    mockReviews.push(newReview);
    return newReview;
  },

  // DELETE /api/reviews/:id
  async delete(id: string): Promise<boolean> {
    await delay(200);
    // TODO: Replace with: fetch(`${API_BASE_URL}/reviews/${id}`, { method: 'DELETE' })
    const index = mockReviews.findIndex(r => r.id === id);
    if (index > -1) {
      mockReviews.splice(index, 1);
      return true;
    }
    return false;
  },
};

// ============ AUTH ENDPOINTS ============

export const authApi = {
  // POST /api/auth/login
  async login(email: string, password: string): Promise<{ user: User; token: string } | null> {
    await delay(500);
    // TODO: Replace with: fetch(`${API_BASE_URL}/auth/login`, { method: 'POST', body: JSON.stringify({ email, password }) })
    const user = mockUsers.find(u => u.email === email);
    if (user && password.length >= 6) {
      return { user, token: `mock-jwt-token-${user.id}` };
    }
    return null;
  },

  // POST /api/auth/register
  async register(username: string, email: string, password: string): Promise<{ user: User; token: string } | null> {
    await delay(500);
    // TODO: Replace with: fetch(`${API_BASE_URL}/auth/register`, { method: 'POST', body: JSON.stringify({ username, email, password }) })
    if (mockUsers.some(u => u.email === email)) {
      throw new Error("Email already registered");
    }
    
    const newUser: User = {
      id: `u${Date.now()}`,
      username,
      email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      joinedAt: new Date().toISOString(),
      reviewCount: 0,
      watchlist: [],
    };
    mockUsers.push(newUser);
    return { user: newUser, token: `mock-jwt-token-${newUser.id}` };
  },

  // GET /api/auth/me
  async getCurrentUser(token: string): Promise<User | null> {
    await delay(200);
    // TODO: Replace with: fetch(`${API_BASE_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
    const userId = token.replace('mock-jwt-token-', '');
    return mockUsers.find(u => u.id === userId) || null;
  },

  // POST /api/auth/logout
  async logout(): Promise<void> {
    await delay(100);
    // TODO: Replace with actual logout logic
    localStorage.removeItem('reviewflix_token');
  },
};

// ============ USER ENDPOINTS ============

export const userApi = {
  // GET /api/users/:id
  async getById(id: string): Promise<User | undefined> {
    await delay(200);
    // TODO: Replace with: fetch(`${API_BASE_URL}/users/${id}`)
    return mockUsers.find(u => u.id === id);
  },

  // PUT /api/users/:id/watchlist
  async updateWatchlist(userId: string, movieId: string, action: 'add' | 'remove'): Promise<string[]> {
    await delay(200);
    // TODO: Replace with: fetch(`${API_BASE_URL}/users/${userId}/watchlist`, { method: 'PUT', body: JSON.stringify({ movieId, action }) })
    const user = mockUsers.find(u => u.id === userId);
    if (!user) throw new Error("User not found");
    
    if (action === 'add' && !user.watchlist.includes(movieId)) {
      user.watchlist.push(movieId);
    } else if (action === 'remove') {
      user.watchlist = user.watchlist.filter(id => id !== movieId);
    }
    return user.watchlist;
  },
};
