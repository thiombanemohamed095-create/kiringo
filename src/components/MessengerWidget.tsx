import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, Send, X, ArrowLeft, Loader2, Info } from "lucide-react";
import { Persona, Message } from "../types";
import { PERSONAS } from "../data";

interface MessengerWidgetProps {
  currentPersonaId: string | null;
  onClose: () => void;
}

export default function MessengerWidget({
  currentPersonaId,
  onClose
}: MessengerWidgetProps) {
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>("bot");
  const [messages, setMessages] = useState<Record<string, Message[]>>({
    amina: [
      { id: "1", sender: "model", text: "Bonjour chouette voisin ! 😊 Comment vas-tu aujourd'hui ? Ici la Teranga est au rendez-vous. De quoi aimerais-tu discuter ?", timestamp: "10:30" }
    ],
    sidy: [
      { id: "1", sender: "model", text: "Hey ! Salut l'ami. Prêt pour capter les meilleures vibrations créatives aujourd'hui ? C'est de l'art !", timestamp: "11:15" }
    ],
    sebastien: [
      { id: "1", sender: "model", text: "Salut l'ami aventurier ! 🗺️ J'espère que tu as faim, car je reviens d'un voyage plein de saveurs. Qu'as-tu cuisiné aujourd'hui ?", timestamp: "09:00" }
    ],
    bot: [
      { id: "1", sender: "model", text: "Bonjour ! Je suis l'Assistant Officiel de Kiringo. 😊 Comment puis-je vous aider à tirer le meilleur parti de votre réseau social aujourd'hui ?", timestamp: "08:30" }
    ]
  });
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync selected persona with prop
  useEffect(() => {
    if (currentPersonaId) {
      setSelectedPersonaId(currentPersonaId);
    }
  }, [currentPersonaId]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedPersonaId, loading]);

  const currentPersona = PERSONAS.find(p => p.id === selectedPersonaId) || PERSONAS[3];

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || loading) return;

    const userMsgText = inputText.trim();
    setInputText("");

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: userMsgText,
      timestamp: timeStr
    };

    // Update messages locally with user's message
    const updatedPersonaMessages = [...(messages[selectedPersonaId] || []), userMessage];
    setMessages(prev => ({
      ...prev,
      [selectedPersonaId]: updatedPersonaMessages
    }));

    setLoading(true);

    try {
      // API call to the server-side Gemini Proxy
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          persona: selectedPersonaId,
          message: userMsgText,
          history: updatedPersonaMessages.map(m => ({
            role: m.sender,
            text: m.text
          }))
        })
      });

      const data = await response.json();
      const modelMessage: Message = {
        id: `model-${Date.now()}`,
        sender: "model",
        text: data.text || "Pardon, je n'ai pas pu générer de réponse pour l'instant.",
        timestamp: timeStr
      };

      setMessages(prev => ({
        ...prev,
        [selectedPersonaId]: [...(prev[selectedPersonaId] || []), modelMessage]
      }));
    } catch (err) {
      console.error("Chat request failed:", err);
      // Fallback response inside client just in case
      const errorMsg: Message = {
        id: `model-error-${Date.now()}`,
        sender: "model",
        text: "Oups ! Un petit nuage s'est posé sur notre connexion. Mais on reste ensemble ! Dis-moi, as-tu d'autres projets ?",
        timestamp: timeStr
      };
      setMessages(prev => ({
        ...prev,
        [selectedPersonaId]: [...(prev[selectedPersonaId] || []), errorMsg]
      }));
    } finally {
      setLoading(false);
    }
  };

  const activeMessages = messages[selectedPersonaId] || [];

  return (
    <div 
      id="messenger-widget-container" 
      className="bg-white rounded-[32px] border border-[#E9EDC9] shadow-md flex flex-col h-[600px] overflow-hidden"
    >
      {/* Messenger Header */}
      <div className="bg-[#FEFAE0] border-b border-[#E9EDC9] p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <img 
            src={currentPersona.avatar} 
            alt={currentPersona.name} 
            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
            referrerPolicy="no-referrer"
          />
          <div>
            <h3 className="font-bold text-sm text-[#283618]">{currentPersona.name}</h3>
            <span className="text-[10px] text-[#606C38] font-bold bg-[#E9EDC9] px-2 py-0.5 rounded-full">
              {currentPersona.role}
            </span>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-[#E9EDC9] text-[#283618] transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Persona Info banner */}
      <div className="bg-[#F7F2EB] px-4 py-2 border-b border-[#E9EDC9] text-[11px] text-[#606C38] italic flex items-start gap-1.5 shrink-0">
        <Info className="w-3.5 h-3.5 text-[#BC6C25] mt-0.5 shrink-0" />
        <span>{currentPersona.bio} <strong className="text-[#BC6C25]">{currentPersona.tagline}</strong></span>
      </div>

      {/* Selector tab for personas */}
      <div className="flex border-b border-[#E9EDC9] bg-[#FEFAE0]/40 p-1.5 gap-1 shrink-0">
        {PERSONAS.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedPersonaId(p.id)}
            className={`flex-1 py-1 px-1.5 text-[10px] font-bold rounded-lg transition-all truncate text-center cursor-pointer ${
              selectedPersonaId === p.id
                ? "bg-[#606C38] text-white"
                : "text-[#606C38] hover:bg-[#E9EDC9]"
            }`}
          >
            {p.name.split(" ")[0]}
          </button>
        ))}
      </div>

      {/* Messages Feed Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#FDFBF7] flex flex-col gap-3">
        {activeMessages.map((msg) => {
          const isUser = msg.sender === "user";
          return (
            <div 
              key={msg.id} 
              className={`flex flex-col max-w-[80%] ${isUser ? "self-end items-end" : "self-start items-start"}`}
            >
              <div 
                className={`p-3 rounded-2xl text-xs leading-relaxed border ${
                  isUser 
                    ? "bg-[#BC6C25] text-white border-[#BC6C25] rounded-tr-none" 
                    : "bg-[#FEFAE0] text-[#283618] border-[#E9EDC9] rounded-tl-none"
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[9px] text-[#A3B18A] mt-1 px-1">
                {msg.timestamp}
              </span>
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-2 items-center text-xs text-[#A3B18A] self-start bg-[#FEFAE0] border border-[#E9EDC9] p-2.5 rounded-2xl rounded-tl-none animate-pulse">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#BC6C25]" />
            <span>{currentPersona.name} réfléchit...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat input box */}
      <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-[#E9EDC9] flex gap-2 shrink-0">
        <input 
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Envoyer un message à ${currentPersona.name.split(" ")[0]}...`}
          className="flex-1 bg-[#FDFBF7] border border-[#E9EDC9] rounded-full px-4 py-2 text-xs text-[#283618] placeholder-[#A3B18A] focus:outline-none focus:ring-1 focus:ring-[#BC6C25]"
        />
        <button 
          type="submit"
          disabled={!inputText.trim() || loading}
          className="bg-[#606C38] hover:bg-[#283618] disabled:bg-slate-200 text-white p-2 rounded-full transition cursor-pointer flex items-center justify-center"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
