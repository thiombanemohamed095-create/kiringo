export interface Comment {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
  likesCount: number;
  isLiked?: boolean;
}

export interface Post {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorTitle?: string;
  authorRole?: 'user' | 'persona';
  personaId?: string;
  timestamp: string;
  content: string;
  image?: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked: boolean;
  isSaved?: boolean;
  comments: Comment[];
  userReaction?: 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry' | null;
  reactions?: {
    like: number;
    love: number;
    haha: number;
    wow: number;
    sad: number;
    angry: number;
  };
}

export interface Story {
  id: string;
  userName: string;
  userAvatar: string;
  imageUrl: string;
  isViewed: boolean;
  textOverlay?: string;
}

export interface Persona {
  id: string;
  name: string;
  avatar: string;
  role: string;
  bio: string;
  tagline: string;
  status: 'online' | 'offline';
  unreadCount: number;
}

export interface Message {
  id: string;
  sender: 'user' | 'model';
  text: string;
  timestamp: string;
}

export interface Group {
  id: string;
  name: string;
  cover: string;
  membersCount: number;
  postsCount: number;
  description: string;
  isJoined: boolean;
  isFavorite?: boolean;
}

export interface MarketplaceItem {
  id: string;
  title: string;
  price: number;
  location: string;
  image: string;
  category: string;
  description: string;
  sellerName: string;
  sellerAvatar: string;
  isFavorite?: boolean;
}

export interface UserProfile {
  name: string;
  avatar: string;
  coverPhoto: string;
  bio: string;
  workplace: string;
  education: string;
  livesIn: string;
  from: string;
  relationshipStatus: string;
  followersCount: number;
  followingCount: number;
}

export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
  organizerName: string;
  organizerAvatar: string;
  participantsCount: number;
  isJoined: boolean;
  isFavorite?: boolean;
}

export interface Photo {
  id: string;
  url: string;
  caption?: string;
  createdAt: string;
}

export interface PhotoAlbum {
  id: string;
  name: string;
  description?: string;
  coverUrl: string;
  photos: Photo[];
  createdAt: string;
}


