'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: 'user' | 'owner' | 'admin';
  avatarUrl?: string;
  rating?: number;
  isVerified?: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  setHasHydrated: (hasHydrated: boolean) => void;
  login: (user: User, token: string, refreshToken: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      _hasHydrated: false,
      setHasHydrated: (hasHydrated) => set({ _hasHydrated: hasHydrated }),
      login: (user, token, refreshToken) =>
        set({ user, token, refreshToken, isAuthenticated: true, _hasHydrated: true }),
      logout: () =>
        set({ user: null, token: null, refreshToken: null, isAuthenticated: false, _hasHydrated: true }),
      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
          _hasHydrated: true,
        })),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => {
        return (state, error) => {
          if (state) {
            state.setHasHydrated(true);
          }
        };
      },
    }
  )
);

// Filter Store
interface FilterState {
  dealType?: 'rent' | 'sale';
  propertyType?: 'apartment' | 'house' | 'land';
  minPrice?: number;
  maxPrice?: number;
  rooms?: number;
  district?: number;
  hasFurniture?: boolean;
  isNewBuilding?: boolean;
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      dealType: undefined,
      propertyType: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      rooms: undefined,
      district: undefined,
      hasFurniture: undefined,
      isNewBuilding: undefined,
      setFilter: (key, value) => set({ [key]: value }),
      resetFilters: () =>
        set({
          dealType: undefined,
          propertyType: undefined,
          minPrice: undefined,
          maxPrice: undefined,
          rooms: undefined,
          district: undefined,
          hasFurniture: undefined,
          isNewBuilding: undefined,
        }),
    }),
    {
      name: 'filter-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Favorites Store
interface FavoritesState {
  favorites: string[];
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  resetFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (id) =>
        set((state) => ({
          favorites: [...state.favorites, id],
        })),
      removeFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.filter((fid) => fid !== id),
        })),
      isFavorite: (id) => get().favorites.includes(id),
      resetFavorites: () => set({ favorites: [] }),
    }),
    {
      name: 'favorites-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
