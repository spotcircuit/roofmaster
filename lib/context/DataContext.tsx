'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  category: string;
  duration: number;
  hasQuiz: boolean;
  completed?: boolean;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questionCount: number;
  passingScore: number;
  isCompleted?: boolean;
  questions?: any[];
}

interface User {
  id: string;
  email: string;
  role: string;
  createdAt: string;
  lastLogin?: string;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface DataContextType {
  // Cached data
  userRole: string | null;
  videos: Video[];
  quizzes: Quiz[];
  adminUsers: User[];

  // Loading states
  isLoadingRole: boolean;
  isLoadingVideos: boolean;
  isLoadingQuizzes: boolean;
  isLoadingUsers: boolean;

  // Methods
  refreshUserRole: () => Promise<void>;
  refreshVideos: () => Promise<void>;
  refreshQuizzes: () => Promise<void>;
  refreshAdminUsers: () => Promise<void>;
  getQuizById: (id: string) => Promise<Quiz | null>;
  getVideoQuiz: (videoId: string) => Promise<Quiz | null>;
  invalidateCache: (type?: 'all' | 'videos' | 'quizzes' | 'users' | 'role') => void;

  // Admin state
  isAdmin: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Cache configuration (in milliseconds)
const CACHE_TTL = {
  userRole: 30 * 60 * 1000,    // 30 minutes
  videos: 10 * 60 * 1000,       // 10 minutes
  quizzes: 10 * 60 * 1000,      // 10 minutes
  adminUsers: 5 * 60 * 1000,    // 5 minutes
  individualQuiz: 5 * 60 * 1000 // 5 minutes
};

const CACHE_KEYS = {
  userRole: 'cache_userRole',
  videos: 'cache_videos',
  quizzes: 'cache_quizzes',
  adminUsers: 'cache_adminUsers',
  individualQuizzes: 'cache_individualQuizzes'
};

export function DataProvider({ children }: { children: React.ReactNode }) {
  // Core data states
  const [userRole, setUserRole] = useState<string | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [adminUsers, setAdminUsers] = useState<User[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  // Cache for individual items
  const [quizCache, setQuizCache] = useState<Map<string, CacheEntry<Quiz>>>(new Map());
  const [videoQuizCache, setVideoQuizCache] = useState<Map<string, CacheEntry<Quiz>>>(new Map());

  // Loading states
  const [isLoadingRole, setIsLoadingRole] = useState(false);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);
  const [isLoadingQuizzes, setIsLoadingQuizzes] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  // Helper: Check if cache is valid
  const isCacheValid = (timestamp: number, ttl: number): boolean => {
    return Date.now() - timestamp < ttl;
  };

  // Helper: Get from localStorage
  const getFromLocalStorage = <T,>(key: string): CacheEntry<T> | null => {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        return JSON.parse(item);
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error);
    }
    return null;
  };

  // Helper: Save to localStorage
  const saveToLocalStorage = <T,>(key: string, data: T, ttl: number) => {
    try {
      const cacheEntry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        ttl
      };
      localStorage.setItem(key, JSON.stringify(cacheEntry));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  // Fetch user role
  const refreshUserRole = useCallback(async () => {
    // Check cache first
    const cached = getFromLocalStorage<string>(CACHE_KEYS.userRole);
    if (cached && isCacheValid(cached.timestamp, cached.ttl)) {
      setUserRole(cached.data);
      setIsAdmin(cached.data === 'admin');
      return;
    }

    setIsLoadingRole(true);
    try {
      const response = await fetch('/api/user/role');
      if (response.ok) {
        const data = await response.json();
        setUserRole(data.role);
        setIsAdmin(data.role === 'admin');
        saveToLocalStorage(CACHE_KEYS.userRole, data.role, CACHE_TTL.userRole);
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
    } finally {
      setIsLoadingRole(false);
    }
  }, []);

  // Fetch videos
  const refreshVideos = useCallback(async () => {
    // Check cache first
    const cached = getFromLocalStorage<Video[]>(CACHE_KEYS.videos);
    if (cached && isCacheValid(cached.timestamp, cached.ttl)) {
      setVideos(cached.data);
      return;
    }

    setIsLoadingVideos(true);
    try {
      const response = await fetch('/api/training/videos?category=all');
      if (response.ok) {
        const data = await response.json();
        setVideos(data.videos || []);
        saveToLocalStorage(CACHE_KEYS.videos, data.videos || [], CACHE_TTL.videos);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setIsLoadingVideos(false);
    }
  }, []);

  // Fetch quizzes
  const refreshQuizzes = useCallback(async () => {
    // Check cache first
    const cached = getFromLocalStorage<Quiz[]>(CACHE_KEYS.quizzes);
    if (cached && isCacheValid(cached.timestamp, cached.ttl)) {
      setQuizzes(cached.data);
      return;
    }

    setIsLoadingQuizzes(true);
    try {
      const response = await fetch('/api/user/quizzes');
      if (response.ok) {
        const data = await response.json();
        setQuizzes(data.quizzes || []);
        saveToLocalStorage(CACHE_KEYS.quizzes, data.quizzes || [], CACHE_TTL.quizzes);
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setIsLoadingQuizzes(false);
    }
  }, []);

  // Fetch admin users
  const refreshAdminUsers = useCallback(async () => {
    if (!isAdmin) return;

    // Check cache first
    const cached = getFromLocalStorage<User[]>(CACHE_KEYS.adminUsers);
    if (cached && isCacheValid(cached.timestamp, cached.ttl)) {
      setAdminUsers(cached.data);
      return;
    }

    setIsLoadingUsers(true);
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setAdminUsers(data.users || []);
        saveToLocalStorage(CACHE_KEYS.adminUsers, data.users || [], CACHE_TTL.adminUsers);
      }
    } catch (error) {
      console.error('Error fetching admin users:', error);
    } finally {
      setIsLoadingUsers(false);
    }
  }, [isAdmin]);

  // Get quiz by ID (with caching)
  const getQuizById = useCallback(async (id: string): Promise<Quiz | null> => {
    // Check memory cache
    const cached = quizCache.get(id);
    if (cached && isCacheValid(cached.timestamp, cached.ttl)) {
      return cached.data;
    }

    // Check localStorage
    const localCached = getFromLocalStorage<{[key: string]: CacheEntry<Quiz>}>(CACHE_KEYS.individualQuizzes);
    if (localCached) {
      const quizEntry = localCached.data[id];
      if (quizEntry && isCacheValid(quizEntry.timestamp, quizEntry.ttl)) {
        return quizEntry.data;
      }
    }

    // Fetch from API
    try {
      const response = await fetch(`/api/admin/quizzes/${id}`);
      if (response.ok) {
        const data = await response.json();
        const quiz = data.quiz;

        // Update memory cache
        const newCache = new Map(quizCache);
        newCache.set(id, {
          data: quiz,
          timestamp: Date.now(),
          ttl: CACHE_TTL.individualQuiz
        });
        setQuizCache(newCache);

        // Update localStorage
        const allQuizzes = localCached?.data || {};
        allQuizzes[id as keyof typeof allQuizzes] = {
          data: quiz,
          timestamp: Date.now(),
          ttl: CACHE_TTL.individualQuiz
        } as any;
        saveToLocalStorage(CACHE_KEYS.individualQuizzes, allQuizzes, CACHE_TTL.individualQuiz);

        return quiz;
      }
    } catch (error) {
      console.error('Error fetching quiz:', error);
    }
    return null;
  }, [quizCache]);

  // Get video quiz (with caching)
  const getVideoQuiz = useCallback(async (videoId: string): Promise<Quiz | null> => {
    // Check memory cache
    const cached = videoQuizCache.get(videoId);
    if (cached && isCacheValid(cached.timestamp, cached.ttl)) {
      return cached.data;
    }

    // Fetch from API
    try {
      const response = await fetch(`/api/training/videos/${videoId}/quiz`);
      if (response.ok) {
        const data = await response.json();
        const quiz = data.quiz;

        // Update memory cache
        const newCache = new Map(videoQuizCache);
        newCache.set(videoId, {
          data: quiz,
          timestamp: Date.now(),
          ttl: CACHE_TTL.individualQuiz
        });
        setVideoQuizCache(newCache);

        return quiz;
      }
    } catch (error) {
      console.error('Error fetching video quiz:', error);
    }
    return null;
  }, [videoQuizCache]);

  // Invalidate cache
  const invalidateCache = useCallback((type?: 'all' | 'videos' | 'quizzes' | 'users' | 'role') => {
    switch (type) {
      case 'videos':
        localStorage.removeItem(CACHE_KEYS.videos);
        setVideos([]);
        refreshVideos();
        break;
      case 'quizzes':
        localStorage.removeItem(CACHE_KEYS.quizzes);
        localStorage.removeItem(CACHE_KEYS.individualQuizzes);
        setQuizzes([]);
        setQuizCache(new Map());
        refreshQuizzes();
        break;
      case 'users':
        localStorage.removeItem(CACHE_KEYS.adminUsers);
        setAdminUsers([]);
        refreshAdminUsers();
        break;
      case 'role':
        localStorage.removeItem(CACHE_KEYS.userRole);
        setUserRole(null);
        refreshUserRole();
        break;
      case 'all':
      default:
        // Clear all caches
        Object.values(CACHE_KEYS).forEach(key => localStorage.removeItem(key));
        setVideos([]);
        setQuizzes([]);
        setAdminUsers([]);
        setUserRole(null);
        setQuizCache(new Map());
        setVideoQuizCache(new Map());
        // Refresh all
        refreshUserRole();
        refreshVideos();
        refreshQuizzes();
        if (isAdmin) refreshAdminUsers();
        break;
    }
  }, [refreshUserRole, refreshVideos, refreshQuizzes, refreshAdminUsers, isAdmin]);

  // Initial load - check for cached data first
  useEffect(() => {
    refreshUserRole();
    refreshVideos();
    refreshQuizzes();
  }, []);

  // Load admin data when role changes to admin
  useEffect(() => {
    if (isAdmin) {
      refreshAdminUsers();
    }
  }, [isAdmin, refreshAdminUsers]);

  const value: DataContextType = {
    userRole,
    videos,
    quizzes,
    adminUsers,
    isAdmin,
    isLoadingRole,
    isLoadingVideos,
    isLoadingQuizzes,
    isLoadingUsers,
    refreshUserRole,
    refreshVideos,
    refreshQuizzes,
    refreshAdminUsers,
    getQuizById,
    getVideoQuiz,
    invalidateCache
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}