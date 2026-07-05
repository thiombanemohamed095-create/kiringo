import React, { useState } from "react";
import { MessageSquare, Share2, Heart, Smile, Check, Send, Sparkles, MessageCircle, Copy, Facebook, Twitter, Bookmark } from "lucide-react";
import { Post, Comment } from "../types";

interface PostCardProps {
  key?: string;
  post: Post;
  userAvatar: string;
  userName: string;
  onLike: (postId: string, reaction?: string) => void;
  onAddComment: (postId: string, commentText: string) => void;
  onOpenChatWithPersona?: (personaId: string) => void;
  onSave?: (postId: string) => void;
}

const REACTION_EMOJIS: Record<string, string> = {
  like: "👍",
  love: "❤️",
  haha: "😆",
  wow: "😮",
  sad: "😢",
  angry: "😡"
};

const REACTION_LABELS: Record<string, string> = {
  like: "J'aime",
  love: "J'adore",
  haha: "Haha",
  wow: "Wow",
  sad: "Triste",
  angry: "Grrr"
};

export default function PostCard({
  post,
  userAvatar,
  userName,
  onLike,
  onAddComment,
  onOpenChatWithPersona,
  onSave
}: PostCardProps) {
  const [showReactionsSelector, setShowReactionsSelector] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newCommentText, setNewCommentText] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const postUrl = `${window.location.origin}/post/${post.id}`;
  const postText = `Découvrez cette superbe publication de ${post.authorName} sur Kiringo ! 🌿`;

  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(postUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleNativeShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `Kiringo - ${post.authorName}`,
          text: postText,
          url: postUrl
        });
        setShowShareMenu(false);
      } catch (err) {
        console.log("Native share failed or dismissed", err);
      }
    } else {
      // Fallback
      handleCopyLink(e);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    onAddComment(post.id, newCommentText.trim());
    setNewCommentText("");
  };

  const totalReactionsCount = post.reactions
    ? Object.values(post.reactions).reduce((sum, val) => sum + val, 0)
    : post.likesCount;

  return (
    <div 
      id={`post-card-${post.id}`} 
      className="bg-white rounded-[32px] border border-[#E9EDC9] shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col overflow-hidden mb-6"
    >
      {/* Header Info */}
      <div className="p-5 flex items-start justify-between">
        <div className="flex gap-3">
          <div className="relative">
            <img 
              src={post.authorAvatar} 
              alt={post.authorName} 
              className="w-12 h-12 rounded-full object-cover border-2 border-[#E9EDC9]"
              referrerPolicy="no-referrer"
            />
            {post.personaId && (
              <span className="absolute -bottom-1 -right-1 bg-[#606C38] text-white p-1 rounded-full text-[8px] font-bold border border-white">
                IA
              </span>
            )}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-bold text-sm text-[#283618]">{post.authorName}</span>
              {post.authorTitle && (
                <span className="text-[10px] bg-[#E9EDC9] text-[#606C38] font-bold px-2 py-0.5 rounded-full">
                  {post.authorTitle}
                </span>
              )}
            </div>
            <p className="text-[10px] text-[#A3B18A] mt-0.5">
              {post.timestamp} • Publié à Kiringo
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {post.personaId && onOpenChatWithPersona && (
            <button
              onClick={() => onOpenChatWithPersona(post.personaId!)}
              className="flex items-center gap-1 text-[11px] font-bold bg-[#FEFAE0] text-[#BC6C25] hover:bg-[#E9EDC9] border border-[#E9EDC9] py-1.5 px-3 rounded-full transition-colors cursor-pointer"
              title={`Discuter en privé avec ${post.authorName}`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Discuter</span>
            </button>
          )}

          {onSave && (
            <button
              onClick={() => onSave(post.id)}
              className={`p-1.5 rounded-full border transition-all cursor-pointer ${
                post.isSaved
                  ? "bg-[#BC6C25]/10 border-[#BC6C25] text-[#BC6C25] hover:bg-[#BC6C25]/20"
                  : "bg-white border-slate-200 text-slate-400 hover:text-[#BC6C25] hover:bg-[#FEFAE0]"
              }`}
              title={post.isSaved ? "Enregistré" : "Enregistrer la publication"}
            >
              <Bookmark className="w-3.5 h-3.5" fill={post.isSaved ? "#BC6C25" : "none"} />
            </button>
          )}
        </div>
      </div>

      {/* Content Text */}
      <div className="px-5 pb-3">
        <p className="text-sm leading-relaxed text-[#283618] whitespace-pre-line select-text">
          {post.content}
        </p>
      </div>

      {/* Image if any */}
      {post.image && (
        <div className="relative w-full max-h-96 overflow-hidden bg-[#F7F2EB] border-y border-[#E9EDC9] flex items-center justify-center">
          <img 
            src={post.image} 
            alt="Image de publication" 
            className="w-full object-cover max-h-96"
            referrerPolicy="no-referrer"
          />
        </div>
      )}

      {/* Interaction Stats */}
      <div className="px-5 py-3 flex items-center justify-between border-b border-[#FDFBF7] text-xs text-[#A3B18A]">
        <div className="flex items-center gap-1.5">
          {/* Reaction Icons */}
          <div className="flex -space-x-1">
            <span className="bg-[#FEFAE0] rounded-full p-0.5 border border-white text-[10px]">👍</span>
            {post.reactions && post.reactions.love > 0 && (
              <span className="bg-[#FEFAE0] rounded-full p-0.5 border border-white text-[10px]">❤️</span>
            )}
            {post.reactions && post.reactions.haha > 0 && (
              <span className="bg-[#FEFAE0] rounded-full p-0.5 border border-white text-[10px]">😆</span>
            )}
          </div>
          <span className="font-semibold text-[#606C38]">{totalReactionsCount} réactions</span>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowComments(!showComments)}
            className="hover:underline cursor-pointer"
          >
            {post.comments.length} commentaires
          </button>
          <span>{post.sharesCount} partages</span>
        </div>
      </div>

      {/* Action Buttons (Like, Comment, Share) */}
      <div className="px-3 py-2 bg-[#FEFAE0]/30 flex items-center justify-around relative">
        {/* Reactions Picker (appears on hover or click of Like) */}
        {showReactionsSelector && (
          <div 
            className="absolute bottom-12 left-4 bg-white border border-[#E9EDC9] rounded-full p-1.5 flex gap-2.5 shadow-lg animate-bounce z-10"
            onMouseLeave={() => setShowReactionsSelector(false)}
          >
            {Object.entries(REACTION_EMOJIS).map(([key, emoji]) => (
              <button
                key={key}
                onClick={() => {
                  onLike(post.id, key);
                  setShowReactionsSelector(false);
                }}
                className="text-lg hover:scale-130 transition duration-100 cursor-pointer p-1 rounded-full hover:bg-[#F7F2EB]"
                title={REACTION_LABELS[key]}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        {/* Like Button */}
        <button
          onClick={() => {
            if (post.userReaction) {
              onLike(post.id, undefined); // Undo
            } else {
              onLike(post.id, "like");
            }
          }}
          onMouseEnter={() => setShowReactionsSelector(true)}
          className={`flex items-center gap-2 py-2 px-3 rounded-full hover:bg-[#E9EDC9] text-xs font-bold transition-colors cursor-pointer ${
            post.userReaction ? "text-[#BC6C25]" : "text-[#606C38]"
          }`}
        >
          {post.userReaction ? (
            <span className="text-sm">{REACTION_EMOJIS[post.userReaction]}</span>
          ) : (
            <Heart className="w-4 h-4" />
          )}
          <span>{post.userReaction ? REACTION_LABELS[post.userReaction] : "Réagir"}</span>
        </button>

        {/* Comment Button */}
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 py-2 px-3 rounded-full hover:bg-[#E9EDC9] text-xs font-bold text-[#606C38] transition-colors cursor-pointer"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Commenter</span>
        </button>

        {/* Share Button & Popover */}
        <div className="relative">
          <button
            onClick={() => setShowShareMenu(!showShareMenu)}
            className={`flex items-center gap-2 py-2 px-3 rounded-full hover:bg-[#E9EDC9] text-xs font-bold text-[#606C38] transition-colors cursor-pointer ${
              showShareMenu ? "bg-[#E9EDC9]" : ""
            }`}
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-600 animate-pulse" /> : <Share2 className="w-4 h-4" />}
            <span>{isCopied ? "Lien copié !" : "Partager"}</span>
          </button>

          {showShareMenu && (
            <>
              {/* Overlay transparent to close on click outside */}
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowShareMenu(false)}
              />
              
              <div className="absolute bottom-12 right-0 bg-white border border-[#E9EDC9] rounded-2xl p-2.5 shadow-xl z-20 w-52 animate-fade-in text-left">
                <div className="px-3 py-1.5 border-b border-[#F5F5EC] mb-1.5 flex justify-between items-center">
                  <span className="text-[10px] font-black text-[#606C38] uppercase tracking-wider">Partager</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                </div>
                
                <div className="flex flex-col gap-1">
                  {/* Partage Natif (Web Share API) */}
                  <button
                    onClick={handleNativeShare}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-black text-white bg-[#BC6C25] hover:bg-[#606C38] transition cursor-pointer text-left shadow-sm mb-1.5"
                    title="Partager directement via les applications de votre téléphone ou ordinateur"
                  >
                    <Share2 className="w-4 h-4 text-white shrink-0" />
                    <span>Partage direct 📱</span>
                  </button>

                  {/* Copier le lien */}
                  <button
                    onClick={handleCopyLink}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-[#606C38] hover:bg-[#FEFAE0] hover:text-[#283618] transition cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2">
                      <Copy className="w-4 h-4 text-[#BC6C25]" />
                      <span>{isCopied ? "Copié !" : "Copier le lien"}</span>
                    </div>
                    {isCopied && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>

                  {/* WhatsApp */}
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(postText + " " + postUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setShowShareMenu(false)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-[#606C38] hover:bg-[#FEFAE0] hover:text-[#283618] transition text-left cursor-pointer"
                  >
                    <span className="w-4 h-4 flex items-center justify-center text-[10px] bg-emerald-500 text-white rounded-full font-bold">W</span>
                    <span>WhatsApp</span>
                  </a>

                  {/* Facebook */}
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setShowShareMenu(false)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-[#606C38] hover:bg-[#FEFAE0] hover:text-[#283618] transition text-left cursor-pointer"
                  >
                    <Facebook className="w-4 h-4 text-blue-600" />
                    <span>Facebook</span>
                  </a>

                  {/* Twitter / X */}
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(postText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setShowShareMenu(false)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-[#606C38] hover:bg-[#FEFAE0] hover:text-[#283618] transition text-left cursor-pointer"
                  >
                    <Twitter className="w-4 h-4 text-neutral-800" />
                    <span>Partager sur X</span>
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Comments Section Drawer */}
      {showComments && (
        <div className="bg-[#F7F2EB]/50 border-t border-[#E9EDC9] p-4 flex flex-col gap-3">
          {/* List of comments */}
          <div className="flex flex-col gap-3 max-h-60 overflow-y-auto">
            {post.comments.length === 0 ? (
              <p className="text-xs text-[#A3B18A] text-center py-2">Aucun commentaire pour le moment. Soyez le premier à réagir !</p>
            ) : (
              post.comments.map((comment) => (
                <div key={comment.id} className="flex gap-2.5 items-start">
                  <img 
                    src={comment.authorAvatar} 
                    alt={comment.authorName} 
                    className="w-8 h-8 rounded-full object-cover border border-[#E9EDC9]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 bg-white px-3 py-2 rounded-2xl border border-[#E9EDC9]">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#283618]">{comment.authorName}</span>
                      <span className="text-[9px] text-[#A3B18A]">{comment.timestamp}</span>
                    </div>
                    <p className="text-xs text-[#283618] mt-1 whitespace-pre-line">{comment.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Form to submit a comment */}
          <form onSubmit={handleCommentSubmit} className="flex gap-2.5 items-center mt-2">
            <img 
              src={userAvatar} 
              alt="Votre avatar" 
              className="w-8 h-8 rounded-full object-cover border border-[#E9EDC9]"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 relative flex items-center">
              <input 
                type="text"
                placeholder="Écrire un commentaire chaleureux..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                className="w-full bg-white text-xs text-[#283618] placeholder-[#A3B18A] py-2.5 pl-4 pr-10 rounded-full border border-[#E9EDC9] focus:outline-none focus:ring-1 focus:ring-[#BC6C25] focus:border-[#BC6C25]"
              />
              <button 
                type="submit"
                className="absolute right-2 p-1.5 text-[#BC6C25] hover:text-[#606C38] transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
