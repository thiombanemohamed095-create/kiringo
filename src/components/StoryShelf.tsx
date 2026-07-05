import { useState, useEffect } from "react";
import { Plus, X, Heart, Smile, Sparkles } from "lucide-react";
import { Story } from "../types";
import { STORIES } from "../data";

interface StoryShelfProps {
  userAvatar: string;
}

export default function StoryShelf({ userAvatar }: StoryShelfProps) {
  const [stories, setStories] = useState<Story[]>(STORIES);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [storyProgress, setStoryProgress] = useState(0);

  // Auto-progress active story
  useEffect(() => {
    if (activeStoryIndex === null) return;
    setStoryProgress(0);

    const interval = setInterval(() => {
      setStoryProgress((prev) => {
        if (prev >= 100) {
          // Move to next story or close
          if (activeStoryIndex < stories.length - 1) {
            setActiveStoryIndex(activeStoryIndex + 1);
            return 0;
          } else {
            setActiveStoryIndex(null);
            return 0;
          }
        }
        return prev + 1;
      });
    }, 45); // ~4.5 seconds per story

    return () => clearInterval(interval);
  }, [activeStoryIndex, stories.length]);

  const handleCreateStory = () => {
    const text = prompt("Entrez un court texte pour votre Story Kiringo :");
    if (!text) return;

    const newStory: Story = {
      id: `story-${Date.now()}`,
      userName: "Alex Traoré",
      userAvatar: userAvatar,
      imageUrl: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=400&h=700&q=80",
      isViewed: false,
      textOverlay: text
    };

    setStories([newStory, ...stories]);
  };

  const handleOpenStory = (index: number) => {
    setActiveStoryIndex(index);
    // Mark as viewed
    const updated = [...stories];
    updated[index].isViewed = true;
    setStories(updated);
  };

  const activeStory = activeStoryIndex !== null ? stories[activeStoryIndex] : null;

  return (
    <div id="story-shelf-container" className="mb-6">
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
        {/* Create Story card (matching Natural Tones theme, eg D4A373 background, BC6C25 ring) */}
        <div 
          id="create-story-card"
          onClick={handleCreateStory}
          className="relative w-28 h-40 rounded-2xl overflow-hidden bg-[#D4A373] hover:opacity-95 transition-all duration-200 shadow-sm border-2 border-white flex-shrink-0 cursor-pointer flex flex-col justify-end p-3"
        >
          <div className="absolute top-2 left-2 w-8 h-8 rounded-full bg-white border-2 border-[#BC6C25] flex items-center justify-center text-xl font-bold text-[#BC6C25] hover:scale-105 transition">
            +
          </div>
          <span className="text-[10px] text-white font-bold leading-tight">Créer une Story</span>
        </div>

        {/* Existing Stories */}
        {stories.map((story, idx) => (
          <div 
            id={`story-card-${story.id}`}
            key={story.id}
            onClick={() => handleOpenStory(idx)}
            className="relative w-28 h-40 rounded-2xl overflow-hidden shadow-sm flex-shrink-0 cursor-pointer group"
          >
            {/* Background Image */}
            <img 
              src={story.imageUrl} 
              alt={story.userName} 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-300"
              referrerPolicy="no-referrer"
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
            
            {/* Avatar with Ring */}
            <div className={`absolute top-2 left-2 p-0.5 rounded-full bg-white shadow ${!story.isViewed ? "ring-2 ring-[#BC6C25]" : "opacity-80"}`}>
              <img 
                src={story.userAvatar} 
                alt={story.userName} 
                className="w-7 h-7 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Bottom username and text overlay preview */}
            <div className="absolute bottom-2 left-2 right-2 text-left">
              {story.textOverlay && (
                <p className="text-[9px] font-bold text-white bg-black/40 rounded px-1 py-0.5 inline-block mb-1 truncate max-w-full">
                  {story.textOverlay}
                </p>
              )}
              <p className="text-[10px] font-bold text-white truncate drop-shadow">
                {story.userName}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Full-screen Story View Modal */}
      {activeStory && (
        <div id="story-viewer-modal" className="fixed inset-0 z-50 bg-[#283618]/95 flex flex-col items-center justify-center p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-sm h-[75vh] bg-[#F7F2EB] rounded-[32px] border border-[#E9EDC9] overflow-hidden flex flex-col shadow-2xl">
            {/* Progress Bar Container */}
            <div className="absolute top-3 left-4 right-4 flex gap-1 z-20">
              {stories.map((s, index) => {
                let fill = "0%";
                if (index < activeStoryIndex) fill = "100%";
                if (index === activeStoryIndex) fill = `${storyProgress}%`;
                return (
                  <div key={s.id} className="h-1 flex-1 bg-white/35 rounded-full overflow-hidden">
                    <div className="h-full bg-white transition-all duration-75" style={{ width: fill }} />
                  </div>
                );
              })}
            </div>

            {/* Header / Close and User Profile */}
            <div className="absolute top-6 left-4 right-4 flex items-center justify-between z-20 text-white">
              <div className="flex items-center gap-2">
                <img 
                  src={activeStory.userAvatar} 
                  alt={activeStory.userName} 
                  className="w-10 h-10 rounded-full border border-white/20 object-cover"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-bold text-sm drop-shadow">{activeStory.userName}</h4>
                  <span className="text-[11px] text-white/80 drop-shadow">Kiringo Story</span>
                </div>
              </div>
              <button 
                onClick={() => setActiveStoryIndex(null)}
                className="p-1.5 rounded-full bg-black/45 hover:bg-black/60 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Story Image */}
            <div className="relative flex-1 flex items-center justify-center overflow-hidden bg-black">
              <img 
                src={activeStory.imageUrl} 
                alt="Story content" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
              
              {/* Centered Large Text Overlay */}
              {activeStory.textOverlay && (
                <div className="absolute bottom-20 left-6 right-6 text-center">
                  <span className="inline-block bg-[#FEFAE0] text-[#283618] text-sm md:text-base font-bold py-2 px-4 rounded-xl shadow-lg border border-[#E9EDC9] backdrop-blur-sm animate-pulse">
                    ✨ {activeStory.textOverlay}
                  </span>
                </div>
              )}
            </div>

            {/* Bottom Actions / Quick Reactions (Natural Tones stylings) */}
            <div className="p-4 bg-[#FEFAE0] border-t border-[#E9EDC9] flex flex-col gap-3">
              <div className="flex justify-around items-center">
                <button 
                  onClick={() => alert("Vous aimez cette story !")}
                  className="flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-[#E9EDC9] hover:bg-[#D4A373]/20 text-[#BC6C25] font-semibold text-[11px] transition"
                >
                  <Heart className="w-3.5 h-3.5 fill-current" />
                  J'adore
                </button>
                <button 
                  onClick={() => alert("Sourire envoyé !")}
                  className="flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-[#E9EDC9] hover:bg-[#D4A373]/20 text-[#606C38] font-semibold text-[11px] transition"
                >
                  <Smile className="w-3.5 h-3.5" />
                  Sourire
                </button>
                <button 
                  onClick={() => alert("Magique !")}
                  className="flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-[#E9EDC9] hover:bg-[#D4A373]/20 text-[#283618] font-semibold text-[11px] transition"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Génial
                </button>
              </div>

              {/* Quick comment input */}
              <input 
                type="text" 
                placeholder={`Répondre à ${activeStory.userName}...`}
                className="w-full bg-[#FDFBF7] text-[#283618] placeholder-[#A3B18A] text-xs py-2 px-4 rounded-full border border-[#E9EDC9] focus:outline-none focus:ring-1 focus:ring-[#BC6C25]"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value) {
                    alert(`Message envoyé à ${activeStory.userName} : "${e.currentTarget.value}"`);
                    e.currentTarget.value = "";
                    setActiveStoryIndex(null);
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
