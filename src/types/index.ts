export interface User {
  id: string;
  email: string;
  name: string;
  isEmailVerified: boolean;
  createdAt: Date;
}

export interface Card {
  id: string;
  userId: string;
  title: string;
  type: 'note' | 'code' | 'link' | 'file';
  content: string;
  explanation: string;
  links: string[];
  files: AttachmentFile[];
  tags: string[];
  favorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AttachmentFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

export interface CreateCardData {
  title: string;
  type: 'note' | 'code' | 'link' | 'file';
  content: string;
  explanation: string;
  links: string[];
  files: AttachmentFile[];
  tags: string[];
  favorite: boolean;
  userId: string;
}

export interface UpdateCardData {
  title?: string;
  type?: 'note' | 'code' | 'link' | 'file';
  content?: string;
  explanation?: string;
  links?: string[];
  files?: AttachmentFile[];
  tags?: string[];
  favorite?: boolean;
}

export interface SearchResult {
  cards: Card[];
  total: number;
}

export interface VerificationState {
  isVerifying: boolean;
  email: string;
  code: string;
  timeRemaining: number;
  attempts: number;
  maxAttempts: number;
  canResend: boolean;
  isLocked: boolean;
  lockUntil: Date | null;
  lastCodeSent: Date | null;
  errors: string[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  verification: VerificationState;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; needsVerification?: boolean; errorMessage?: string }>;
  logout: () => void;
  initialize: () => Promise<void>;
  sendVerificationCode: (email: string) => Promise<{ success: boolean; message?: string }>;
  verifyCode: (code: string) => Promise<{ success: boolean; message?: string }>;
  resendCode: () => Promise<{ success: boolean; message?: string }>;
  resetVerification: () => void;
  deleteAccount: () => Promise<{ success: boolean; errorMessage?: string }>;
}

export interface CardState {
  cards: Card[];
  loading: boolean;
  searchQuery: string;
  selectedTags: string[];
  addCard: (card: CreateCardData) => Promise<void>;
  updateCard: (id: string, updates: UpdateCardData) => Promise<void>;
  deleteCard: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  searchCards: (query: string) => void;
  filterByTags: (tags: string[]) => void;
  getRecentCards: () => Card[];
  getFavoriteCards: () => Card[];
  getAllTags: () => string[];
  getUserCards: (userId: string) => Card[];
  getCardById: (id: string) => Card | undefined;
  loadUserCards: (userId: string) => Promise<void>;
}