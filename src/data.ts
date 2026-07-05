import { Post, Story, Persona, Group, MarketplaceItem, UserProfile, PhotoAlbum } from "./types";

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: "Samba Diop",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
  coverPhoto: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&h=350&q=80",
  bio: "Bëgg liggéeyal gox bi, jokkoo ak dëkkandoo yi te janti mbir yu am solo ci Kiringo. Anu mbay! 🇸🇳",
  workplace: "Ràbbaal dëkk bi ci Kiringo Studio",
  education: "Daara Ju Mag yu Ndakaaru (UCAD)",
  livesIn: "Kiringo, Sénégal",
  from: "Saint-Louis (Ndar), Sénégal",
  relationshipStatus: "Kenn",
  followersCount: 1240,
  followingCount: 480
};

export const PERSONAS: Persona[] = [
  {
    id: "amina",
    name: "Amina Ndiaye",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=150&h=150&q=80",
    role: "Ndimmalu Gox Bi",
    bio: "Kuy sopp jàppalante dëkkandoo yi ak liggéeyal jàngu bi ci Kiringo.",
    tagline: "Teranga ci ree ak jàppalante dëkkandoo la tàmbali! 🇸🇳",
    status: "online",
    unreadCount: 2
  },
  {
    id: "sidy",
    name: "Sidy Diop",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80",
    role: "Nataalkat & Jëf-Kat",
    bio: "Kuy ràbbaal ak a nataal coofeel dëkk bi ak léebu aada yi.",
    tagline: "Nataal dëkk bi nag, mooy jox xol ak sàmm sunu réew! 🎨🔥",
    status: "online",
    unreadCount: 1
  },
  {
    id: "sebastien",
    name: "Ibrahima Fall",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
    role: "Sopp Dugub ak Reer",
    bio: "Kuy rëdd-rëddi dëkk bi ngir tàbbil dëkkandoo yi ndawal yu neex te set.",
    tagline: "Dund bi nag, tàbbil ndawal yu neex, ceebu jën ak xew-xew yu am mbooloo la! 🗺️🍳",
    status: "online",
    unreadCount: 0
  },
  {
    id: "bot",
    name: "Ndimmalu Kiringo AI",
    avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&h=150&q=80",
    role: "Kàddu Gox Bi",
    bio: "Dinaa la ndimbal ci say mbind, jox la xalaat yu rafet dëkk-dëkk.",
    tagline: "Laaj ma say laaj, dinaa la jox xalaat yu mag te baax! 🤖⭐",
    status: "online",
    unreadCount: 0
  }
];

export const STORIES: Story[] = [
  {
    id: "story-1",
    userName: "Amina Ndiaye",
    userAvatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=150&h=150&q=80",
    imageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=400&h=700&q=80",
    isViewed: false,
    textOverlay: "Ree yu xale yi! 🌟"
  },
  {
    id: "story-2",
    userName: "Sidy Diop",
    userAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80",
    imageUrl: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=400&h=700&q=80",
    isViewed: false,
    textOverlay: "Liggéey bu bees bi! 🎨"
  },
  {
    id: "story-3",
    userName: "Ibrahima Fall",
    userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
    imageUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=400&h=700&q=80",
    isViewed: true,
    textOverlay: "Tukki bi tàmbali na! 🚗"
  },
  {
    id: "story-4",
    userName: "Fatoumata Sow",
    userAvatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&h=150&q=80",
    imageUrl: "https://images.unsplash.com/photo-1513553404607-988bf2703777?auto=format&fit=crop&w=400&h=700&q=80",
    isViewed: false,
    textOverlay: "Kafe bu neex! ☕"
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: "post-1",
    authorName: "Amina Ndiaye",
    authorAvatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=150&h=150&q=80",
    authorTitle: "Ndimmalu Kiringo",
    authorRole: "persona",
    personaId: "amina",
    timestamp: "Ci 2 waxtu",
    content: "Dalal jamm samay dëkkandoo! 🌟 Am naa mbelel mu mag ngir yegle ne dinalay amal sunu 'Bessu Teranga ak Sàmm gox bi' subb-alkhamis walla gaawu bi di ñëw. Mbir mi mooy: setal mbooloo mbeddi dëkk bi Kiringo, diko toftal ci joxe reer yu neex yu wa dëkk bi toog ak coofeel.\n\nNu ngi sàkku ci yeen ñu ñëw jàppale nu! Ñëwalen ak seen kàttan ak seen ree yu rafet. Noo far! ❤️🤝",
    image: "https://images.unsplash.com/photo-1591524373003-036bd7d9f50e?auto=format&fit=crop&w=800&h=500&q=80",
    likesCount: 142,
    commentsCount: 28,
    sharesCount: 15,
    isLiked: false,
    reactions: { like: 110, love: 30, haha: 2, wow: 0, sad: 0, angry: 0 },
    comments: [
      {
        id: "comment-1-1",
        authorName: "Ibrahima Fall",
        authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
        content: "Dinaa ñëw Amina! Dinaa andi ndox yu sedd ak juss yu neex ngir mbooloo mi! Mbir mi dinaa neex lool dëkk-dëkk.",
        timestamp: "Ci 1 waxtu",
        likesCount: 18
      },
      {
        id: "comment-1-2",
        authorName: "Mariama Ba",
        authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80",
        content: "Xalaat bu rafet la! Dinaa and ak samay doom ngir jàppale leen!",
        timestamp: "Ci 45 simili",
        likesCount: 7
      }
    ]
  },
  {
    id: "post-2",
    authorName: "Sidy Diop",
    authorAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80",
    authorTitle: "Nataalkat gox bi",
    authorRole: "persona",
    personaId: "sidy",
    timestamp: "Ci 5 waxtu",
    content: "Ndax dangeen di dëkkandoo! Ma andi leen dundal bu neex boo xam ne nataal naa ko ci jawwu Kiringo. Melog jant bi day firndeel coofeel sunu réew ak mbooloo bi. Gox bi dal day neex lool te rafet.\n\nSama jëf ak ràbbaal la, lu ngen ci xalaat dëkkandoo yi? Bindalen li ci seen xol ci les commentaires! 🎨✨🔥",
    image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&h=500&q=80",
    likesCount: 88,
    commentsCount: 14,
    sharesCount: 8,
    isLiked: false,
    reactions: { like: 60, love: 20, haha: 0, wow: 8, sad: 0, angry: 0 },
    comments: [
      {
        id: "comment-2-1",
        authorName: "Amina Ndiaye",
        authorAvatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=150&h=150&q=80",
        content: "Sidy, dëgg dëgg am nga lëf gu ràbbaal! Say nataal day nuxu xol yi te dundal xol dëkkandoo yi. Machallah! 🇸🇳",
        timestamp: "Ci 4 waxtu",
        likesCount: 22
      }
    ]
  },
  {
    id: "post-3",
    authorName: "Ibrahima Fall",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
    authorTitle: "Boroom Ndawal yi",
    authorRole: "persona",
    personaId: "sebastien",
    timestamp: "Demb",
    content: "He dëkkandoo yu dundal yi! 🍽️ Seetsi naa benn mbelel gu neex ci wetu tefeesu jën ya. Tante Aby, moom nag dafa toog ceebu jën bu tooy te neex lool dëkk-dëkk! Jën yu set, ceeb bu am safeer ak pimi bu am kàttan... ah amul bégal!\n\nSu ngen fa jaaré dangeen ne ko seen xarit Ibrahima Fall moo leen yabal! Barke lool! 🐠🍚🍋",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&h=500&q=80",
    likesCount: 210,
    commentsCount: 47,
    sharesCount: 31,
    isLiked: false,
    reactions: { like: 160, love: 40, haha: 4, wow: 6, sad: 0, angry: 0 },
    comments: [
      {
        id: "comment-3-1",
        authorName: "Lamine Ndiaye",
        authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
        content: "Dëgg la Ibrahima! Ceebu jën bu neex lool la. Man sax faww ma foofa mboolem bëccëg!",
        timestamp: "Ci 18 waxtu",
        likesCount: 14
      }
    ]
  }
];

export const GROUPS: Group[] = [
  {
    id: "group-1",
    name: "Kiringo Dimbalante ak Sàmm gox bi",
    cover: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=600&h=300&q=80",
    membersCount: 4230,
    postsCount: 15,
    description: "Mbooloo mii nag mooy ngir dëkkandoo yi waxante, jàppalante, sàkku ndimbal ci liggéey walla yeneen mbir yu am solo.",
    isJoined: true
  },
  {
    id: "group-2",
    name: "Nataal ak Ràbbaal Afrofuturisme",
    cover: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&h=300&q=80",
    membersCount: 1840,
    postsCount: 8,
    description: "Benn gox bu bees ngir binde, nataal, sàmm aada yi ak ràbbaal dëkk bi ci melosu tey ak ëllëg.",
    isJoined: false
  },
  {
    id: "group-3",
    name: "Kiringo Foot Club - Ndand dëkk bi",
    cover: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&h=300&q=80",
    membersCount: 2980,
    postsCount: 21,
    description: "Ngir sufe ndand dëkk bi, tànk-tànk yi ak dundal mbooloo mbooloom tàŋk-tànk yi ci dëkk bi!",
    isJoined: false
  }
];

export const MARKETPLACE_ITEMS: MarketplaceItem[] = [
  {
    id: "market-1",
    title: "Nataal-kat Vintage Canon F-1",
    price: 120000,
    location: "Kiringo Digg dëkk",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=500&h=400&q=80",
    category: "Galaas & Jump",
    description: "Benn nataal Vintage Canon F-1 bu dox bu baax te set. Am na objectif 50mm f/1.4. Loolu nag lu baax la!",
    sellerName: "Sidy Diop",
    sellerAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80"
  },
  {
    id: "market-2",
    title: "Taabal gu mag gu and ak xatumu manguier",
    price: 85000,
    location: "Kiringo Bëj-gànnaar",
    image: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=500&h=400&q=80",
    category: "Kër & Waañ",
    description: "Taabal bu neex boo xam ne ràbbaalkat bu dëkk bi moo ko firi ci manguier bu dëgër. Loolu nag dëgër na lool.",
    sellerName: "Amadou Touré",
    sellerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80"
  },
  {
    id: "market-3",
    title: "Welo dëgër Rockrider",
    price: 45000,
    location: "Kiringo Sud",
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=500&h=400&q=80",
    category: "Po & Tàng",
    description: "Welo dëgër bu dox bu baax ngir tukki mbeddi Kiringo. 18 vitesses, dox na baax.",
    sellerName: "Samba Diop",
    sellerAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80"
  }
];

export const INITIAL_EVENTS = [
  {
    id: "event-1",
    title: "Atayaa Gox Bi Solidaire 🌿",
    description: "Ñëwalen nu and ak dëkkandoo yi ngir naan kafe walla ataya bu neex, waxante te janti mbiru dëkk bi ci wetu Baobab.",
    date: "Ajeeb gaawu bi di ñëw ci 16:00",
    location: "Diggu dëkk Kiringo (ci wetu Baobab)",
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&h=300&q=80",
    organizerName: "Amina Ndiaye",
    organizerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
    participantsCount: 18,
    isJoined: true
  },
  {
    id: "event-2",
    title: "Ràbbaal ak Jëf-Kat - Céeru Aada",
    description: "Jàngalen naka lañuy ràbbaale ak toog ndawal yu rafet and ak ràbbaalkat yu am xarala ci dëkk bi.",
    date: "Dimanche 12 Juillet ci 10:00",
    location: "Kër Aada yu Kiringo Digg dëkk",
    image: "https://images.unsplash.com/photo-1565192647048-f997ded879f0?auto=format&fit=crop&w=600&h=300&q=80",
    organizerName: "Samba Diop",
    organizerAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
    participantsCount: 12,
    isJoined: false
  },
  {
    id: "event-3",
    title: "Set-Setal Gox Bi - Setal gox",
    description: "Noo far! Nan setal dëkk bi ngir dund bu rafet te set. Ramassage mbalit mboolem mbedd yi.",
    date: "Gaawu 18 Juillet ci 08:30",
    location: "Wetu École Kiringo Centre",
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&h=300&q=80",
    organizerName: "Sidy Diop",
    organizerAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80",
    participantsCount: 31,
    isJoined: false
  }
];

export const INITIAL_ALBUMS: PhotoAlbum[] = [
  {
    id: "album-1",
    name: "Sama Ndar bu rafet 🌊",
    description: "Nataal yu am solo ci sunu dëkk Ndar (Saint-Louis), ndand gu rafet ak mbeddi aada yi.",
    coverUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=500&h=300&q=80",
    createdAt: "Il y a 2 semaines",
    photos: [
      {
        id: "p1-1",
        url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&h=600&q=80",
        caption: "Ndar Gox bi - Teferu gueth bi ci fajar 🌅",
        createdAt: "Il y a 2 semaines"
      },
      {
        id: "p1-2",
        url: "https://images.unsplash.com/photo-1473116763269-255ea7604bb6?auto=format&fit=crop&w=800&h=600&q=80",
        caption: "Sunu waal gi gueth - Gaal yi ñëw ci tëfëss 🛶",
        createdAt: "Il y a 2 semaines"
      },
      {
        id: "p1-3",
        url: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&h=600&q=80",
        caption: "Besi gox bi ci ndox mi - jamm ak leer 🌊",
        createdAt: "Il y a 10 jours"
      }
    ]
  },
  {
    id: "album-2",
    name: "Teranga ak Ataya 🌿",
    description: "Mbooloo dëkkandoo yi, jokkoo, ataya bu neex, ak kàddu teranga yu neex.",
    coverUrl: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=500&h=300&q=80",
    createdAt: "Il y a 1 mois",
    photos: [
      {
        id: "p2-1",
        url: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&h=600&q=80",
        caption: "Ataya bu am ràbbaal ci mbedd bi 🌿",
        createdAt: "Il y a 10 jours"
      },
      {
        id: "p2-2",
        url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&h=600&q=80",
        caption: "Sourires et Teranga - Reeu xale yi ci dëkk bi 🌟",
        createdAt: "Il y a 3 semaines"
      }
    ]
  }
];

