import { API_URL } from '@/lib/api';

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  propertyType: 'apartment' | 'house' | 'land';
  dealType: 'rent' | 'sale';
  rooms?: number;
  area: number;
  floor?: number;
  totalFloors?: number;
  address: string;
  districtName?: string;
  districtNameRu?: string;
  lat: number;
  lng: number;
  hasFurniture: boolean;
  isNewBuilding: boolean;
  status: string;
  viewsCount: number;
  favoritesCount: number;
  primaryPhoto?: string;
  photos?: Photo[];
  ownerName?: string;
  ownerPhone?: string;
  ownerRating?: number;
  createdAt: string;
  isFavorite?: boolean;
  highlightColor?: string;
  isTop?: boolean;
  isFeatured?: boolean;
}

export interface Photo {
  id: string;
  url: string;
  thumbnailUrl?: string;
  orderIndex: number;
  isPrimary: boolean;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: 'user' | 'owner' | 'admin';
  avatarUrl?: string;
  rating?: number;
  reviewsCount?: number;
  isVerified?: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text?: string;
  imageUrl?: string;
  isRead: boolean;
  createdAt: string;
  senderName?: string;
  senderAvatar?: string;
}

export interface Conversation {
  id: string;
  participant1Id: string;
  participant2Id: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
  otherUserId: string;
  otherUserName: string;
  otherUserAvatar: string;
  listingTitle?: string;
  listingPhoto?: string;
}

export interface Promotion {
  id: string;
  listingId: string;
  type: 'boost' | 'highlight' | 'top' | 'recommended';
  price: number;
  durationDays: number;
  startDate: string;
  endDate: string;
  status: 'pending' | 'active' | 'expired' | 'cancelled';
}

export const DISTRICTS = [
  { id: 1, name: 'Київський', nameRu: 'Киевский' },
  { id: 2, name: 'Калінінський', nameRu: 'Калининский' },
  { id: 3, name: 'Ворошиловський', nameRu: 'Ворошиловский' },
  { id: 4, name: 'Будьонівський', nameRu: 'Будённовский' },
  { id: 5, name: 'Кіровський', nameRu: 'Кировский' },
  { id: 6, name: 'Петровський', nameRu: 'Петровский' },
  { id: 7, name: 'Пролетарський', nameRu: 'Пролетарский' },
];

export const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Квартира', labelRu: 'Квартира' },
  { value: 'house', label: 'Дом', labelRu: 'Дом' },
  { value: 'land', label: 'Участок', labelRu: 'Участок' },
];

export const DEAL_TYPES = [
  { value: 'rent', label: 'Оренда', labelRu: 'Аренда' },
  { value: 'sale', label: 'Продаж', labelRu: 'Продажа' },
];

export const PROMOTION_TYPES = [
  { type: 'boost', name: 'Поднять в поиске', price: 10 },
  { type: 'highlight', name: 'Выделить цветом', price: 10 },
  { type: 'top', name: 'Закрепить в топе', price: 20 },
  { type: 'recommended', name: 'Рекомендуемые', price: 25 },
];
