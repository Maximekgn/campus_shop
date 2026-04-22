export const UserRole = {
  MEMBER: 'membre',
  MODERATOR: 'moderateur',
} as const;
export type UserRole = typeof UserRole[keyof typeof UserRole];

export const ListingType = {
  SALE: 'vente',
  GIFT: 'don',
  SWAP: 'échange',
} as const;
export type ListingType = typeof ListingType[keyof typeof ListingType];

export const ListingStatus = {
  PUBLISHED: 'publiee',
  RESERVED: 'reservee',
  SOLD: 'vendue',
  ARCHIVED: 'archivee',
  DRAFT: 'draft',
} as const;
export type ListingStatus = typeof ListingStatus[keyof typeof ListingStatus];

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  student_id?: string;
  is_active?: boolean;
  email_verified_at?: string;
  created_at: string;
}

export interface ListingPhoto {
  id: number;
  listing_id: number;
  path: string;
  order: number;
}

export interface Listing {
  id: number;
  user_id: number;
  title: string;
  description: string;
  type: ListingType;
  price: number | null;
  status: ListingStatus;
  views_count: number;
  photos: ListingPhoto[];
  user?: User;
  categories?: Category[];
  is_favorited?: boolean;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon?: string;
}

export interface Conversation {
  id: number;
  listing_id: number;
  buyer_id: number;
  seller_id: number;
  last_message_at: string;
  listing?: Listing;
  buyer?: User;
  seller?: User;
  last_message?: string;
  unread_count?: number;
  messages?: Message[];
}

export interface Message {
  id: number;
  conversation_id: number;
  sender_id: number;
  body: string;
  read_at: string | null;
  created_at: string;
}

export interface Favorite {
  user_id: number;
  listing_id: number;
}

export interface Report {
  id: number;
  listing_id: number;
  reporter_id: number;
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
  password_confirmation: string;
  student_id?: string;
}
