export enum UserRole {
  MEMBER = 'member',
  MODERATOR = 'moderator',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  student_id: string;
  is_active: boolean;
  created_at: string;
}

export enum ListingType {
  SALE = 'vente',
  GIFT = 'don',
  SWAP = 'échange',
}

export enum ListingStatus {
  PUBLISHED = 'publiée',
  RESERVED = 'réservée',
  SOLD = 'vendue',
  ARCHIVED = 'archivée',
}

export interface ListingPhoto {
  id: string;
  listing_id: string;
  path: string;
  order: number;
}

export interface Listing {
  id: string;
  user_id: string;
  title: string;
  description: string;
  type: ListingType;
  price: number | null;
  status: ListingStatus;
  views_count: number;
  photos: ListingPhoto[];
  user?: User;
  created_at: string;
}

export interface Conversation {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  last_message_at: string;
  listing?: Listing;
  buyer?: User;
  seller?: User;
  last_message?: string;
  unread_count?: number;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  read_at: string | null;
  created_at: string;
}

export interface Favorite {
  user_id: string;
  listing_id: string;
}

export interface Report {
  id: string;
  listing_id: string;
  reporter_id: string;
  reason: string;
  status: 'pending' | 'resolved';
  created_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  student_id: string;
}
