import React, { useState, useEffect } from "react";
import { 
  Home, 
  MessageSquare, 
  ShoppingBag, 
  Users, 
  User, 
  Search, 
  Bell, 
  Compass, 
  PlusCircle, 
  Sparkles, 
  Loader2, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Heart, 
  Star,
  MessageCircle, 
  Globe, 
  Smile, 
  ThumbsUp,
  Store,
  Grid,
  TrendingUp,
  Bookmark,
  Share2,
  Calendar,
  Trash2,
  AlertTriangle,
  Plus,
  LogIn,
  LogOut,
  UserPlus,
  Lock,
  Mail,
  Eye,
  EyeOff,
  UserCheck,
  Camera,
  Image,
  ChevronLeft,
  ChevronRight,
  X,
  Sun,
  Moon
} from "lucide-react";

import { Post, Group, MarketplaceItem, UserProfile, Comment, CommunityEvent, Photo, PhotoAlbum } from "./types";
import { INITIAL_POSTS, GROUPS, MARKETPLACE_ITEMS, DEFAULT_USER_PROFILE, PERSONAS, INITIAL_EVENTS, INITIAL_ALBUMS } from "./data";
import { EMOJI_CATEGORIES } from "./emojis";
import StoryShelf from "./components/StoryShelf";
import PostCard from "./components/PostCard";
import MessengerWidget from "./components/MessengerWidget";
import KiringoLogo from "./components/KiringoLogo";

const PRESET_AVATARS = [
  { url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80", label: "Jeune Homme" },
  { url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80", label: "Jeune Femme" },
  { url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80", label: "Sourire Serein" },
  { url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&h=150&q=80", label: "Regard Amical" },
  { url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80", label: "Voisin Chaleureux" },
  { url: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=150&h=150&q=80", label: "Voisine Éclatante" }
];

export default function App() {
  // Authentication states
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem("kiringo_logged_in");
    return saved === "true";
  });
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerBio, setRegisterBio] = useState("");
  const [registerWork, setRegisterWork] = useState("");
  const [registerLives, setRegisterLives] = useState("");
  const [registerAvatar, setRegisterAvatar] = useState("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");

  // Navigation & View States
  const [currentTab, setCurrentTab] = useState<'feed' | 'messenger' | 'marketplace' | 'groups' | 'profile' | 'saved' | 'events' | 'friends'>('feed');
  const [searchQuery, setSearchQuery] = useState("");
  
  // Data States
  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem("kiringo_posts");
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });
  
  const [groups, setGroups] = useState<Group[]>(() => {
    const saved = localStorage.getItem("kiringo_groups");
    return saved ? JSON.parse(saved) : GROUPS;
  });
  
  const [marketItems, setMarketItems] = useState<MarketplaceItem[]>(() => {
    const saved = localStorage.getItem("kiringo_market");
    return saved ? JSON.parse(saved) : MARKETPLACE_ITEMS;
  });
  
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("kiringo_profile");
    return saved ? JSON.parse(saved) : DEFAULT_USER_PROFILE;
  });

  // Notifications state
  const [notifications, setNotifications] = useState<Array<{ id: string; text: string; time: string; read: boolean }>>([
    { id: "1", text: "Amina Diallo a aimé votre commentaire.", time: "Il y a 5 min", read: false },
    { id: "2", text: "Sidy Koné a publié une nouvelle photo de Kiringo.", time: "Il y a 10 min", read: false },
    { id: "3", text: "Sébastien Dubois vous a tagué dans une recette.", time: "Il y a 1 heure", read: true }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Friend Requests / Invitations state
  const [friendRequests, setFriendRequests] = useState<Array<{ id: string; name: string; avatar: string; mutuals: number }>>([
    { id: "req-1", name: "Cédric Bukuru", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80", mutuals: 2 },
    { id: "req-2", name: "Fatoumata Sow", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&h=150&q=80", mutuals: 5 }
  ]);

  const [friendsList, setFriendsList] = useState<Array<{ id: string; name: string; avatar: string; mutuals: number; title: string }>>(() => {
    const saved = localStorage.getItem("kiringo_friends");
    return saved ? JSON.parse(saved) : [
      { id: "f-1", name: "Amina Diallo", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80", mutuals: 12, title: "Maraîchère Locale" },
      { id: "f-2", name: "Sidy Koné", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80", mutuals: 8, title: "Photographe de Quartier" },
      { id: "f-3", name: "Amadou Touré", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80", mutuals: 4, title: "Artisan Ébéniste" }
    ];
  });

  const [events, setEvents] = useState<CommunityEvent[]>(() => {
    const saved = localStorage.getItem("kiringo_events");
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  // Event Creator States
  const [eventTitle, setEventTitle] = useState("");
  const [eventDesc, setEventDesc] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLoc, setEventLoc] = useState("");
  const [eventImg, setEventImg] = useState("");
  const [showEventCreator, setShowEventCreator] = useState(false);

  // Messenger State
  const [activeChatPersonaId, setActiveChatPersonaId] = useState<string | null>(null);
  const [showMessengerFloating, setShowMessengerFloating] = useState(false);

  // Post Creator States
  const [newPostText, setNewPostText] = useState("");
  const [newPostImageUrl, setNewPostImageUrl] = useState("");
  const [showImageUrlInput, setShowImageUrlInput] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeEmojiCategory, setActiveEmojiCategory] = useState(0);
  
  // AI Helper States
  const [aiTopic, setAiTopic] = useState("");
  const [aiTone, setAiTone] = useState("Amical");
  const [isGeneratingPost, setIsGeneratingPost] = useState(false);
  const [showAiCreator, setShowAiCreator] = useState(false);

  // Profile Editor States
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editProfileName, setEditProfileName] = useState(userProfile.name);
  const [editProfileBio, setEditProfileBio] = useState(userProfile.bio);
  const [editProfileWork, setEditProfileWork] = useState(userProfile.workplace);
  const [editProfileLives, setEditProfileLives] = useState(userProfile.livesIn);

  // New Marketplace Item Creator
  const [marketTitle, setMarketTitle] = useState("");
  const [marketPrice, setMarketPrice] = useState("");
  const [marketCategory, setMarketCategory] = useState("Électronique");
  const [marketDesc, setMarketDesc] = useState("");
  const [marketImage, setMarketImage] = useState("");
  const [showMarketCreator, setShowMarketCreator] = useState(false);

  // Modals / Confirmation States
  const [groupToLeave, setGroupToLeave] = useState<Group | null>(null);
  const [itemToDelete, setItemToDelete] = useState<MarketplaceItem | null>(null);

  // Photo Albums States
  const [albums, setAlbums] = useState<PhotoAlbum[]>(() => {
    const saved = localStorage.getItem("kiringo_albums");
    return saved ? JSON.parse(saved) : INITIAL_ALBUMS;
  });
  const [profileSubTab, setProfileSubTab] = useState<'about' | 'albums'>('about');
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [fullscreenPhoto, setFullscreenPhoto] = useState<{ photo: Photo; albumPhotos: Photo[] } | null>(null);
  
  // Album creator states
  const [showAlbumCreator, setShowAlbumCreator] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState("");
  const [newAlbumDesc, setNewAlbumDesc] = useState("");
  const [newAlbumCover, setNewAlbumCover] = useState("");

  // Photo adder states
  const [showPhotoAdder, setShowPhotoAdder] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [newPhotoCaption, setNewPhotoCaption] = useState("");

  // Dark Mode state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("kiringo_dark_mode");
    return saved === "true";
  });

  useEffect(() => {
    localStorage.setItem("kiringo_dark_mode", String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const [savedCategory, setSavedCategory] = useState<'posts' | 'groups' | 'events' | 'market'>('posts');

  // Synchronize states to localStorage
  useEffect(() => {
    localStorage.setItem("kiringo_albums", JSON.stringify(albums));
  }, [albums]);
  useEffect(() => {
    localStorage.setItem("kiringo_posts", JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem("kiringo_groups", JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem("kiringo_market", JSON.stringify(marketItems));
  }, [marketItems]);

  useEffect(() => {
    localStorage.setItem("kiringo_profile", JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem("kiringo_events", JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem("kiringo_friends", JSON.stringify(friendsList));
  }, [friendsList]);

  // Post Generation handler via Gemini Server API
  const handleGenerateAiPost = async () => {
    if (!aiTopic.trim()) {
      alert("Veuillez indiquer un sujet d'inspiration pour le post !");
      return;
    }
    setIsGeneratingPost(true);
    try {
      const response = await fetch("/api/generate-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: aiTopic, tone: aiTone })
      });
      const data = await response.json();
      if (data.text) {
        setNewPostText(data.text);
        setShowAiCreator(false);
        setAiTopic("");
      } else {
        alert("Une erreur est survenue lors de la génération.");
      }
    } catch (err) {
      console.error(err);
      alert("Impossible de joindre l'IA de Kiringo. Nous utilisons une version hors-ligne.");
    } finally {
      setIsGeneratingPost(false);
    }
  };

  // Submit new user post
  const handleCreatePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newPost: Post = {
      id: `post-user-${Date.now()}`,
      authorName: userProfile.name,
      authorAvatar: userProfile.avatar,
      authorTitle: "Membre Kiringo",
      authorRole: "user",
      timestamp: "À l'instant",
      content: newPostText.trim(),
      image: newPostImageUrl.trim() || undefined,
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      isLiked: false,
      reactions: { like: 0, love: 0, haha: 0, wow: 0, sad: 0, angry: 0 },
      comments: []
    };

    setPosts([newPost, ...posts]);
    setNewPostText("");
    setNewPostImageUrl("");
    setShowImageUrlInput(false);
    setShowEmojiPicker(false);
  };

  // Handling Post reactions (like, love, wow, haha etc)
  const handleLikePost = (postId: string, reaction?: string) => {
    const updated = posts.map(post => {
      if (post.id === postId) {
        const reactions = post.reactions || { like: post.likesCount, love: 0, haha: 0, wow: 0, sad: 0, angry: 0 };
        const prevReaction = post.userReaction;

        // Decrement previous reaction if it existed
        if (prevReaction && reactions[prevReaction] > 0) {
          reactions[prevReaction] = reactions[prevReaction] - 1;
        }

        let nextReaction: typeof post.userReaction = null;
        if (reaction && reaction !== prevReaction) {
          nextReaction = reaction as any;
          reactions[reaction as keyof typeof reactions] = (reactions[reaction as keyof typeof reactions] || 0) + 1;
        }

        const nextLikesCount = Object.values(reactions).reduce((a: number, b: number) => a + b, 0);

        return {
          ...post,
          reactions,
          userReaction: nextReaction,
          likesCount: nextLikesCount,
          isLiked: nextReaction !== null
        };
      }
      return post;
    });
    setPosts(updated);
  };

  // Handling comment submission on posts
  const handleAddComment = (postId: string, commentText: string) => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      authorName: userProfile.name,
      authorAvatar: userProfile.avatar,
      content: commentText,
      timestamp: "À l'instant",
      likesCount: 0
    };

    const updated = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          commentsCount: post.commentsCount + 1,
          comments: [...post.comments, newComment]
        };
      }
      return post;
    });
    setPosts(updated);
  };

  // Open direct Messenger with a persona
  const handleOpenChatWithPersona = (personaId: string) => {
    setActiveChatPersonaId(personaId);
    setShowMessengerFloating(true);
    // Switch to messenger tab optionally if preferred, but floating widget allows viewing feed and chatting concurrently! Let's offer both options.
    setCurrentTab('messenger');
  };

  // Handle Joining/Leaving groups
  const handleToggleGroupJoin = (group: Group) => {
    if (group.isJoined) {
      setGroupToLeave(group);
    } else {
      setGroups(groups.map(g => {
        if (g.id === group.id) {
          const newNotif = {
            id: `notif-group-${Date.now()}`,
            text: `Andal nga ak mbooloo bi "${g.name}"! Teranga! 👥`,
            time: "À l'instant",
            read: false
          };
          setNotifications([newNotif, ...notifications]);
          return {
            ...g,
            isJoined: true,
            membersCount: g.membersCount + 1
          };
        }
        return g;
      }));
    }
  };

  const handleConfirmLeaveGroup = () => {
    if (!groupToLeave) return;
    setGroups(groups.map(g => {
      if (g.id === groupToLeave.id) {
        return {
          ...g,
          isJoined: false,
          membersCount: g.membersCount - 1
        };
      }
      return g;
    }));
    setGroupToLeave(null);
  };

  const handleConfirmDeleteMarketItem = () => {
    if (!itemToDelete) return;
    setMarketItems(marketItems.filter(item => item.id !== itemToDelete.id));
    setItemToDelete(null);
  };

  // Submit New Marketplace Item
  const handleCreateMarketItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!marketTitle.trim() || !marketPrice) {
      alert("Bul fatte bind turu mbir mi ak jeeg bi dëgg dëgg.");
      return;
    }

    const newItem: MarketplaceItem = {
      id: `market-${Date.now()}`,
      title: marketTitle,
      price: parseFloat(marketPrice),
      location: "Kiringo Centre",
      image: marketImage.trim() || "https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?auto=format&fit=crop&w=500&h=400&q=80",
      category: marketCategory,
      description: marketDesc,
      sellerName: userProfile.name,
      sellerAvatar: userProfile.avatar
    };

    setMarketItems([newItem, ...marketItems]);
    setMarketTitle("");
    setMarketPrice("");
    setMarketDesc("");
    setMarketImage("");
    setShowMarketCreator(false);
    
    const newNotif = {
      id: `notif-market-${Date.now()}`,
      text: `Sa mbir mi dugeul nga ko ci Luuma Gox bi! 🛍️`,
      time: "À l'instant",
      read: false
    };
    setNotifications([newNotif, ...notifications]);
  };

  // Save profile modifications
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUserProfile({
      ...userProfile,
      name: editProfileName,
      bio: editProfileBio,
      workplace: editProfileWork,
      livesIn: editProfileLives
    });
    setIsEditingProfile(false);
    
    const newNotif = {
      id: `notif-profile-${Date.now()}`,
      text: `Say xibar soppi nañu ko ak jamm! 🌿`,
      time: "À l'instant",
      read: false
    };
    setNotifications([newNotif, ...notifications]);
  };

  // Toggle bookmark / save post
  const handleToggleSavePost = (postId: string) => {
    const updated = posts.map(post => {
      if (post.id === postId) {
        const isSaved = !post.isSaved;
        const notificationText = isSaved
          ? `Denc nga mbindu ${post.authorName} ci say sibeef.`
          : `Far nga mbindu ${post.authorName} ci say sibeef.`;
        
        const newNotif = {
          id: `notif-save-${Date.now()}`,
          text: notificationText,
          time: "À l'instant",
          read: false
        };
        setNotifications([newNotif, ...notifications]);
        return { ...post, isSaved };
      }
      return post;
    });
    setPosts(updated);
  };

  // Accept a friend request
  const handleAcceptFriendRequest = (requestId: string) => {
    const request = friendRequests.find(r => r.id === requestId);
    if (!request) return;

    setFriendRequests(friendRequests.filter(r => r.id !== requestId));

    const newFriend = {
      id: `friend-user-${Date.now()}`,
      name: request.name,
      avatar: request.avatar,
      mutuals: request.mutuals,
      title: "Membre Kiringo"
    };
    setFriendsList([newFriend, ...friendsList]);

    setUserProfile(prev => ({
      ...prev,
      followersCount: prev.followersCount + 1
    }));

    const newNotif = {
      id: `notif-friend-${Date.now()}`,
      text: `Yow ak ${request.name} andal ngéen léegi ! 🤝`,
      time: "À l'instant",
      read: false
    };
    setNotifications([newNotif, ...notifications]);
  };

  // Reject a friend request
  const handleRejectFriendRequest = (requestId: string) => {
    setFriendRequests(friendRequests.filter(r => r.id !== requestId));
  };

  // Join or Leave a community event
  const handleToggleJoinEvent = (eventId: string) => {
    const updated = events.map(ev => {
      if (ev.id === eventId) {
        const isJoined = !ev.isJoined;
        
        // Add notification
        const msg = isJoined 
          ? `Bokk nga ci xew-xew bi : "${ev.title}" ! 📅`
          : `Gisatul sa bokk ci xew-xew bi : "${ev.title}".`;
        
        const newNotif = {
          id: `notif-ev-${Date.now()}`,
          text: msg,
          time: "À l'instant",
          read: false
        };
        setNotifications([newNotif, ...notifications]);

        return {
          ...ev,
          isJoined,
          participantsCount: ev.participantsCount + (isJoined ? 1 : -1)
        };
      }
      return ev;
    });
    setEvents(updated);
  };

  // Create a community event
  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) {
      alert("Bul fatte bind turu xew-xew bi dëgg dëgg.");
      return;
    }

    const newEvent: CommunityEvent = {
      id: `event-user-${Date.now()}`,
      title: eventTitle.trim(),
      description: eventDesc.trim() || "Aucune description.",
      date: eventDate.trim() || "Samedi prochain",
      location: eventLoc.trim() || "Kiringo Centre",
      image: eventImg.trim() || "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&h=300&q=80",
      organizerName: userProfile.name,
      organizerAvatar: userProfile.avatar,
      participantsCount: 1,
      isJoined: true
    };

    setEvents([newEvent, ...events]);
    
    // Reset fields
    setEventTitle("");
    setEventDesc("");
    setEventDate("");
    setEventLoc("");
    setEventImg("");
    setShowEventCreator(false);

    const newNotif = {
      id: `notif-ev-create-${Date.now()}`,
      text: `Soss nga xew-xew bi "${newEvent.title}" ci jamm ! 📅`,
      time: "À l'instant",
      read: false
    };
    setNotifications([newNotif, ...notifications]);
  };

  const handleToggleGroupFavorite = (groupId: string) => {
    setGroups(groups.map(g => {
      if (g.id === groupId) {
        return { ...g, isFavorite: !g.isFavorite };
      }
      return g;
    }));
  };

  const handleToggleEventFavorite = (eventId: string) => {
    setEvents(events.map(ev => {
      if (ev.id === eventId) {
        return { ...ev, isFavorite: !ev.isFavorite };
      }
      return ev;
    }));
  };

  const handleToggleMarketItemFavorite = (itemId: string) => {
    setMarketItems(marketItems.map(item => {
      if (item.id === itemId) {
        return { ...item, isFavorite: !item.isFavorite };
      }
      return item;
    }));
  };

  // Confirm friend invitation
  const handleAcceptFriend = (reqId: string, name: string) => {
    setFriendRequests(friendRequests.filter(r => r.id !== reqId));
    
    const newNotif = {
      id: `notif-friend-acc-${Date.now()}`,
      text: `Yow ak ${name} andal ngéen léegi ! 🤝`,
      time: "À l'instant",
      read: false
    };
    setNotifications([newNotif, ...notifications]);
  };

  // Create custom photo album
  const handleCreateAlbum = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlbumName.trim()) {
      alert("Bul fatte bind turu album bi dëgg dëgg.");
      return;
    }

    const defaultCovers = [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=500&h=300&q=80",
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=500&h=300&q=80",
      "https://images.unsplash.com/photo-1473116763269-255ea7604bb6?auto=format&fit=crop&w=500&h=300&q=80",
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=500&h=300&q=80"
    ];
    const randomCover = defaultCovers[Math.floor(Math.random() * defaultCovers.length)];

    const newAlbum: PhotoAlbum = {
      id: `album-${Date.now()}`,
      name: newAlbumName.trim(),
      description: newAlbumDesc.trim() || undefined,
      coverUrl: newAlbumCover.trim() || randomCover,
      photos: [],
      createdAt: "À l'instant"
    };

    setAlbums([newAlbum, ...albums]);
    
    // Reset inputs
    setNewAlbumName("");
    setNewAlbumDesc("");
    setNewAlbumCover("");
    setShowAlbumCreator(false);

    // Create Notification
    const newNotif = {
      id: `notif-album-create-${Date.now()}`,
      text: `Soss nga album bu bees: "${newAlbum.name}"! 📸`,
      time: "À l'instant",
      read: false
    };
    setNotifications([newNotif, ...notifications]);
  };

  // Add photo to selected album
  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAlbumId) return;
    if (!newPhotoUrl.trim()) {
      alert("Bul fatte natal URL bi.");
      return;
    }

    const newPhoto: Photo = {
      id: `photo-${Date.now()}`,
      url: newPhotoUrl.trim(),
      caption: newPhotoCaption.trim() || undefined,
      createdAt: "À l'instant"
    };

    setAlbums(albums.map(alb => {
      if (alb.id === selectedAlbumId) {
        return {
          ...alb,
          photos: [newPhoto, ...alb.photos]
        };
      }
      return alb;
    }));

    // Reset inputs
    setNewPhotoUrl("");
    setNewPhotoCaption("");
    setShowPhotoAdder(false);

    // Notification
    const newNotif = {
      id: `notif-photo-add-${Date.now()}`,
      text: `Dugeul nga nataal bu bees ci sa album! 📸`,
      time: "À l'instant",
      read: false
    };
    setNotifications([newNotif, ...notifications]);
  };

  // Delete a photo from album
  const handleDeletePhoto = (albumId: string, photoId: string) => {
    setAlbums(albums.map(alb => {
      if (alb.id === albumId) {
        return {
          ...alb,
          photos: alb.photos.filter(p => p.id !== photoId)
        };
      }
      return alb;
    }));
    // If we're deleting the photo that is currently fullscreen, close it
    if (fullscreenPhoto && fullscreenPhoto.photo.id === photoId) {
      setFullscreenPhoto(null);
    }
  };

  // Delete an entire album
  const handleDeleteAlbum = (albumId: string) => {
    const albumToDelete = albums.find(a => a.id === albumId);
    if (!albumToDelete) return;
    
    if (confirm(`Ndax dëgg dëgg bëgg nga far album "${albumToDelete.name}"?`)) {
      setAlbums(albums.filter(alb => alb.id !== albumId));
      if (selectedAlbumId === albumId) {
        setSelectedAlbumId(null);
      }
    }
  };

  const getRegisteredUsers = (): Array<UserProfile & { email: string; password?: string }> => {
    const saved = localStorage.getItem("kiringo_registered_users");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    const defaultList = [
      {
        ...DEFAULT_USER_PROFILE,
        email: "alex@kiringo.com",
        password: "password123"
      }
    ];
    localStorage.setItem("kiringo_registered_users", JSON.stringify(defaultList));
    return defaultList;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    if (!authEmail.trim() || !authPassword.trim()) {
      setAuthError("Veuillez remplir tous les champs.");
      return;
    }
    const users = getRegisteredUsers();
    const matched = users.find(u => u.email.toLowerCase() === authEmail.trim().toLowerCase());
    
    if (matched) {
      if (matched.password === authPassword) {
        // Successful login
        setUserProfile(matched);
        localStorage.setItem("kiringo_profile", JSON.stringify(matched));
        setIsLoggedIn(true);
        localStorage.setItem("kiringo_logged_in", "true");
        
        // Add welcome notification
        const welcomeNotif = {
          id: `welcome-${Date.now()}`,
          text: `Ravi de vous revoir, ${matched.name} ! Teranga mbooleen 🌿`,
          time: "À l'instant",
          read: false
        };
        setNotifications([welcomeNotif, ...notifications]);
        
        // Reset inputs
        setAuthEmail("");
        setAuthPassword("");
        setAuthError("");
      } else {
        setAuthError("Mot de passe bi baaxul dëgg dëgg.");
      }
    } else {
      setAuthError("Gisunyu compte ak e-mail bi.");
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    
    if (!registerName.trim() || !authEmail.trim() || !authPassword.trim()) {
      setAuthError("Bul fatte mbind sa Sant, E-mail ak sa Mot de passe dëgg dëgg.");
      return;
    }
    
    const users = getRegisteredUsers();
    const exists = users.some(u => u.email.toLowerCase() === authEmail.trim().toLowerCase());
    if (exists) {
      setAuthError("E-mail bi am na ku ko yor.");
      return;
    }
    
    // Create new profile
    const newProfile: UserProfile & { email: string; password?: string } = {
      name: registerName.trim(),
      email: authEmail.trim(),
      password: authPassword,
      avatar: registerAvatar,
      coverPhoto: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&h=350&q=80",
      bio: registerBio.trim() || "Dëkkandoo bu bees ci mbooloo Kiringo ! ✨",
      workplace: registerWork.trim() || "Dëkkandoo bu bees ci Kiringo",
      education: "Daara gu Mag gu Kiringo",
      livesIn: registerLives.trim() || "Kiringo, Sénégal",
      from: "Kiringo",
      relationshipStatus: "Kenn",
      followersCount: 1,
      followingCount: 10
    };
    
    // Save to users list
    const updatedUsers = [...users, newProfile];
    localStorage.setItem("kiringo_registered_users", JSON.stringify(updatedUsers));
    
    // Log in
    setUserProfile(newProfile);
    localStorage.setItem("kiringo_profile", JSON.stringify(newProfile));
    setIsLoggedIn(true);
    localStorage.setItem("kiringo_logged_in", "true");
    
    // Welcome Notification
    const welcomeNotif = {
      id: `welcome-${Date.now()}`,
      text: `Dalal jamm ci Kiringo, ${newProfile.name} ! Jamm ak Teranga ci yow ! 🌿`,
      time: "À l'instant",
      read: false
    };
    setNotifications([welcomeNotif, ...notifications]);
    
    // Reset inputs
    setRegisterName("");
    setAuthEmail("");
    setAuthPassword("");
    setRegisterBio("");
    setRegisterWork("");
    setRegisterLives("");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem("kiringo_logged_in", "false");
    setCurrentTab('feed');
  };

  // Filter lists based on Search Query
  const filteredPosts = posts.filter(post => 
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.authorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMarketItems = marketItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isLoggedIn) {
    return (
      <div id="auth-container" className="min-h-screen bg-[#FDFBF7] text-[#283618] flex items-center justify-center p-4 md:p-8 font-sans selection:bg-[#E9EDC9] selection:text-[#283618] relative overflow-hidden">
        {/* Theme Toggle on Auth Screen */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-[#FEFAE0] border border-[#E9EDC9] hover:bg-[#E9EDC9]/50 text-[#606C38] hover:text-[#283618] transition cursor-pointer z-50 shadow-sm flex items-center justify-center"
          title={darkMode ? "Leral (Mode clair)" : "Mbindum mbeur (Mode sombre)"}
        >
          {darkMode ? <Sun className="w-4 h-4 md:w-5 md:h-5" /> : <Moon className="w-4 h-4 md:w-5 md:h-5" />}
        </button>

        {/* Decorative background blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#E9EDC9] rounded-full filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2 animate-pulse animate-duration-[10s]"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FEFAE0] rounded-full filter blur-3xl opacity-50 translate-x-1/2 translate-y-1/2 animate-pulse animate-duration-[8s]"></div>

        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center z-10">
          
          {/* Left info column */}
          <div className="lg:col-span-6 flex flex-col text-left space-y-6">
            <div className="flex items-center gap-2">
              <KiringoLogo size="lg" className="text-[#283618] items-start" />
            </div>
            
            <h1 className="text-2xl md:text-4xl font-extrabold text-[#283618] tracking-tight leading-tight">
              Réseau social bu dëkkandoo yi, <span className="text-[#BC6C25] underline decoration-[#E9EDC9] decoration-4">Teranga</span> ak Dimbalante gox bi.
            </h1>
            
            <p className="text-sm md:text-base text-[#606C38] leading-relaxed">
              Kiringo day jokkale dëkkandoo yi, jaaykat yi, ràbbaalkat yi ak liggéey yu dundal gox bi ci jamono ju bees te amul metit. Noo far!
            </p>

            {/* Quick benefits grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-full bg-[#E9EDC9] flex items-center justify-center text-[#283618] font-bold shrink-0">🤝</span>
                <div>
                  <h3 className="font-extrabold text-xs text-[#283618] uppercase tracking-wider">Jàppalante & Liggéey</h3>
                  <p className="text-[11px] text-[#606C38]">Wante jump, sàkku ndimbal walla joxe sa xarala ci dëkk bi.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-full bg-[#FEFAE0] flex items-center justify-center text-[#BC6C25] font-bold shrink-0">📅</span>
                <div>
                  <h3 className="font-extrabold text-xs text-[#283618] uppercase tracking-wider">Xew-xewi Gox Bi</h3>
                  <p className="text-[11px] text-[#606C38]">Atayaa mbooloo, tàŋk-tànk yi, walla toogu ràbbaalkat yi dëkk bi.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-full bg-[#FEFAE0] flex items-center justify-center text-[#BC6C25] font-bold shrink-0">🛍️</span>
                <div>
                  <h3 className="font-extrabold text-xs text-[#283618] uppercase tracking-wider">Luuma Gox bi</h3>
                  <p className="text-[11px] text-[#606C38]">Jaay walla mayé say kër-kër, meññeefu tool walla liggéey yu bees.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-full bg-[#E9EDC9] flex items-center justify-center text-[#283618] font-bold shrink-0">🤖</span>
                <div>
                  <h3 className="font-extrabold text-xs text-[#283618] uppercase tracking-wider">Xaralay Xel (AI)</h3>
                  <p className="text-[11px] text-[#606C38]">Bind mbind yu rafet walla waxtu ak Kiringo AI bu dëgër.</p>
                </div>
              </div>
            </div>

            <div className="border-t border-[#E9EDC9] pt-4 hidden lg:block">
              <p className="text-[10px] text-[#A3B18A] uppercase tracking-wider font-extrabold">Andal ak 1,240 dëkkandoo yu dundal Kiringo Digg dëkk</p>
            </div>
          </div>

          {/* Right form column */}
          <div className="lg:col-span-6 w-full">
            <div className="bg-white rounded-[32px] border border-[#E9EDC9] shadow-xl overflow-hidden p-6 md:p-8">
              
              {/* Tab Selector */}
              <div className="flex border-b border-[#F4F1DE] mb-6">
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); setAuthError(""); }}
                  className={`flex-1 pb-3 text-xs font-black uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
                    authMode === 'login' 
                      ? "border-[#BC6C25] text-[#283618]" 
                      : "border-transparent text-[#A3B18A] hover:text-[#283618]"
                  }`}
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Duggal</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode('register'); setAuthError(""); }}
                  className={`flex-1 pb-3 text-xs font-black uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
                    authMode === 'register' 
                      ? "border-[#BC6C25] text-[#283618]" 
                      : "border-transparent text-[#A3B18A] hover:text-[#283618]"
                  }`}
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Bindu</span>
                  </div>
                </button>
              </div>

              {/* Error Box */}
              {authError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-2xl text-xs font-bold mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{authError}</span>
                </div>
              )}

              {/* LOGIN FORM */}
              {authMode === 'login' ? (
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#A3B18A] block mb-1">E-mail</label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        placeholder="Ex: samba@kiringo.com"
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        className="w-full bg-[#FDFBF7] border border-[#E9EDC9] rounded-2xl p-3 pl-10 text-xs text-[#283618] focus:ring-1 focus:ring-[#BC6C25] outline-none"
                      />
                      <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-[#A3B18A]" />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#A3B18A] block mb-1">Baat sàmm (Mot de passe)</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="Sa baat sàmm"
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        className="w-full bg-[#FDFBF7] border border-[#E9EDC9] rounded-2xl p-3 pl-10 pr-10 text-xs text-[#283618] focus:ring-1 focus:ring-[#BC6C25] outline-none"
                      />
                      <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-[#A3B18A]" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#606C38] hover:bg-[#283618] text-white font-extrabold text-xs py-3.5 rounded-full transition shadow hover:shadow-md cursor-pointer mt-2"
                  >
                    Duggal ci Kiringo
                  </button>

                  {/* Demo/Quick Connection Area */}
                  <div className="mt-4 pt-4 border-t border-[#FDFBF7]">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#A3B18A] text-center mb-2.5">Duggal gu gaaw (Démo)</p>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthEmail("alex@kiringo.com");
                        setAuthPassword("password123");
                        setAuthError("");
                      }}
                      className="w-full bg-[#FEFAE0] text-[#BC6C25] hover:bg-[#E9EDC9] border border-[#E9EDC9] text-xs font-bold py-2.5 px-4 rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Duggal and ak Samba (Démo)</span>
                    </button>
                    <p className="text-[9px] text-[#A3B18A] text-center mt-1.5">E-mail: alex@kiringo.com | Baat sàmm: password123</p>
                  </div>
                </form>
              ) : (
                /* REGISTRATION FORM */
                <form onSubmit={handleRegister} className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-1">
                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#A3B18A] block mb-1">Sa Tour ak sa Sant *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Fatou Diop"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      className="w-full bg-[#FDFBF7] border border-[#E9EDC9] rounded-2xl p-3 text-xs text-[#283618] focus:ring-1 focus:ring-[#BC6C25] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#A3B18A] block mb-1">E-mailu dugaal *</label>
                      <input
                        type="email"
                        required
                        placeholder="Ex: fatou@example.com"
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        className="w-full bg-[#FDFBF7] border border-[#E9EDC9] rounded-2xl p-3 text-xs text-[#283618] focus:ring-1 focus:ring-[#BC6C25] outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#A3B18A] block mb-1">Baat sàmm *</label>
                      <input
                        type="password"
                        required
                        placeholder="Lu mat 4 araf"
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        className="w-full bg-[#FDFBF7] border border-[#E9EDC9] rounded-2xl p-3 text-xs text-[#283618] focus:ring-1 focus:ring-[#BC6C25] outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#A3B18A] block mb-1">Sa Liggéey / Sa Role</label>
                      <input
                        type="text"
                        placeholder="Ex: Couturière, Jaaykat..."
                        value={registerWork}
                        onChange={(e) => setRegisterWork(e.target.value)}
                        className="w-full bg-[#FDFBF7] border border-[#E9EDC9] rounded-2xl p-3 text-xs text-[#283618] focus:ring-1 focus:ring-[#BC6C25] outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#A3B18A] block mb-1">Sa Dëkk walla sa Gox</label>
                      <input
                        type="text"
                        placeholder="Ex: Kiringo Digg dëkk, Ndar..."
                        value={registerLives}
                        onChange={(e) => setRegisterLives(e.target.value)}
                        className="w-full bg-[#FDFBF7] border border-[#E9EDC9] rounded-2xl p-3 text-xs text-[#283618] focus:ring-1 focus:ring-[#BC6C25] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#A3B18A] block mb-1">Li nga bëgg ci yaw (Bio)</label>
                    <textarea
                      rows={2}
                      placeholder="Bindeël tuuti mbiri sa dund walla li nga bëgg ci Kiringo..."
                      value={registerBio}
                      onChange={(e) => setRegisterBio(e.target.value)}
                      className="w-full bg-[#FDFBF7] border border-[#E9EDC9] rounded-2xl p-3 text-xs text-[#283618] focus:ring-1 focus:ring-[#BC6C25] outline-none resize-none"
                    />
                  </div>

                  {/* Avatar Selector */}
                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#A3B18A] block mb-2">Tannal sa Nataal (Avatar)</label>
                    <div className="grid grid-cols-6 gap-2">
                      {PRESET_AVATARS.map((av, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setRegisterAvatar(av.url)}
                          className={`relative rounded-full aspect-square border-2 transition overflow-hidden cursor-pointer ${
                            registerAvatar === av.url ? "border-[#BC6C25] scale-110 shadow-md" : "border-transparent hover:scale-105"
                          }`}
                          title={av.label}
                        >
                          <img src={av.url} alt={av.label} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#BC6C25] hover:bg-[#606C38] text-white font-extrabold text-xs py-3.5 rounded-full transition shadow hover:shadow-md cursor-pointer mt-2"
                  >
                    Créer sama compte te duggal
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#283618] flex flex-col font-sans selection:bg-[#E9EDC9] selection:text-[#283618]">
      
      {/* Premium Navigation Header (Natural Tones Theme) */}
      <nav className="h-16 bg-[#FEFAE0] border-b border-[#E9EDC9] flex items-center justify-between px-4 md:px-6 shrink-0 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-4 md:gap-8">
          <div 
            onClick={() => setCurrentTab('feed')}
            className="cursor-pointer select-none hover:opacity-80 transition flex items-center"
          >
            <KiringoLogo size="md" className="text-[#606C38] items-start" />
          </div>
          
          {/* Main Search Bar */}
          <div className="relative hidden sm:block">
            <input 
              type="text" 
              placeholder="Seet ci Kiringo..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#F4F1DE] text-xs font-medium border-none rounded-full py-2 pl-9 pr-4 w-52 md:w-64 text-[#283618] placeholder-[#A3B18A] focus:ring-2 focus:ring-[#BC6C25] focus:bg-white outline-none transition-all"
            />
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#A3B18A]" />
          </div>
        </div>

        {/* Center Tabs for Facebook-style navigation */}
        <div className="flex items-center gap-1 md:gap-3 bg-white/45 p-1 rounded-full border border-[#E9EDC9]">
          <button
            onClick={() => { setCurrentTab('feed'); setSearchQuery(""); }}
            className={`p-2 rounded-full transition-all cursor-pointer ${
              currentTab === 'feed' ? "bg-[#606C38] text-white shadow-sm" : "text-[#606C38] hover:bg-[#FEFAE0]"
            }`}
            title="Xew-xewi Gox bi"
          >
            <Home className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          
          <button
            onClick={() => setCurrentTab('messenger')}
            className={`p-2 rounded-full transition-all cursor-pointer ${
              currentTab === 'messenger' ? "bg-[#606C38] text-white shadow-sm" : "text-[#606C38] hover:bg-[#FEFAE0]"
            }`}
            title="Jookkoo AI"
          >
            <MessageSquare className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          
          <button
            onClick={() => setCurrentTab('marketplace')}
            className={`p-2 rounded-full transition-all cursor-pointer ${
              currentTab === 'marketplace' ? "bg-[#606C38] text-white shadow-sm" : "text-[#606C38] hover:bg-[#FEFAE0]"
            }`}
            title="Luuma Gox bi"
          >
            <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          
          <button
            onClick={() => setCurrentTab('groups')}
            className={`p-2 rounded-full transition-all cursor-pointer ${
              currentTab === 'groups' ? "bg-[#606C38] text-white shadow-sm" : "text-[#606C38] hover:bg-[#FEFAE0]"
            }`}
            title="Mbooloo yi"
          >
            <Users className="w-4 h-4 md:w-5 md:h-5" />
          </button>

          <button
            onClick={() => setCurrentTab('profile')}
            className={`p-2 rounded-full transition-all cursor-pointer ${
              currentTab === 'profile' ? "bg-[#606C38] text-white shadow-sm" : "text-[#606C38] hover:bg-[#FEFAE0]"
            }`}
            title="Sama Jëmm"
          >
            <User className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>

        {/* Right Nav Utilities */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-[#E9EDC9] hover:bg-[#606C38]/20 flex items-center justify-center text-[#283618] transition cursor-pointer"
            title={darkMode ? "Leral (Mode clair)" : "Mbindum mbeur (Mode sombre)"}
          >
            {darkMode ? <Sun className="w-4 h-4 md:w-5 md:h-5" /> : <Moon className="w-4 h-4 md:w-5 md:h-5" />}
          </button>

          {/* Notifications Button */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-[#E9EDC9] hover:bg-[#606C38]/20 flex items-center justify-center text-[#283618] relative transition cursor-pointer"
            >
              <Bell className="w-4 h-4 md:w-5 md:h-5" />
              {notifications.some(n => !n.read) && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#BC6C25] border-2 border-white rounded-full"></span>
              )}
            </button>

            {/* Notifications Dropdown Drawer */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-3xl border border-[#E9EDC9] shadow-xl p-4 z-50">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-[#606C38]">Yegle yi</h4>
                  <button 
                    onClick={() => {
                      setNotifications(notifications.map(n => ({ ...n, read: true })));
                      setShowNotifications(false);
                    }}
                    className="text-[10px] font-bold text-[#BC6C25] hover:underline"
                  >
                    Bind lu ko
                  </button>
                </div>
                <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                  {notifications.map(n => (
                    <div 
                      key={n.id} 
                      className={`p-2.5 rounded-xl text-xs flex flex-col transition ${!n.read ? "bg-[#FEFAE0] font-semibold" : "opacity-80"}`}
                    >
                      <span className="text-[#283618]">{n.text}</span>
                      <span className="text-[9px] text-[#A3B18A] mt-1">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mini User Tag */}
          <div 
            onClick={() => setCurrentTab('profile')}
            className="flex items-center gap-1.5 bg-white hover:bg-[#FEFAE0] rounded-full pr-3 pl-1 py-1 border border-[#E9EDC9] cursor-pointer transition"
          >
            <img 
              src={userProfile.avatar} 
              alt="Avatar" 
              className="w-7 h-7 rounded-full object-cover border-2 border-white shadow-sm"
              referrerPolicy="no-referrer"
            />
            <span className="text-[11px] font-bold hidden md:inline text-[#283618] truncate max-w-[80px]">
              {userProfile.name.split(" ")[0]}
            </span>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-9 h-9 md:w-auto md:px-3.5 md:h-10 rounded-full bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center gap-2 border border-red-100 transition cursor-pointer"
            title="Genn ci Kiringo"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span className="text-[11px] font-black hidden md:inline uppercase tracking-wider">Genn</span>
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Sidebar (Standard FB links & Mini profile overview) */}
        <aside className="w-full lg:w-64 bg-[#F7F2EB] p-4 flex flex-col gap-1.5 shrink-0 border-r border-[#E9EDC9] lg:sticky lg:top-16 lg:h-[calc(100vh-64px)] overflow-y-auto">
          
          {/* Quick Mini profile Card */}
          <div className="bg-white rounded-2xl border border-[#E9EDC9] p-4 text-center mb-3 shadow-sm">
            <img 
              src={userProfile.avatar} 
              alt="Avatar" 
              className="w-14 h-14 rounded-full object-cover border-2 border-[#BC6C25] mx-auto mb-2"
              referrerPolicy="no-referrer"
            />
            <h3 className="font-extrabold text-sm text-[#283618]">{userProfile.name}</h3>
            <p className="text-[10px] text-[#A3B18A] mt-1 line-clamp-2 italic px-1">"{userProfile.bio}"</p>
          </div>

          {/* Nav Links */}
          <button 
            onClick={() => { setCurrentTab('feed'); setSearchQuery(""); }}
            className={`w-full text-left flex items-center gap-3 p-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              currentTab === 'feed' ? "bg-[#E9EDC9] text-[#283618]" : "text-[#283618]/80 hover:bg-[#FEFAE0]"
            }`}
          >
            <span className="w-2.5 h-2.5 bg-[#606C38] rounded-full"></span> 
            <span>Xew-xewi Gox bi</span>
          </button>

          <button 
            onClick={() => setCurrentTab('friends')}
            className={`w-full text-left flex items-center gap-3 p-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              currentTab === 'friends' ? "bg-[#E9EDC9] text-[#283618]" : "text-[#283618]/80 hover:bg-[#FEFAE0]"
            }`}
          >
            <span className="w-2.5 h-2.5 bg-[#BC6C25] rounded-full"></span> 
            <span>Xarit yi & Toogu yi</span>
            {friendRequests.length > 0 && (
              <span className="ml-auto bg-orange-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                {friendRequests.length}
              </span>
            )}
          </button>

          <button 
            onClick={() => setCurrentTab('messenger')}
            className={`w-full text-left flex items-center gap-3 p-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              currentTab === 'messenger' ? "bg-[#E9EDC9] text-[#283618]" : "text-[#283618]/80 hover:bg-[#FEFAE0]"
            }`}
          >
            <span className="w-2.5 h-2.5 bg-[#606C38] rounded-full"></span> 
            <span>Jookkoo AI Kiringo</span>
          </button>

          <button 
            onClick={() => setCurrentTab('marketplace')}
            className={`w-full text-left flex items-center gap-3 p-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              currentTab === 'marketplace' ? "bg-[#E9EDC9] text-[#283618]" : "text-[#283618]/80 hover:bg-[#FEFAE0]"
            }`}
          >
            <span className="w-2.5 h-2.5 bg-[#D4A373] rounded-full"></span> 
            <span>Luuma Gox bi</span>
          </button>

          <button 
            onClick={() => setCurrentTab('groups')}
            className={`w-full text-left flex items-center gap-3 p-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              currentTab === 'groups' ? "bg-[#E9EDC9] text-[#283618]" : "text-[#283618]/80 hover:bg-[#FEFAE0]"
            }`}
          >
            <span className="w-2.5 h-2.5 bg-[#CCD5AE] rounded-full"></span> 
            <span>Sama Mbooloo yi</span>
          </button>

          <button 
            onClick={() => setCurrentTab('events')}
            className={`w-full text-left flex items-center gap-3 p-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              currentTab === 'events' ? "bg-[#E9EDC9] text-[#283618]" : "text-[#283618]/80 hover:bg-[#FEFAE0]"
            }`}
          >
            <span className="w-2.5 h-2.5 bg-amber-600 rounded-full"></span> 
            <span>Xew-xew yi</span>
          </button>

          <button 
            onClick={() => setCurrentTab('saved')}
            className={`w-full text-left flex items-center gap-3 p-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              currentTab === 'saved' ? "bg-[#E9EDC9] text-[#283618]" : "text-[#283618]/80 hover:bg-[#FEFAE0]"
            }`}
          >
            <span className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></span> 
            <span>Yi ma denc</span>
          </button>

          <button 
            onClick={() => setCurrentTab('profile')}
            className={`w-full text-left flex items-center gap-3 p-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              currentTab === 'profile' ? "bg-[#E9EDC9] text-[#283618]" : "text-[#283618]/80 hover:bg-[#FEFAE0]"
            }`}
          >
            <span className="w-2.5 h-2.5 bg-[#FAEDCD] rounded-full"></span> 
            <span>Sama Jëmm</span>
          </button>

          <button 
            onClick={handleLogout}
            className="w-full text-left flex items-center gap-3 p-3 rounded-xl font-bold text-xs transition-all cursor-pointer text-red-600 hover:bg-red-50"
          >
            <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span> 
            <span className="flex items-center gap-1.5 font-extrabold uppercase tracking-wider text-[10px]">
              <LogOut className="w-3.5 h-3.5" />
              <span>Genn</span>
            </span>
          </button>

          {/* AI-powered Generator Widget on Left Sidebar */}
          <div className="mt-4 pt-4 border-t border-[#E9EDC9]">
            <div className="bg-[#FEFAE0] rounded-2xl p-3 border border-[#E9EDC9]">
              <div className="flex items-center gap-1.5 mb-1.5 text-[#606C38]">
                <Sparkles className="w-4 h-4 text-[#BC6C25] shrink-0 animate-pulse" />
                <h4 className="font-extrabold text-[10px] uppercase tracking-wider">Inspirateur de Post AI 🌿</h4>
              </div>
              <p className="text-[10px] text-[#A3B18A] leading-relaxed mb-2">Am nga tàkk-tàkk? Kiringo AI day bind post bu neex ngir yaw!</p>
              
              <input 
                type="text"
                placeholder="Ex: jaay ataya, ceebu jën..."
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                className="w-full bg-white text-[11px] py-1.5 px-2.5 rounded-lg border border-[#E9EDC9] placeholder-[#A3B18A] focus:outline-none mb-2"
              />

              <div className="flex gap-1.5 mb-2.5">
                {["And", "Bees", "Ree"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setAiTone(t)}
                    className={`flex-1 py-1 text-[9px] rounded font-bold transition ${
                      aiTone === t ? "bg-[#BC6C25] text-white" : "bg-white text-[#BC6C25] border border-[#E9EDC9]"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <button
                onClick={handleGenerateAiPost}
                disabled={isGeneratingPost}
                className="w-full bg-[#606C38] hover:bg-[#283618] text-white text-[10px] font-bold py-1.5 rounded-lg transition flex items-center justify-center gap-1 cursor-pointer"
              >
                {isGeneratingPost ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Bindoogu...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3" />
                    <span>Bindal ma Post</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="mt-auto pt-3 border-t border-[#E9EDC9] text-[10px] text-[#A3B18A] text-center">
            <span>Kiringo © 2026 • Teranga Ndar</span>
          </div>
        </aside>

        {/* Central Feed / Feature Area */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          
          {/* TAB 1: FIL D'ACTUALITE */}
          {currentTab === 'feed' && (
            <div id="feed-tab-content" className="max-w-2xl mx-auto">
              
              {/* Stories Shelf */}
              <StoryShelf userAvatar={userProfile.avatar} />

              {/* Create Post Card */}
              <div className="bg-white p-5 rounded-[32px] border border-[#E9EDC9] shadow-sm mb-6">
                <div className="flex gap-3 items-center mb-4">
                  <img 
                    src={userProfile.avatar} 
                    alt="Votre profil" 
                    className="w-10 h-10 rounded-full object-cover border-2 border-[#E9EDC9]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1">
                    <div className="relative">
                      <textarea
                        placeholder={`Lu bees tey, ${userProfile.name.split(" ")[0]} ? Waxal li nekk ci sa xol...`}
                        value={newPostText}
                        onChange={(e) => setNewPostText(e.target.value)}
                        maxLength={500}
                        rows={2}
                        className="w-full bg-[#FDFBF7] text-xs py-2.5 pl-4 pr-10 rounded-2xl border border-[#E9EDC9] text-[#283618] placeholder-[#A3B18A] focus:outline-none focus:ring-1 focus:ring-[#BC6C25] resize-none"
                      />
                      {newPostText && (
                        <button
                          type="button"
                          onClick={() => setNewPostText("")}
                          className="absolute top-2 right-2.5 p-1 text-[#A3B18A] hover:text-[#BC6C25] hover:bg-[#FEFAE0] rounded-full transition cursor-pointer"
                          title="Fattali mbind mi"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <div className="flex justify-end mt-1 px-1">
                      <span className={`text-[10px] font-mono transition-colors duration-200 ${
                        newPostText.length > 475 
                          ? "text-red-500 font-bold animate-pulse" 
                          : newPostText.length > 400 
                          ? "text-[#BC6C25] font-bold" 
                          : "text-[#A3B18A]"
                      }`}>
                        {newPostText.length} / 500
                      </span>
                    </div>
                  </div>
                </div>

                {/* Optional Image Url Input */}
                {showImageUrlInput && (
                  <div className="mb-3">
                    <input 
                      type="text"
                      placeholder="Duggalal URL nataal bi (Unsplash, etc.)..."
                      value={newPostImageUrl}
                      onChange={(e) => setNewPostImageUrl(e.target.value)}
                      className="w-full bg-[#FDFBF7] text-xs py-2 px-3 rounded-xl border border-[#E9EDC9] focus:outline-none text-[#283618]"
                    />
                  </div>
                )}

                {/* Sélécteur d'Émojis Kiringo */}
                {showEmojiPicker && (
                  <div className="mb-4 p-3 bg-[#FEFAE0]/60 rounded-2xl border border-[#E9EDC9] animate-fade-in">
                    {/* Catégories d'émojis */}
                    <div className="flex gap-1 overflow-x-auto pb-2 mb-2 border-b border-[#E9EDC9] scrollbar-none">
                      {EMOJI_CATEGORIES.map((cat, idx) => (
                        <button
                          key={cat.name}
                          type="button"
                          onClick={() => setActiveEmojiCategory(idx)}
                          className={`px-2.5 py-1 text-[10px] font-bold whitespace-nowrap rounded-lg transition-all cursor-pointer ${
                            activeEmojiCategory === idx
                              ? "bg-[#606C38] text-white shadow-sm"
                              : "text-[#606C38] bg-white hover:bg-[#FEFAE0] border border-[#E9EDC9]/45"
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>

                    {/* Grille d'émojis */}
                    <div className="grid grid-cols-8 sm:grid-cols-10 gap-1.5 max-h-36 overflow-y-auto p-2 bg-white/70 rounded-xl">
                      {EMOJI_CATEGORIES[activeEmojiCategory].emojis.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => {
                            setNewPostText(prev => prev + emoji);
                          }}
                          className="w-8 h-8 flex items-center justify-center text-lg rounded-lg hover:bg-[#FEFAE0] transition duration-150 hover:scale-110 cursor-pointer"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center border-t border-[#FDFBF7] pt-3">
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => setShowImageUrlInput(!showImageUrlInput)}
                      className={`flex items-center gap-1.5 text-[11px] font-bold py-1.5 px-3 rounded-full transition cursor-pointer ${
                        showImageUrlInput
                          ? "bg-[#606C38]/10 text-[#606C38]"
                          : "text-[#606C38] hover:bg-[#FEFAE0]"
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-blue-400"></span> 
                      <span>Nataal / Liggéey</span>
                    </button>
                    <button 
                      onClick={() => {
                        setShowAiCreator(true);
                        setCurrentTab('feed'); // Keep on feed
                      }}
                      className="flex items-center gap-1.5 text-[11px] font-bold text-[#BC6C25] hover:bg-[#FEFAE0] py-1.5 px-3 rounded-full transition cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#BC6C25]" />
                      <span>Bindal ma ak AI</span>
                    </button>
                    <button 
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className={`flex items-center gap-1.5 text-[11px] font-bold py-1.5 px-3 rounded-full transition cursor-pointer ${
                        showEmojiPicker
                          ? "bg-[#BC6C25]/10 text-[#BC6C25]"
                          : "text-[#BC6C25] hover:bg-[#FEFAE0]"
                      }`}
                    >
                      <Smile className="w-3.5 h-3.5 text-[#BC6C25]" />
                      <span>Émojis</span>
                    </button>
                  </div>

                  <button 
                    onClick={handleCreatePostSubmit}
                    disabled={!newPostText.trim()}
                    className="bg-[#606C38] hover:bg-[#283618] disabled:opacity-40 text-white font-bold text-xs py-2 px-5 rounded-full shadow-sm transition cursor-pointer"
                  >
                    Yegle ko
                  </button>
                </div>
              </div>

              {/* AI Post Generator Drawer Modal */}
              {showAiCreator && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="bg-white rounded-[32px] border border-[#E9EDC9] p-6 max-w-md w-full shadow-2xl">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-[#BC6C25] animate-spin" />
                        <h3 className="font-extrabold text-base text-[#283618]">Bindal ma mbind ak Kiringo AI</h3>
                      </div>
                      <button onClick={() => setShowAiCreator(false)} className="text-[#A3B18A] hover:text-[#283618] text-sm font-bold">Ubi/Tëj</button>
                    </div>

                    <p className="text-xs text-[#606C38] mb-4">Suxalal li nga bëgg bind. Sunu AI dina ko jox aw ràbbaal bu neex te and ak teranga.</p>
                    
                    <div className="flex flex-col gap-3 mb-5">
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#A3B18A]">Li nga bëgg wax</label>
                      <textarea 
                        rows={3}
                        placeholder="Ex: Ñëwalen nu and naan Ataya tey ci ngoon ci mbedd bi"
                        value={aiTopic}
                        onChange={(e) => setAiTopic(e.target.value)}
                        className="w-full bg-[#FDFBF7] border border-[#E9EDC9] rounded-2xl p-3 text-xs text-[#283618] focus:ring-1 focus:ring-[#BC6C25] outline-none"
                      />

                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#A3B18A]">Melokan bi</label>
                      <div className="grid grid-cols-3 gap-2">
                        {["And", "Bees", "Doolé", "Liggey", "Ree", "Rax"].map((tone) => (
                          <button
                            key={tone}
                            onClick={() => setAiTone(tone)}
                            className={`py-2 text-xs font-bold rounded-xl border transition ${
                              aiTone === tone ? "bg-[#BC6C25] text-white border-[#BC6C25]" : "bg-[#FDFBF7] text-[#BC6C25] border-[#E9EDC9] hover:bg-[#FEFAE0]"
                            }`}
                          >
                            {tone}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleGenerateAiPost}
                      disabled={isGeneratingPost || !aiTopic.trim()}
                      className="w-full bg-[#606C38] hover:bg-[#283618] disabled:opacity-50 text-white font-extrabold text-xs py-3 rounded-full transition flex items-center justify-center gap-2"
                    >
                      {isGeneratingPost ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Bindoogu mbind mi...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Mbindal ma ko</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Feed posts list */}
              <div className="flex flex-col">
                {filteredPosts.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-[32px] border border-[#E9EDC9] p-6">
                    <Compass className="w-12 h-12 text-[#A3B18A] mx-auto mb-2 animate-pulse" />
                    <p className="text-sm font-bold text-[#283618]">Amul yegle yu nu gis</p>
                    <p className="text-xs text-[#A3B18A] mt-1">Seetal beneen baat walla bindal sa yegle bu jëkk!</p>
                  </div>
                ) : (
                  filteredPosts.map((post) => (
                    <PostCard 
                      key={post.id} 
                      post={post}
                      userAvatar={userProfile.avatar}
                      userName={userProfile.name}
                      onLike={handleLikePost}
                      onAddComment={handleAddComment}
                      onOpenChatWithPersona={handleOpenChatWithPersona}
                      onSave={handleToggleSavePost}
                    />
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 2: MESSAGERIE IA (MESSENGER WITH THE 4 EMBASSADORS) */}
          {currentTab === 'messenger' && (
            <div id="messenger-tab-content" className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Persona contacts directory on messenger tab left */}
              <div className="bg-white rounded-[32px] border border-[#E9EDC9] p-4 flex flex-col gap-2.5 h-[600px] overflow-y-auto">
                <h3 className="font-extrabold text-xs uppercase tracking-wider text-[#606C38] p-2">Say Ambassadeur AI</h3>
                {PERSONAS.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setActiveChatPersonaId(p.id)}
                    className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition ${
                      activeChatPersonaId === p.id || (!activeChatPersonaId && p.id === "bot")
                        ? "bg-[#FEFAE0] border border-[#E9EDC9]"
                        : "hover:bg-[#F7F2EB]"
                    }`}
                  >
                    <div className="relative">
                      <img 
                        src={p.avatar} 
                        alt={p.name} 
                        className="w-10 h-10 rounded-full object-cover border"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-xs text-[#283618]">{p.name}</span>
                        {p.unreadCount > 0 && (
                          <span className="bg-[#BC6C25] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                            {p.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-[#A3B18A] truncate mt-0.5">{p.role}</p>
                    </div>
                  </div>
                ))}

                <div className="mt-auto p-3 bg-[#FEFAE0]/50 rounded-2xl border border-[#E9EDC9] text-[10px] text-[#606C38] leading-relaxed">
                  💡 Sunu ambassadeur yi Google Gemini AI lañu andal. Waxtanal ak bënn yi, laaj leen ndimbal walla xew-xew!
                </div>
              </div>

              {/* Chat screen on right */}
              <div className="md:col-span-2">
                <MessengerWidget 
                  currentPersonaId={activeChatPersonaId || "bot"} 
                  onClose={() => setCurrentTab('feed')}
                />
              </div>
            </div>
          )}

          {/* TAB 3: MARCHE COMMUN (MARKETPLACE) */}
          {currentTab === 'marketplace' && (
            <div id="marketplace-tab-content" className="max-w-4xl mx-auto">
              
              {/* Market Header banner */}
              <div className="bg-[#FEFAE0] rounded-[32px] border border-[#E9EDC9] p-6 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-[#283618]">🛒 Luuma Gox bi Kiringo</h2>
                  <p className="text-xs text-[#606C38] mt-1">Seetal, jëndal walla jaayal say kër-kër, tusu yi walla say jumi liggéey.</p>
                </div>

                <button
                  onClick={() => setShowMarketCreator(!showMarketCreator)}
                  className="bg-[#606C38] hover:bg-[#283618] text-white text-xs font-bold py-2.5 px-5 rounded-full shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  Jaay sa wër
                </button>
              </div>

              {/* Sell form drawer */}
              {showMarketCreator && (
                <form 
                  onSubmit={handleCreateMarketItem}
                  className="bg-white rounded-[32px] border border-[#E9EDC9] p-6 mb-6 shadow-md flex flex-col gap-3 max-w-xl mx-auto animate-fade-in"
                >
                  <h3 className="font-extrabold text-sm text-[#283618] mb-1">Jaay sa wër</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-[#A3B18A] uppercase">Mbir mi</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Ex: Taabal, Watiir..."
                        value={marketTitle}
                        onChange={(e) => setMarketTitle(e.target.value)}
                        className="w-full bg-[#FDFBF7] text-xs border border-[#E9EDC9] rounded-xl p-2.5 text-[#283618] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[#A3B18A] uppercase">Jeeg (FCFA)</label>
                      <input 
                        type="number" 
                        required
                        placeholder="Ex: 45000"
                        value={marketPrice}
                        onChange={(e) => setMarketPrice(e.target.value)}
                        className="w-full bg-[#FDFBF7] text-xs border border-[#E9EDC9] rounded-xl p-2.5 text-[#283618] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-[#A3B18A] uppercase">Xeet</label>
                      <select 
                        value={marketCategory}
                        onChange={(e) => setMarketCategory(e.target.value)}
                        className="w-full bg-[#FDFBF7] text-xs border border-[#E9EDC9] rounded-xl p-2.5 text-[#283618] focus:outline-none"
                      >
                        <option>Électronique</option>
                        <option>Kër</option>
                        <option>Poy</option>
                        <option>Raaya</option>
                        <option>Leneen</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[#A3B18A] uppercase">Nataal URL</label>
                      <input 
                        type="text" 
                        placeholder="Duggalal URL nataal bi..."
                        value={marketImage}
                        onChange={(e) => setMarketImage(e.target.value)}
                        className="w-full bg-[#FDFBF7] text-xs border border-[#E9EDC9] rounded-xl p-2.5 text-[#283618] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-[#A3B18A] uppercase">Tënk (Description)</label>
                    <textarea 
                      rows={2}
                      placeholder="Bindeël ni mbir mi mel, fan la nekk..."
                      value={marketDesc}
                      onChange={(e) => setMarketDesc(e.target.value)}
                      className="w-full bg-[#FDFBF7] text-xs border border-[#E9EDC9] rounded-xl p-2.5 text-[#283618] focus:outline-none resize-none"
                    />
                  </div>

                  <div className="flex gap-2 justify-end mt-1">
                    <button 
                      type="button" 
                      onClick={() => setShowMarketCreator(false)}
                      className="bg-slate-100 hover:bg-slate-200 text-[#283618] text-xs font-bold py-2 px-4 rounded-xl"
                    >
                      Bayyi
                    </button>
                    <button 
                      type="submit"
                      className="bg-[#BC6C25] hover:bg-[#606C38] text-white text-xs font-bold py-2 px-5 rounded-xl transition"
                    >
                      Jaay ko
                    </button>
                  </div>
                </form>
              )}

              {/* Items grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredMarketItems.length === 0 ? (
                  <div className="col-span-3 text-center py-12 bg-white rounded-[32px] border border-[#E9EDC9] p-6">
                    <p className="text-sm font-bold text-[#283618]">Amul mbir mu nekk ci luuma bi tey</p>
                  </div>
                ) : (
                  filteredMarketItems.map((item) => (
                    <div 
                      key={item.id} 
                      className="bg-white rounded-[32px] border border-[#E9EDC9] overflow-hidden shadow-sm hover:shadow-md transition duration-200 flex flex-col"
                    >
                      <div className="h-44 overflow-hidden relative bg-slate-50">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute bottom-2 right-2 bg-[#BC6C25] text-white text-xs font-bold py-1 px-3 rounded-full shadow">
                          {item.price.toLocaleString()} FCFA
                        </span>
                        {/* Favorite Button */}
                        <button
                          onClick={() => handleToggleMarketItemFavorite(item.id)}
                          className="absolute top-3 right-3 p-1.5 bg-white/90 dark:bg-[#151c10]/90 backdrop-blur-xs rounded-full shadow-sm text-[#BC6C25] hover:scale-105 transition cursor-pointer flex items-center justify-center border border-[#E9EDC9]"
                          title={item.isFavorite ? "Sottil ci favori" : "Doleel ci favori"}
                        >
                          <Star className={`w-3.5 h-3.5 ${item.isFavorite ? "fill-[#BC6C25] text-[#BC6C25]" : "text-[#A3B18A]"}`} />
                        </button>
                      </div>
                      
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[9px] bg-[#E9EDC9] text-[#606C38] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            {item.category}
                          </span>
                          <h4 className="font-bold text-sm text-[#283618] mt-2 line-clamp-1">{item.title}</h4>
                          <p className="text-xs text-[#606C38] mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
                        </div>

                        <div className="pt-3 border-t border-[#FDFBF7] mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <img 
                              src={item.sellerAvatar} 
                              alt={item.sellerName} 
                              className="w-6 h-6 rounded-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <span className="text-[10px] text-[#A3B18A] truncate max-w-[80px]">Par {item.sellerName.split(" ")[0]}</span>
                          </div>
                          
                          {item.sellerName === userProfile.name ? (
                            <button
                              type="button"
                              onClick={() => setItemToDelete(item)}
                              className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 text-[10px] font-bold py-1.5 px-3 rounded-full transition cursor-pointer flex items-center gap-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Far ko</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                const foundPersona = PERSONAS.find(p => p.name.includes(item.sellerName.split(" ")[0]));
                                if (foundPersona) {
                                  handleOpenChatWithPersona(foundPersona.id);
                                } else {
                                  handleOpenChatWithPersona("bot");
                                }
                              }}
                              className="bg-[#606C38] hover:bg-[#283618] text-white text-[10px] font-bold py-1.5 px-3 rounded-full transition cursor-pointer"
                            >
                              Jookkoo
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: GROUPS (CERCLES) */}
          {currentTab === 'groups' && (
            <div id="groups-tab-content" className="max-w-4xl mx-auto">
              <div className="bg-[#FEFAE0] rounded-[32px] border border-[#E9EDC9] p-6 mb-6">
                <h2 className="text-xl font-black text-[#283618]">👥 Sama Mbooloo yi ci Kiringo</h2>
                <p className="text-xs text-[#606C38] mt-1">Andal ak mbooloo yi ngir jokkale xibar yi, liggéey walla say proset.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredGroups.map((group) => (
                  <div 
                    key={group.id}
                    className="bg-white rounded-[32px] border border-[#E9EDC9] overflow-hidden shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="h-32 bg-[#FAEDCD] relative overflow-hidden">
                        <img 
                          src={group.cover} 
                          alt={group.name} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        {/* Favorite Button */}
                        <button
                          onClick={() => handleToggleGroupFavorite(group.id)}
                          className="absolute top-3 right-3 p-1.5 bg-white/90 dark:bg-[#151c10]/90 backdrop-blur-xs rounded-full shadow-sm text-[#BC6C25] hover:scale-105 transition cursor-pointer flex items-center justify-center border border-[#E9EDC9]"
                          title={group.isFavorite ? "Sottil ci favori" : "Doleel ci favori"}
                        >
                          <Star className={`w-3.5 h-3.5 ${group.isFavorite ? "fill-[#BC6C25] text-[#BC6C25]" : "text-[#A3B18A]"}`} />
                        </button>
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold text-sm text-[#283618]">{group.name}</h4>
                        <span className="text-[10px] text-[#A3B18A] block mt-1">{group.membersCount.toLocaleString()} dëkkandoo • {group.postsCount} mbind</span>
                        <p className="text-xs text-[#606C38] mt-2 leading-relaxed">{group.description}</p>
                      </div>
                    </div>

                    <div className="p-4 pt-0">
                      <button
                        onClick={() => handleToggleGroupJoin(group)}
                        className={`w-full py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                          group.isJoined 
                            ? "bg-[#E9EDC9] text-[#606C38] hover:bg-red-50 hover:text-red-700" 
                            : "bg-[#606C38] text-white hover:bg-[#283618]"
                        }`}
                      >
                        {group.isJoined ? "✓ Andal na" : "And ak mbooloo bi"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: USER PROFILE */}
          {currentTab === 'profile' && (
            <div id="profile-tab-content" className="max-w-2xl mx-auto bg-white rounded-[32px] border border-[#E9EDC9] overflow-hidden shadow-sm">
              
              {/* Cover Photo */}
              <div className="h-44 bg-[#FAEDCD] relative">
                <img 
                  src={userProfile.coverPhoto} 
                  alt="Couverture" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Profile Header Details */}
              <div className="p-6 relative pt-0">
                <div className="flex flex-col md:flex-row items-center md:items-end gap-4 -mt-12 mb-4">
                  <img 
                    src={userProfile.avatar} 
                    alt="Votre avatar" 
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md relative z-10"
                    referrerPolicy="no-referrer"
                  />
                  <div className="text-center md:text-left flex-1">
                    <h2 className="text-lg font-black text-[#283618]">{userProfile.name}</h2>
                    <p className="text-xs text-[#A3B18A] italic">"{userProfile.bio}"</p>
                  </div>

                  <button
                    onClick={() => {
                      setIsEditingProfile(!isEditingProfile);
                      setEditProfileName(userProfile.name);
                      setEditProfileBio(userProfile.bio);
                      setEditProfileWork(userProfile.workplace);
                      setEditProfileLives(userProfile.livesIn);
                    }}
                    className="bg-[#FEFAE0] hover:bg-[#E9EDC9] text-[#BC6C25] border border-[#E9EDC9] text-xs font-bold py-1.5 px-4 rounded-full transition shrink-0 cursor-pointer"
                  >
                    {isEditingProfile ? "Tëj" : "Soppi sama profil"}
                  </button>
                </div>

                {/* Profile Editor Fields */}
                {isEditingProfile ? (
                  <form onSubmit={handleSaveProfile} className="bg-[#F7F2EB] p-4 rounded-2xl border border-[#E9EDC9] mb-4 flex flex-col gap-3">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-[#606C38]">Soppi say xibar</h3>
                    
                    <div>
                      <label className="text-[10px] font-bold text-[#A3B18A] uppercase">Sa Tur</label>
                      <input 
                        type="text" 
                        value={editProfileName} 
                        onChange={(e) => setEditProfileName(e.target.value)}
                        className="w-full bg-white text-xs border border-[#E9EDC9] rounded-xl p-2 focus:outline-none text-[#283618]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-[#A3B18A] uppercase">Sa Slogan / Bio</label>
                      <input 
                        type="text" 
                        value={editProfileBio} 
                        onChange={(e) => setEditProfileBio(e.target.value)}
                        className="w-full bg-white text-xs border border-[#E9EDC9] rounded-xl p-2 focus:outline-none text-[#283618]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-[#A3B18A] uppercase">Sa Liggéey / Sa Maqaam</label>
                        <input 
                          type="text" 
                          value={editProfileWork} 
                          onChange={(e) => setEditProfileWork(e.target.value)}
                          className="w-full bg-white text-xs border border-[#E9EDC9] rounded-xl p-2 focus:outline-none text-[#283618]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-[#A3B18A] uppercase">Fay dëkk</label>
                        <input 
                          type="text" 
                          value={editProfileLives} 
                          onChange={(e) => setEditProfileLives(e.target.value)}
                          className="w-full bg-white text-xs border border-[#E9EDC9] rounded-xl p-2 focus:outline-none text-[#283618]"
                        />
                      </div>
                    </div>

                    <button 
                      type="submit"
                      className="bg-[#BC6C25] text-white text-xs font-bold py-2 px-4 rounded-xl hover:bg-[#606C38] self-end mt-1 cursor-pointer"
                    >
                      Denc soppite yi
                    </button>
                  </form>
                ) : null}

                {/* Profile Tabs Navigation */}
                <div className="flex gap-4 border-b border-[#E9EDC9] pb-3 mb-5 mt-4">
                  <button
                    onClick={() => {
                      setProfileSubTab('about');
                      setSelectedAlbumId(null);
                    }}
                    className={`pb-1.5 text-xs font-black tracking-wider uppercase transition-all relative cursor-pointer ${
                      profileSubTab === 'about'
                        ? "text-[#606C38]"
                        : "text-[#A3B18A] hover:text-[#606C38]"
                    }`}
                  >
                    <span>Ci dëgg-dëgg</span>
                    {profileSubTab === 'about' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#606C38] rounded-full" />
                    )}
                  </button>
                  <button
                    onClick={() => setProfileSubTab('albums')}
                    className={`pb-1.5 text-xs font-black tracking-wider uppercase transition-all relative cursor-pointer flex items-center gap-1.5 ${
                      profileSubTab === 'albums'
                        ? "text-[#606C38]"
                        : "text-[#A3B18A] hover:text-[#606C38]"
                    }`}
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Say Album Nataal ({albums.length})</span>
                    {profileSubTab === 'albums' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#606C38] rounded-full" />
                    )}
                  </button>
                </div>

                {profileSubTab === 'about' ? (
                  /* About Profile Section */
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="flex flex-col gap-3">
                      <h3 className="font-black text-xs uppercase tracking-wider text-[#606C38]">Ci dëgg-dëgg</h3>
                      <div className="flex items-center gap-2.5 text-xs text-[#283618]">
                        <Briefcase className="w-4 h-4 text-[#A3B18A]" />
                        <span>{userProfile.workplace}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-xs text-[#283618]">
                        <GraduationCap className="w-4 h-4 text-[#A3B18A]" />
                        <span>{userProfile.education}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-xs text-[#283618]">
                        <MapPin className="w-4 h-4 text-[#A3B18A]" />
                        <span>Dëkk na ci <strong>{userProfile.livesIn}</strong></span>
                      </div>
                      <div className="flex items-center gap-2.5 text-xs text-[#283618]">
                        <Compass className="w-4 h-4 text-[#A3B18A]" />
                        <span>Originaire de <strong>{userProfile.from}</strong></span>
                      </div>
                      <div className="flex items-center gap-2.5 text-xs text-[#283618]">
                        <Heart className="w-4 h-4 text-[#A3B18A]" />
                        <span>Sama dund : {userProfile.relationshipStatus}</span>
                      </div>
                    </div>

                    {/* Account metrics & Badges */}
                    <div className="bg-[#FEFAE0]/50 p-4 rounded-2xl border border-[#E9EDC9] flex flex-col justify-center">
                      <h3 className="font-black text-xs uppercase tracking-wider text-[#606C38] mb-3 text-center">Say mbind ak say andandoo</h3>
                      <div className="flex justify-around text-center">
                        <div>
                          <span className="block font-black text-lg text-[#BC6C25]">{userProfile.followersCount}</span>
                          <span className="text-[10px] text-[#606C38] font-bold">Ñiy topp</span>
                        </div>
                        <div className="w-px bg-[#E9EDC9] h-10"></div>
                        <div>
                          <span className="block font-black text-lg text-[#BC6C25]">{userProfile.followingCount}</span>
                          <span className="text-[10px] text-[#606C38] font-bold">Ñi ngay topp</span>
                        </div>
                      </div>

                      <div className="mt-4 text-center bg-white py-1.5 px-3 rounded-xl border border-[#E9EDC9] text-[9px] text-[#606C38] font-bold">
                        ⭐ Dëkkandoo bu mën mbind ci Kiringo Teranga
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Custom Photo Albums Section */
                  <div className="pt-2">
                    {selectedAlbumId !== null ? (
                      /* Selected Album Detailed View */
                      (() => {
                        const activeAlbum = albums.find(a => a.id === selectedAlbumId);
                        return activeAlbum ? (
                          <div className="flex flex-col gap-4 animate-fade-in">
                            {/* Navigation row */}
                            <div className="flex justify-between items-center pb-2 border-b border-[#FDFBF7]">
                              <button
                                onClick={() => setSelectedAlbumId(null)}
                                className="flex items-center gap-1.5 text-xs font-bold text-[#606C38] hover:text-[#283618] transition cursor-pointer bg-[#FEFAE0]/50 py-1.5 px-3.5 rounded-full"
                              >
                                <ChevronLeft className="w-4 h-4" />
                                <span>Gannaaw (Albums)</span>
                              </button>

                              <button
                                onClick={() => setShowPhotoAdder(true)}
                                className="bg-[#BC6C25] hover:bg-[#606C38] text-white text-[10px] font-black px-4 py-1.5 rounded-full transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Yegg natal bu bees</span>
                              </button>
                            </div>

                            {/* Album details */}
                            <div className="bg-[#FEFAE0]/40 p-4 rounded-2xl border border-[#E9EDC9]">
                              <h3 className="font-extrabold text-sm text-[#283618]">{activeAlbum.name}</h3>
                              {activeAlbum.description && (
                                <p className="text-xs text-[#606C38] mt-1 leading-relaxed italic">{activeAlbum.description}</p>
                              )}
                              <p className="text-[9px] text-[#A3B18A] uppercase font-bold tracking-widest mt-2.5">
                                Soss nañu ko: {activeAlbum.createdAt} • {activeAlbum.photos.length} natal
                              </p>
                            </div>

                            {/* Photos Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 mt-2">
                              {activeAlbum.photos.map((photo) => (
                                <div
                                  key={photo.id}
                                  className="group relative bg-slate-50 rounded-xl overflow-hidden border border-[#E9EDC9] hover:border-[#BC6C25] transition shadow-sm cursor-pointer"
                                  onClick={() => setFullscreenPhoto({ photo, albumPhotos: activeAlbum.photos })}
                                >
                                  <div className="aspect-square w-full overflow-hidden bg-slate-100">
                                    <img
                                      src={photo.url}
                                      alt={photo.caption || activeAlbum.name}
                                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                      referrerPolicy="no-referrer"
                                    />
                                  </div>
                                  
                                  {/* Hover overlay with visual indicator */}
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-200 flex items-center justify-center">
                                    <span className="text-white text-[9px] font-bold bg-[#BC6C25]/95 px-3 py-1.5 rounded-full shadow-md">
                                      Wone plein écran
                                    </span>
                                  </div>

                                  {/* Delete Photo Button */}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeletePhoto(activeAlbum.id, photo.id);
                                    }}
                                    className="absolute top-2 right-2 bg-red-600/90 hover:bg-red-700 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition shadow duration-200 cursor-pointer"
                                    title="Supprimer la photo"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Caption banner */}
                                  {photo.caption && (
                                    <div className="p-2 bg-white/95 border-t border-[#E9EDC9] text-left">
                                      <p className="text-[10px] text-[#283618] font-semibold line-clamp-1">{photo.caption}</p>
                                    </div>
                                  )}
                                </div>
                              ))}

                              {activeAlbum.photos.length === 0 && (
                                <div className="col-span-full text-center py-10 bg-[#FDFBF7] rounded-xl border border-dashed border-[#E9EDC9] p-6">
                                  <Image className="w-8 h-8 text-[#A3B18A] mx-auto mb-2 opacity-50" />
                                  <p className="text-xs font-bold text-[#283618]">Album bi amul natal ba léegi.</p>
                                  <p className="text-[10px] text-[#606C38] mt-1">Dugeulal natal yu rafet ngir dundal album bi !</p>
                                  <button
                                    onClick={() => setShowPhotoAdder(true)}
                                    className="mt-3 bg-[#BC6C25] hover:bg-[#606C38] text-white text-[10px] font-bold px-3.5 py-1.5 rounded-xl transition cursor-pointer"
                                  >
                                    Soss Natal
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-[#606C38] italic">Album bi feeñul.</p>
                        );
                      })()
                    ) : (
                      /* Albums Grid Overview View */
                      <div className="flex flex-col gap-4 animate-fade-in">
                        <div className="flex justify-between items-center">
                          <h3 className="font-extrabold text-xs uppercase tracking-wider text-[#606C38]">Say Album Nataal</h3>
                          <button
                            onClick={() => setShowAlbumCreator(true)}
                            className="bg-[#606C38] hover:bg-[#283618] text-white text-[10px] font-black px-3.5 py-1.5 rounded-full transition flex items-center gap-1 cursor-pointer shadow-sm"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Soss Album</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                          {albums.map((album) => (
                            <div
                              key={album.id}
                              className="group bg-white rounded-2xl border border-[#E9EDC9] overflow-hidden shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between"
                            >
                              <div 
                                onClick={() => setSelectedAlbumId(album.id)}
                                className="cursor-pointer relative h-36 bg-slate-100 overflow-hidden"
                              >
                                <img
                                  src={album.coverUrl}
                                  alt={album.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
                                  <div>
                                    <h4 className="font-extrabold text-sm text-white drop-shadow-sm">{album.name}</h4>
                                    <p className="text-[10px] text-white/80 font-medium">{album.photos.length} natal</p>
                                  </div>
                                </div>
                              </div>
                              
                              {album.description && (
                                <p className="text-[11px] text-[#606C38] p-3 line-clamp-2 italic bg-[#FDFBF7]/30 border-b border-[#FDFBF7]">
                                  {album.description}
                                </p>
                              )}
                              
                              <div className="flex justify-between items-center p-2.5 bg-[#FEFAE0]/10 border-t border-[#FDFBF7]">
                                <span className="text-[9px] text-[#A3B18A] font-bold">{album.createdAt}</span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteAlbum(album.id);
                                  }}
                                  className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1.5 rounded-lg transition cursor-pointer"
                                  title="Supprimer l'album"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}

                          {/* Empty albums state */}
                          {albums.length === 0 && (
                            <div className="col-span-full text-center py-10 bg-[#FDFBF7] rounded-2xl border border-dashed border-[#E9EDC9] p-6">
                              <Camera className="w-10 h-10 text-[#A3B18A] mx-auto mb-2 opacity-60" />
                              <h4 className="font-bold text-xs text-[#283618]">Amulog ñu album mbind ci sa profil</h4>
                              <p className="text-[10px] text-[#606C38] mt-1 max-w-xs mx-auto">
                                Sossul sa album natal bu jëkk ngir denc say nataal dëkkandoo walla say mbir yu am solo !
                              </p>
                              <button
                                onClick={() => setShowAlbumCreator(true)}
                                className="mt-3 bg-[#606C38] hover:bg-[#283618] text-white text-[10px] font-black px-4 py-2 rounded-xl transition cursor-pointer"
                              >
                                Soss Album bu Bees
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>
          )}

          {/* TAB 6: SAVED POSTS & FAVORITES / ENREGISTRÉS AK FAVORIS */}
          {currentTab === 'saved' && (
            <div id="saved-tab-content" className="max-w-4xl mx-auto flex flex-col gap-6 animate-fade-in">
              <div className="bg-white p-6 rounded-[32px] border border-[#E9EDC9] shadow-sm animate-fade-in">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Bookmark className="w-5 h-5 text-[#BC6C25]" />
                      <h2 className="font-extrabold text-lg text-[#283618]">Sama Mbir yi ma Denc ak Sama Favori</h2>
                    </div>
                    <p className="text-xs text-[#606C38]">
                      Fii ngay guiss say mbind, say mbooloo, say xew-xew ak say mbir luuma yu nga denc walla yu nga bëgg ngir andal ko ci jamm.
                    </p>
                  </div>
                </div>

                {/* Sub-categories Selector */}
                <div className="flex flex-wrap gap-2 p-1.5 bg-[#FEFAE0]/40 rounded-2xl border border-[#E9EDC9]">
                  <button
                    onClick={() => setSavedCategory('posts')}
                    className={`flex-1 min-w-[120px] text-center py-2 px-3 rounded-xl text-xs font-black transition cursor-pointer ${
                      savedCategory === 'posts'
                        ? "bg-[#606C38] text-white shadow-sm"
                        : "text-[#283618] hover:bg-[#FEFAE0]"
                    }`}
                  >
                    📝 Mbind yi ({posts.filter(p => p.isSaved).length})
                  </button>
                  <button
                    onClick={() => setSavedCategory('groups')}
                    className={`flex-1 min-w-[120px] text-center py-2 px-3 rounded-xl text-xs font-black transition cursor-pointer ${
                      savedCategory === 'groups'
                        ? "bg-[#606C38] text-white shadow-sm"
                        : "text-[#283618] hover:bg-[#FEFAE0]"
                    }`}
                  >
                    👥 Mbooloo yi ({groups.filter(g => g.isFavorite).length})
                  </button>
                  <button
                    onClick={() => setSavedCategory('events')}
                    className={`flex-1 min-w-[120px] text-center py-2 px-3 rounded-xl text-xs font-black transition cursor-pointer ${
                      savedCategory === 'events'
                        ? "bg-[#606C38] text-white shadow-sm"
                        : "text-[#283618] hover:bg-[#FEFAE0]"
                    }`}
                  >
                    📅 Xew-xew yi ({events.filter(ev => ev.isFavorite).length})
                  </button>
                  <button
                    onClick={() => setSavedCategory('market')}
                    className={`flex-1 min-w-[120px] text-center py-2 px-3 rounded-xl text-xs font-black transition cursor-pointer ${
                      savedCategory === 'market'
                        ? "bg-[#606C38] text-white shadow-sm"
                        : "text-[#283618] hover:bg-[#FEFAE0]"
                    }`}
                  >
                    🛒 Luuma bi ({marketItems.filter(item => item.isFavorite).length})
                  </button>
                </div>
              </div>

              {/* Render Saved Category Content */}
              {savedCategory === 'posts' && (
                <div className="flex flex-col gap-4 animate-fade-in">
                  {posts.filter(p => p.isSaved).length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-[32px] border border-[#E9EDC9] p-8">
                      <Bookmark className="w-12 h-12 text-[#A3B18A] mx-auto mb-3 opacity-60 animate-bounce" />
                      <p className="text-sm font-bold text-[#283618]">Amul mbind mu dencagñ</p>
                      <p className="text-xs text-[#606C38] mt-1">
                        Bësal ci signet bi nekk ci ndijooru mbind yi ngir denc ko fii.
                      </p>
                    </div>
                  ) : (
                    posts.filter(p => p.isSaved).map(post => (
                      <PostCard
                        key={`saved-post-${post.id}`}
                        post={post}
                        userAvatar={userProfile.avatar}
                        userName={userProfile.name}
                        onLike={handleLikePost}
                        onAddComment={handleAddComment}
                        onOpenChatWithPersona={handleOpenChatWithPersona}
                        onSave={handleToggleSavePost}
                      />
                    ))
                  )}
                </div>
              )}

              {savedCategory === 'groups' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                  {groups.filter(g => g.isFavorite).length === 0 ? (
                    <div className="col-span-full text-center py-12 bg-white rounded-[32px] border border-[#E9EDC9] p-8">
                      <Star className="w-12 h-12 text-[#A3B18A] mx-auto mb-3 opacity-60 animate-pulse" />
                      <p className="text-sm font-bold text-[#283618]">Amul mbooloo mu nekk ci say favori</p>
                      <p className="text-xs text-[#606C38] mt-1">
                        Bësal ci bidoor (star) bi nekk ci nataalu mbooloo yi ngir andal ko fii.
                      </p>
                    </div>
                  ) : (
                    groups.filter(g => g.isFavorite).map(group => (
                      <div 
                        key={`saved-group-${group.id}`}
                        className="bg-white rounded-[32px] border border-[#E9EDC9] overflow-hidden shadow-sm flex flex-col justify-between animate-fade-in"
                      >
                        <div>
                          <div className="h-32 bg-[#FAEDCD] relative overflow-hidden">
                            <img 
                              src={group.cover} 
                              alt={group.name} 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <button
                              onClick={() => handleToggleGroupFavorite(group.id)}
                              className="absolute top-3 right-3 p-1.5 bg-white/90 dark:bg-[#151c10]/90 backdrop-blur-xs rounded-full shadow-sm text-[#BC6C25] hover:scale-105 transition cursor-pointer flex items-center justify-center border border-[#E9EDC9]"
                              title="Sottil ci favori"
                            >
                              <Star className="w-3.5 h-3.5 fill-[#BC6C25] text-[#BC6C25]" />
                            </button>
                          </div>
                          <div className="p-4">
                            <h4 className="font-bold text-sm text-[#283618]">{group.name}</h4>
                            <span className="text-[10px] text-[#A3B18A] block mt-1">{group.membersCount.toLocaleString()} dëkkandoo • {group.postsCount} mbind</span>
                            <p className="text-xs text-[#606C38] mt-2 leading-relaxed">{group.description}</p>
                          </div>
                        </div>

                        <div className="p-4 pt-0">
                          <button
                            onClick={() => handleToggleGroupJoin(group)}
                            className={`w-full py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                              group.isJoined 
                                ? "bg-[#E9EDC9] text-[#606C38] hover:bg-red-50 hover:text-red-700" 
                                : "bg-[#606C38] text-white hover:bg-[#283618]"
                            }`}
                          >
                            {group.isJoined ? "✓ Andal na" : "And ak mbooloo bi"}
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {savedCategory === 'events' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                  {events.filter(ev => ev.isFavorite).length === 0 ? (
                    <div className="col-span-full text-center py-12 bg-white rounded-[32px] border border-[#E9EDC9] p-8">
                      <Star className="w-12 h-12 text-[#A3B18A] mx-auto mb-3 opacity-60 animate-pulse" />
                      <p className="text-sm font-bold text-[#283618]">Amul xew-xew mu nekk ci say favori</p>
                      <p className="text-xs text-[#606C38] mt-1">
                        Bësal ci bidoor (star) bi nekk ci nataalu xew-xew yi ngir denc ko fii.
                      </p>
                    </div>
                  ) : (
                    events.filter(ev => ev.isFavorite).map(ev => (
                      <div key={`saved-event-${ev.id}`} className="bg-white rounded-[32px] border border-[#E9EDC9] overflow-hidden shadow-sm hover:shadow-md transition flex flex-col animate-fade-in">
                        <div className="h-40 relative">
                          <img src={ev.image} alt={ev.title} className="w-full h-full object-cover" />
                          <div className="absolute top-3 left-3 bg-[#606C38] text-white text-[9px] font-black uppercase tracking-wider py-1 px-2.5 rounded-full">
                            {ev.date}
                          </div>
                          <button
                            onClick={() => handleToggleEventFavorite(ev.id)}
                            className="absolute top-3 right-3 p-1.5 bg-white/90 dark:bg-[#151c10]/90 backdrop-blur-xs rounded-full shadow-sm text-[#BC6C25] hover:scale-105 transition cursor-pointer flex items-center justify-center border border-[#E9EDC9]"
                            title="Sottil ci favori"
                          >
                            <Star className="w-3.5 h-3.5 fill-[#BC6C25] text-[#BC6C25]" />
                          </button>
                        </div>
                        
                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="font-extrabold text-sm text-[#283618] mb-1.5 leading-snug">{ev.title}</h3>
                            <p className="text-xs text-[#606C38] line-clamp-3 mb-4">{ev.description}</p>
                            
                            <div className="flex flex-col gap-1.5 text-[11px] text-[#A3B18A] mb-4">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-3.5 h-3.5 text-[#BC6C25] shrink-0" />
                                <span className="text-[#283618]/80 font-medium truncate">{ev.location}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="w-3.5 h-3.5 text-[#BC6C25] shrink-0" />
                                <span className="text-[#283618]/80 font-medium">{ev.participantsCount} andaandoo</span>
                              </div>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-[#FDFBF7] flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <img src={ev.organizerAvatar} alt={ev.organizerName} className="w-6 h-6 rounded-full object-cover border" referrerPolicy="no-referrer" />
                              <div className="text-left">
                                <p className="text-[9px] text-[#A3B18A] leading-none">Ki ko soss :</p>
                                <p className="text-[10px] font-bold text-[#283618]">{ev.organizerName}</p>
                              </div>
                            </div>

                            <button
                              onClick={() => handleToggleJoinEvent(ev.id)}
                              className={`text-[10px] font-black py-1.5 px-3 rounded-full transition cursor-pointer border ${
                                ev.isJoined
                                  ? "bg-[#606C38] border-[#606C38] text-white"
                                  : "bg-[#FEFAE0] border-[#E9EDC9] text-[#BC6C25] hover:bg-[#E9EDC9]"
                              }`}
                            >
                              {ev.isJoined ? "✓ Bokk na" : "Bokk na"}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {savedCategory === 'market' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                  {marketItems.filter(item => item.isFavorite).length === 0 ? (
                    <div className="col-span-full text-center py-12 bg-white rounded-[32px] border border-[#E9EDC9] p-8">
                      <Star className="w-12 h-12 text-[#A3B18A] mx-auto mb-3 opacity-60 animate-pulse" />
                      <p className="text-sm font-bold text-[#283618]">Amul mbir mu nekk ci say favori luuma</p>
                      <p className="text-xs text-[#606C38] mt-1">
                        Bësal ci bidoor (star) bi nekk ci nataalu mbir yi ngir denc ko fii.
                      </p>
                    </div>
                  ) : (
                    marketItems.filter(item => item.isFavorite).map(item => (
                      <div 
                        key={`saved-market-${item.id}`} 
                        className="bg-white rounded-[32px] border border-[#E9EDC9] overflow-hidden shadow-sm hover:shadow-md transition duration-200 flex flex-col animate-fade-in"
                      >
                        <div className="h-44 overflow-hidden relative bg-slate-50">
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <span className="absolute bottom-2 right-2 bg-[#BC6C25] text-white text-xs font-bold py-1 px-3 rounded-full shadow">
                            {item.price.toLocaleString()} FCFA
                          </span>
                          <button
                            onClick={() => handleToggleMarketItemFavorite(item.id)}
                            className="absolute top-3 right-3 p-1.5 bg-white/90 dark:bg-[#151c10]/90 backdrop-blur-xs rounded-full shadow-sm text-[#BC6C25] hover:scale-105 transition cursor-pointer flex items-center justify-center border border-[#E9EDC9]"
                            title="Sottil ci favori"
                          >
                            <Star className="w-3.5 h-3.5 fill-[#BC6C25] text-[#BC6C25]" />
                          </button>
                        </div>
                        
                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <span className="text-[9px] bg-[#E9EDC9] text-[#606C38] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                              {item.category}
                            </span>
                            <h4 className="font-bold text-sm text-[#283618] mt-2 line-clamp-1">{item.title}</h4>
                            <p className="text-xs text-[#606C38] mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
                          </div>

                          <div className="pt-3 border-t border-[#FDFBF7] mt-3 flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <img 
                                src={item.sellerAvatar} 
                                alt={item.sellerName} 
                                className="w-6 h-6 rounded-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                              <span className="text-[10px] text-[#A3B18A] truncate max-w-[80px]">Par {item.sellerName.split(" ")[0]}</span>
                            </div>
                            
                            {item.sellerName === userProfile.name ? (
                              <button
                                type="button"
                                onClick={() => setItemToDelete(item)}
                                className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 text-[10px] font-bold py-1.5 px-3 rounded-full transition cursor-pointer flex items-center gap-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Far ko</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  const foundPersona = PERSONAS.find(p => p.name.includes(item.sellerName.split(" ")[0]));
                                  if (foundPersona) {
                                    handleOpenChatWithPersona(foundPersona.id);
                                  } else {
                                    handleOpenChatWithPersona("bot");
                                  }
                                }}
                                className="bg-[#606C38] hover:bg-[#283618] text-white text-[10px] font-bold py-1.5 px-3 rounded-full transition cursor-pointer"
                              >
                                Jookkoo
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 7: COMMUNITY EVENTS */}
          {currentTab === 'events' && (
            <div id="events-tab-content" className="max-w-4xl mx-auto flex flex-col gap-6 animate-fade-in">
              <div className="bg-white p-6 rounded-[32px] border border-[#E9EDC9] shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Calendar className="w-5 h-5 text-[#BC6C25]" />
                    <h2 className="font-extrabold text-lg text-[#283618]">Xew-xewi Gox bi</h2>
                  </div>
                  <p className="text-xs text-[#606C38]">
                    Seetal, andal walla sos say xew-xew ngir dëgëral jokkoo ak Teranga ci Kiringo.
                  </p>
                </div>
                <button
                  onClick={() => setShowEventCreator(true)}
                  className="bg-[#BC6C25] hover:bg-[#606C38] text-white font-black text-xs py-2.5 px-5 rounded-full shadow-md hover:shadow-lg transition self-start md:self-center cursor-pointer flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Sos xew-xew</span>
                </button>
              </div>

              {/* Event Creator Modal */}
              {showEventCreator && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-white rounded-[32px] border border-[#E9EDC9] p-6 max-w-md w-full shadow-2xl overflow-y-auto max-h-[90vh]">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-[#BC6C25]" />
                        <h3 className="font-extrabold text-base text-[#283618]">Sos xew-xew</h3>
                      </div>
                      <button onClick={() => setShowEventCreator(false)} className="text-[#A3B18A] hover:text-[#283618] text-sm font-bold">Tëj</button>
                    </div>

                    <form onSubmit={handleCreateEvent} className="flex flex-col gap-4">
                      <div>
                        <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#A3B18A] block mb-1">Turu xew-xew bi *</label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: Wextu jiwu walla Garab 🌿"
                          value={eventTitle}
                          onChange={(e) => setEventTitle(e.target.value)}
                          className="w-full bg-[#FDFBF7] border border-[#E9EDC9] rounded-2xl p-3 text-xs text-[#283618] focus:ring-1 focus:ring-[#BC6C25] outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#A3B18A] block mb-1">Tënk</label>
                        <textarea
                          rows={3}
                          placeholder="Bindeël ni xew-xew bi mel, lan lañu wara andal, ak liggéey bi..."
                          value={eventDesc}
                          onChange={(e) => setEventDesc(e.target.value)}
                          className="w-full bg-[#FDFBF7] border border-[#E9EDC9] rounded-2xl p-3 text-xs text-[#283618] focus:ring-1 focus:ring-[#BC6C25] outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#A3B18A] block mb-1">Bes ak Waxtu</label>
                          <input
                            type="text"
                            placeholder="Ex: Gaawu ci 16:30"
                            value={eventDate}
                            onChange={(e) => setEventDate(e.target.value)}
                            className="w-full bg-[#FDFBF7] border border-[#E9EDC9] rounded-2xl p-3 text-xs text-[#283618] focus:ring-1 focus:ring-[#BC6C25] outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#A3B18A] block mb-1">Fan la</label>
                          <input
                            type="text"
                            placeholder="Ex: Penccum Baobab bi"
                            value={eventLoc}
                            onChange={(e) => setEventLoc(e.target.value)}
                            className="w-full bg-[#FDFBF7] border border-[#E9EDC9] rounded-2xl p-3 text-xs text-[#283618] focus:ring-1 focus:ring-[#BC6C25] outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#A3B18A] block mb-1">Nataal URL (du dund)</label>
                        <input
                          type="url"
                          placeholder="https://images.unsplash.com/photo-..."
                          value={eventImg}
                          onChange={(e) => setEventImg(e.target.value)}
                          className="w-full bg-[#FDFBF7] border border-[#E9EDC9] rounded-2xl p-3 text-xs text-[#283618] focus:ring-1 focus:ring-[#BC6C25] outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-[#606C38] hover:bg-[#283618] text-white font-extrabold text-xs py-3 rounded-full transition shadow"
                      >
                        Wone xew-xew bi
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* Events Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {events.map((ev) => (
                  <div key={ev.id} className="bg-white rounded-[32px] border border-[#E9EDC9] overflow-hidden shadow-sm hover:shadow-md transition flex flex-col">
                    <div className="h-40 relative">
                      <img src={ev.image} alt={ev.title} className="w-full h-full object-cover" />
                      <div className="absolute top-3 left-3 bg-[#606C38] text-white text-[9px] font-black uppercase tracking-wider py-1 px-2.5 rounded-full">
                        {ev.date}
                      </div>
                      {/* Favorite Button */}
                      <button
                        onClick={() => handleToggleEventFavorite(ev.id)}
                        className="absolute top-3 right-3 p-1.5 bg-white/90 dark:bg-[#151c10]/90 backdrop-blur-xs rounded-full shadow-sm text-[#BC6C25] hover:scale-105 transition cursor-pointer flex items-center justify-center border border-[#E9EDC9]"
                        title={ev.isFavorite ? "Sottil ci favori" : "Doleel ci favori"}
                      >
                        <Star className={`w-3.5 h-3.5 ${ev.isFavorite ? "fill-[#BC6C25] text-[#BC6C25]" : "text-[#A3B18A]"}`} />
                      </button>
                    </div>
                    
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-extrabold text-sm text-[#283618] mb-1.5 leading-snug">{ev.title}</h3>
                        <p className="text-xs text-[#606C38] line-clamp-3 mb-4">{ev.description}</p>
                        
                        <div className="flex flex-col gap-1.5 text-[11px] text-[#A3B18A] mb-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-[#BC6C25] shrink-0" />
                            <span className="text-[#283618]/80 font-medium truncate">{ev.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-3.5 h-3.5 text-[#BC6C25] shrink-0" />
                            <span className="text-[#283618]/80 font-medium">{ev.participantsCount} andaandoo</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#FDFBF7] flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <img src={ev.organizerAvatar} alt={ev.organizerName} className="w-6 h-6 rounded-full object-cover border" referrerPolicy="no-referrer" />
                          <div className="text-left">
                            <p className="text-[9px] text-[#A3B18A] leading-none">Ki ko soss :</p>
                            <p className="text-[10px] font-bold text-[#283618]">{ev.organizerName}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleToggleJoinEvent(ev.id)}
                          className={`text-[10px] font-black py-1.5 px-3 rounded-full transition cursor-pointer border ${
                            ev.isJoined
                              ? "bg-[#606C38] border-[#606C38] text-white"
                              : "bg-[#FEFAE0] border-[#E9EDC9] text-[#BC6C25] hover:bg-[#E9EDC9]"
                          }`}
                        >
                          {ev.isJoined ? "✓ Bokk na" : "Bokk na"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: FRIENDS & CONNECTION INVITATIONS */}
          {currentTab === 'friends' && (
            <div id="friends-tab-content" className="max-w-4xl mx-auto flex flex-col gap-6 animate-fade-in">
              <div className="bg-white p-6 rounded-[32px] border border-[#E9EDC9] shadow-sm">
                <div className="flex items-center gap-2 mb-1.5">
                  <Users className="w-5 h-5 text-[#BC6C25]" />
                  <h2 className="font-extrabold text-lg text-[#283618]">Say andandoo ak Jokkoo Teranga</h2>
                </div>
                <p className="text-xs text-[#606C38]">
                  Sama jokkoo yi, nangu say andandoo ci gox bi ak dëkkandoo yi ci Kiringo.
                </p>
              </div>

              {/* SECTION: INVITATIONS */}
              <div className="bg-white p-5 rounded-[32px] border border-[#E9EDC9]">
                <h3 className="font-extrabold text-xs uppercase tracking-wider text-[#606C38] mb-4 flex items-center gap-2">
                  <span>Demandes de connexion en attente</span>
                  {friendRequests.length > 0 && (
                    <span className="bg-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                      {friendRequests.length}
                    </span>
                  )}
                </h3>

                {friendRequests.length === 0 ? (
                  <p className="text-xs text-center text-[#A3B18A] py-4 italic">Amul laaj bu weesu leegi.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {friendRequests.map((req) => (
                      <div key={req.id} className="bg-[#FDFBF7] border border-[#E9EDC9] rounded-2xl p-4 flex gap-4 items-center justify-between">
                        <div className="flex gap-3 items-center">
                          <img src={req.avatar} alt={req.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" referrerPolicy="no-referrer" />
                          <div>
                            <h4 className="font-bold text-xs text-[#283618]">{req.name}</h4>
                            <p className="text-[10px] text-[#606C38]">{req.mutuals} andandoo buñu bokk</p>
                          </div>
                        </div>

                        <div className="flex gap-1.5 flex-wrap">
                          <button
                            onClick={() => handleAcceptFriendRequest(req.id)}
                            className="bg-[#BC6C25] hover:bg-[#606C38] text-white text-[10px] font-bold px-3 py-1.5 rounded-xl transition cursor-pointer"
                          >
                            Nangu
                          </button>
                          <button
                            onClick={() => handleRejectFriendRequest(req.id)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold px-3 py-1.5 rounded-xl transition cursor-pointer"
                          >
                            Bànñ
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SECTION: FRIENDS DIRECTORY */}
              <div className="bg-white p-5 rounded-[32px] border border-[#E9EDC9]">
                <h3 className="font-extrabold text-xs uppercase tracking-wider text-[#606C38] mb-4">
                  Sama andandoo yi ci Kiringo ({friendsList.length} andandoo)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {friendsList.map((f) => (
                    <div key={f.id} className="bg-[#FDFBF7] border border-[#E9EDC9] rounded-2xl p-4 flex flex-col items-center text-center">
                      <img src={f.avatar} alt={f.name} className="w-16 h-16 rounded-full object-cover border-2 border-[#BC6C25] mb-2 shadow-sm" referrerPolicy="no-referrer" />
                      <h4 className="font-black text-xs text-[#283618]">{f.name}</h4>
                      <p className="text-[9px] text-[#BC6C25] font-bold uppercase tracking-wider mb-2">{f.title}</p>
                      <p className="text-[10px] text-[#A3B18A] mb-4">{f.mutuals} andandoo buñu bokk</p>
                      
                      <button
                        onClick={() => {
                          const matchedPersona = PERSONAS.find(p => p.name.includes(f.name.split(" ")[0])) || PERSONAS[0];
                          handleOpenChatWithPersona(matchedPersona.id);
                        }}
                        className="w-full bg-[#E9EDC9] text-[#283618] hover:bg-[#606C38] hover:text-white transition text-[10px] font-bold py-1.5 rounded-xl cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Bindeël ko</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </main>

        {/* Right Sidebar (Invitations & Online Members) */}
        <aside className="w-full lg:w-72 p-4 md:p-6 flex flex-col gap-6 shrink-0 lg:sticky lg:top-16 lg:h-[calc(100vh-64px)] overflow-y-auto bg-[#FDFBF7]">
          
          {/* Friend requests invitation panel */}
          {friendRequests.length > 0 && (
            <div id="invitations-panel">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-[10px] uppercase tracking-widest text-[#606C38] font-black">Say andandoo ({friendRequests.length})</h3>
              </div>
              
              <div className="flex flex-col gap-2.5">
                {friendRequests.map(req => (
                  <div key={req.id} className="bg-white rounded-2xl border border-[#E9EDC9] p-3.5 shadow-sm">
                    <div className="flex gap-2.5 items-center mb-2.5">
                      <img 
                        src={req.avatar} 
                        alt={req.name} 
                        className="w-10 h-10 rounded-full object-cover border"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <p className="text-xs font-bold text-[#283618]">{req.name}</p>
                        <p className="text-[9px] text-[#A3B18A]">{req.mutuals} andandoo buñu bokk</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleAcceptFriend(req.id, req.name)}
                        className="flex-1 bg-[#BC6C25] hover:bg-[#606C38] text-white text-[9px] font-bold py-1.5 rounded-lg transition cursor-pointer"
                      >
                        Nangu
                      </button>
                      <button 
                        onClick={() => setFriendRequests(friendRequests.filter(r => r.id !== req.id))}
                        className="flex-1 bg-[#F4F1DE] hover:bg-[#E9EDC9] text-[#283618] text-[9px] font-bold py-1.5 rounded-lg transition cursor-pointer"
                      >
                        Far
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Members online directory list */}
          <div>
            <h3 className="text-[10px] uppercase tracking-widest text-[#606C38] font-black mb-3">Ñi nekk ci internet ({PERSONAS.length})</h3>
            <div className="flex flex-col gap-3.5 bg-white p-3.5 rounded-2xl border border-[#E9EDC9] shadow-sm">
              {PERSONAS.map((p) => (
                <div 
                  key={p.id}
                  onClick={() => handleOpenChatWithPersona(p.id)}
                  className="flex items-center justify-between cursor-pointer hover:bg-[#FEFAE0]/60 p-1.5 rounded-xl transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img 
                        src={p.avatar} 
                        alt={p.name} 
                        className="w-8 h-8 rounded-full object-cover border"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-white"></div>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-[#283618] block">{p.name}</span>
                      <span className="text-[8px] text-[#606C38] font-bold uppercase tracking-wider bg-[#E9EDC9] px-1 rounded">
                        {p.id === "bot" ? "Support" : "IA"}
                      </span>
                    </div>
                  </div>
                  
                  <span className="text-[9px] text-[#BC6C25] font-bold hover:underline">Waxtaan</span>
                </div>
              ))}
            </div>
          </div>

          {/* Events calendar widget */}
          <div className="bg-[#FEFAE0] rounded-[32px] border border-[#E9EDC9] p-4 text-center">
            <div className="flex justify-center mb-1 text-[#BC6C25]">
              <Calendar className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-xs text-[#283618]">Xew-xew Kiringo</h4>
            <p className="text-[10px] text-[#606C38] leading-relaxed mt-1">
              "Besu Teranga ak Partas" bu Amina Diallo soss ci Gaawu bi !
            </p>
            <button 
              onClick={() => {
                const newNotif = {
                  id: `notif-sidebar-ev-${Date.now()}`,
                  text: `Bokk nga ci xew-xew bi: "Besu Teranga ak Partas"! 📅`,
                  time: "À l'instant",
                  read: false
                };
                setNotifications([newNotif, ...notifications]);
              }}
              className="mt-2.5 w-full bg-[#606C38] hover:bg-[#283618] text-white text-[9px] font-bold py-1 px-3 rounded-full transition cursor-pointer"
            >
              Bokk na
            </button>
          </div>

        </aside>

      </div>

      {/* Leave Group Modal */}
      {groupToLeave && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in" id="leave-group-modal">
          <div className="bg-white rounded-[32px] border-2 border-[#E9EDC9] p-6 max-w-sm w-full shadow-2xl relative transform scale-100 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-center font-black text-base text-[#283618]">Bayyi mbooloo mi?</h3>
            <p className="text-center text-xs text-[#606C38] mt-2 mb-6 leading-relaxed">
              Ndax dëgg dëgg bëgg nga bayyi mbooloo discussion ak kello gu <strong>"{groupToLeave.name}"</strong> ? Dootuloo jot senn xew-xew walla proset gox bi.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => setGroupToLeave(null)}
                className="flex-1 py-2.5 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[#283618] rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Bayyi
              </button>
              <button
                type="button"
                onClick={handleConfirmLeaveGroup}
                className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow-md cursor-pointer"
              >
                Waaw, bayyi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Marketplace Item Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in" id="delete-market-item-modal">
          <div className="bg-white rounded-[32px] border-2 border-red-100 p-6 max-w-sm w-full shadow-2xl relative transform scale-100 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600 mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-center font-black text-base text-[#283618]">Far mbir mi ci luuma bi?</h3>
            <p className="text-center text-xs text-[#606C38] mt-2 mb-6 leading-relaxed">
              Ndax dëgg dëgg bëgg nga far jaay bi ngir <strong>"{itemToDelete.title}"</strong> ({itemToDelete.price.toLocaleString()} FCFA) ? Mbir mi dootul delsi gannaaw.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="flex-1 py-2.5 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[#283618] rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Bayyi
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteMarketItem}
                className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow-md cursor-pointer"
              >
                Waaw, far
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Album Creator Modal */}
      {showAlbumCreator && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-[32px] border border-[#E9EDC9] p-6 max-w-md w-full shadow-2xl relative transform scale-100 transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#BC6C25]" />
                <h3 className="font-extrabold text-base text-[#283618]">Soss Album bu bees</h3>
              </div>
              <button 
                onClick={() => setShowAlbumCreator(false)}
                className="text-[#A3B18A] hover:text-[#283618] text-xs font-bold bg-[#FEFAE0]/70 hover:bg-[#E9EDC9] px-2.5 py-1 rounded-full transition cursor-pointer"
              >
                Tëj
              </button>
            </div>

            <form onSubmit={handleCreateAlbum} className="flex flex-col gap-3.5">
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-[#A3B18A]">Turu Album (Nom)</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Sama mbooloo ci Ndar 🌊"
                  value={newAlbumName}
                  onChange={(e) => setNewAlbumName(e.target.value)}
                  className="w-full mt-1 bg-[#FDFBF7] border border-[#E9EDC9] rounded-xl p-2.5 text-xs text-[#283618] focus:ring-1 focus:ring-[#BC6C25] outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-[#A3B18A]">Leeral (Description)</label>
                <textarea
                  rows={2}
                  placeholder="Ex: Say natal yu am solo dëkk-dëkk..."
                  value={newAlbumDesc}
                  onChange={(e) => setNewAlbumDesc(e.target.value)}
                  className="w-full mt-1 bg-[#FDFBF7] border border-[#E9EDC9] rounded-xl p-2.5 text-xs text-[#283618] focus:ring-1 focus:ring-[#BC6C25] outline-none resize-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-[#A3B18A]">Nataalu cover (URL)</label>
                <input
                  type="text"
                  placeholder="Ex: https://images.unsplash.com/photo-..."
                  value={newAlbumCover}
                  onChange={(e) => setNewAlbumCover(e.target.value)}
                  className="w-full mt-1 bg-[#FDFBF7] border border-[#E9EDC9] rounded-xl p-2.5 text-xs text-[#283618] focus:ring-1 focus:ring-[#BC6C25] outline-none"
                />
                <span className="text-[9px] text-[#A3B18A] mt-1 block">Bayyi ko empty ngir jox ko nataalu Ndar bu jamm!</span>
              </div>

              <button
                type="submit"
                className="w-full mt-2 bg-[#606C38] hover:bg-[#283618] text-white font-extrabold text-xs py-3 rounded-full transition shadow-md cursor-pointer"
              >
                Soss Album
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Photo Adder Modal */}
      {showPhotoAdder && selectedAlbumId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-[32px] border border-[#E9EDC9] p-6 max-w-md w-full shadow-2xl relative transform scale-100 transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Image className="w-5 h-5 text-[#BC6C25]" />
                <h3 className="font-extrabold text-base text-[#283618]">Yegg natal bu bees</h3>
              </div>
              <button 
                onClick={() => setShowPhotoAdder(false)}
                className="text-[#A3B18A] hover:text-[#283618] text-xs font-bold bg-[#FEFAE0]/70 hover:bg-[#E9EDC9] px-2.5 py-1 rounded-full transition cursor-pointer"
              >
                Tëj
              </button>
            </div>

            <form onSubmit={handleAddPhoto} className="flex flex-col gap-3.5">
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-[#A3B18A]">Nataalu URL (Lien)</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: https://images.unsplash.com/photo-..."
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  className="w-full mt-1 bg-[#FDFBF7] border border-[#E9EDC9] rounded-xl p-2.5 text-xs text-[#283618] focus:ring-1 focus:ring-[#BC6C25] outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-[#A3B18A]">Kàddu natal (Légende)</label>
                <input
                  type="text"
                  placeholder="Ex: Ataya bu neex ci suba gi 🌅"
                  value={newPhotoCaption}
                  onChange={(e) => setNewPhotoCaption(e.target.value)}
                  className="w-full mt-1 bg-[#FDFBF7] border border-[#E9EDC9] rounded-xl p-2.5 text-xs text-[#283618] focus:ring-1 focus:ring-[#BC6C25] outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 bg-[#BC6C25] hover:bg-[#606C38] text-white font-extrabold text-xs py-3 rounded-full transition shadow-md cursor-pointer"
              >
                Yegg Natal
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {fullscreenPhoto && (
        <div 
          className="fixed inset-0 z-[150] bg-black/95 flex flex-col items-center justify-between p-4 animate-fade-in"
          onClick={() => setFullscreenPhoto(null)}
        >
          {/* Top bar with counter & close */}
          <div className="w-full max-w-5xl flex justify-between items-center text-white/90 z-20 pb-2">
            <span className="text-xs font-bold font-mono tracking-wider bg-black/40 px-3.5 py-1.5 rounded-full">
              {fullscreenPhoto.albumPhotos.indexOf(fullscreenPhoto.photo) + 1} / {fullscreenPhoto.albumPhotos.length}
            </span>
            <button
              onClick={() => setFullscreenPhoto(null)}
              className="bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-full transition cursor-pointer"
              title="Tëj"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main stage with image and navigation arrows */}
          <div className="flex-1 w-full max-w-5xl flex items-center justify-between gap-4 relative">
            {/* Left Arrow Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                const currIdx = fullscreenPhoto.albumPhotos.indexOf(fullscreenPhoto.photo);
                const prevIdx = (currIdx - 1 + fullscreenPhoto.albumPhotos.length) % fullscreenPhoto.albumPhotos.length;
                setFullscreenPhoto({
                  photo: fullscreenPhoto.albumPhotos[prevIdx],
                  albumPhotos: fullscreenPhoto.albumPhotos
                });
              }}
              className="bg-white/10 hover:bg-white/20 hover:scale-105 active:scale-95 text-white p-3.5 rounded-full transition z-20 cursor-pointer"
              title="Gannaaw (Précédent)"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Main Image Container */}
            <div 
              className="flex-1 max-h-[75vh] flex items-center justify-center overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={fullscreenPhoto.photo.url}
                alt={fullscreenPhoto.photo.caption || "Aperçu plein écran"}
                className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl border border-white/10 animate-fade-in"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Right Arrow Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                const currIdx = fullscreenPhoto.albumPhotos.indexOf(fullscreenPhoto.photo);
                const nextIdx = (currIdx + 1) % fullscreenPhoto.albumPhotos.length;
                setFullscreenPhoto({
                  photo: fullscreenPhoto.albumPhotos[nextIdx],
                  albumPhotos: fullscreenPhoto.albumPhotos
                });
              }}
              className="bg-white/10 hover:bg-white/20 hover:scale-105 active:scale-95 text-white p-3.5 rounded-full transition z-20 cursor-pointer"
              title="Kananam (Suivant)"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Caption and Actions */}
          <div 
            className="w-full max-w-3xl text-center bg-black/65 backdrop-blur-md border border-white/10 p-4.5 rounded-2xl mb-4 z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-white text-sm font-bold tracking-wide">
              {fullscreenPhoto.photo.caption || "Sama nataalu Kiringo 🌿"}
            </p>
            {fullscreenPhoto.photo.createdAt && (
              <span className="text-[10px] text-white/60 block mt-1">
                Dugeul nañu ko: {fullscreenPhoto.photo.createdAt}
              </span>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
