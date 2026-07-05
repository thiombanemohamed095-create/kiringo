import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization helper for Gemini
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey.trim() !== "") {
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

// Personas instructions
const PERSONA_PROMPTS: Record<string, string> = {
  amina: `Yaa di Amina Ndiaye, xarit dëkkandoo yu Kiringo, kuy sopp ndimbal ak bégal mbooloo mi. 
Mën nga wax wolof bu set te dëgër, and ak tuuti expressions sénégalaises (naka: "waaw waaw", "noo far", "la teranga", "machallah", "gox bi dal day neex").
Waxal ci coofeel, kàttan ak bégal. Say tontu nañu gàtt te am sol (max 3-4 phrases). Laaj ko naka la dundal bëccëg bi.`,

  sidy: `Yaa di Sidy Diop, nataalkat ak ràbbaalkat xarala ci Kiringo.
Bëgg nga nataal yi, woy bees yi (afrobeat, rap), ràbbaal ak firi mbir yu rafet.
Waxal ci ràbbaal, coofeel ak style bu bees. Say expressions nañu am: "nataal bu bees", "mbind yu rafet", "ndand dëkk bi", "lëf gu neex".
Say tontu nañu gàtt te bégal xol.`,

  sebastien: `Yaa di Ibrahima Fall, boroom Ndawal yi, kuy reer-reer dëkk bi te rëdd-rëddi yeemati yi.
Sopp nga tukki ak lekki ceebu jën, yassa, ataya, walla ndawal yu neex.
Tontul ci kàttan ak xew-xew: "ceebu jën bu neex la !", "ataya bi dox na !", "gox bi neex na !".
Say tontu nañu gàtt te dundal xol.`,

  bot: `Yaa di Ndimmalu Kiringo AI 🌟.
Say liggéey mooy jàppale dëkkandoo yi ci mbind, jox leen xalaat yu neex ci wolof dëkk-dëkk, firndeel naka lañuy sàmm gox bi, andi post yu baax, mbedd, reaction, jookkoo, walla tontu laaj yu am solo.
Waxal ci polite, xarala te bégal, and ak emoji yu neex.`
};

// Fallback intelligent answers when API key is missing
const getFallbackResponse = (persona: string, message: string): string => {
  const msgLower = message.toLowerCase();
  
  if (persona === "amina") {
    if (msgLower.includes("salut") || msgLower.includes("bonjour") || msgLower.includes("naka") || msgLower.includes("salaam")) {
      return "Salaam aleekum dëkkandoo! Naka waxtu wi? Kiringo nag amul bégal, nu ngi firi coofeel ak teranga ci gox bi. Lu bees ci sa wàll?";
    }
    if (msgLower.includes("aide") || msgLower.includes("dimbal") || msgLower.includes("entraide") || msgLower.includes("projet")) {
      return "Jàppalante dëkkandoo mooy sàmm gox bi! Suba di ñëw, nu ngi amal set-setal bu mag ci Kiringo. Ndax dinala neex nga ñëw jàppale nu? Noo far! ❤️🤝";
    }
    return "Dëgg la dëkkandoo! Jàppalante mooy sunu kàttan. Wax ma, lu rafet loo xam ne mën nañu ko and ak a dundal tey ci Kiringo?";
  }
  
  if (persona === "sidy") {
    if (msgLower.includes("salut") || msgLower.includes("bonjour") || msgLower.includes("naka") || msgLower.includes("salaam")) {
      return "Sante lool! Salaamaleko l'artiste. Naka vibe yi tey? Ma ngi ràbbaal benn nataal bu rafet ngir bégal dëkkandoo yi. Lu bees ci sa wàll?";
    }
    if (msgLower.includes("art") || msgLower.includes("photo") || msgLower.includes("woy") || msgLower.includes("nataal")) {
      return "Nataal ak mbind mooy dundal xol! Ma ngi firi benn expo bu bees ci gox bi ngir dundal dëkkandoo yi. Ndax am nga mbind walla nataal yu rafet yoo bëgg a partagé ci sa jëmm?";
    }
    return "Loolu nag amul bégal! Mbind mi and na ak style bu rafet. Nan and ràbbaal benn post bu bees ngir bégal waa Kiringo!";
  }
  
  if (persona === "sebastien") {
    if (msgLower.includes("salut") || msgLower.includes("bonjour") || msgLower.includes("naka") || msgLower.includes("salaam")) {
      return "He boroom xeet yi! Salaam aleekum! Ndax paré nga ngir and ak man ci tukki bees bi? Ma ngi soog a ñëw ci gaawu bi, fekk foofa ceebu jën bu neex lool!";
    }
    if (msgLower.includes("manger") || msgLower.includes("lek") || msgLower.includes("plat") || msgLower.includes("ceeb") || msgLower.includes("yassa")) {
      return "Ceebu jën bu tooy walla yassa gu am kàttan dëkk-dëkk! Tey nag mbelel la toog ci waañ bi. Lan mooy sa ñam wu gën a neex?";
    }
    return "Amul bégal! Loolu nag day neex lool te dundal xol. Ñam yi Kiringo dëgg-dëgg amul denc!";
  }

  // General Bot
  if (msgLower.includes("salut") || msgLower.includes("bonjour") || msgLower.includes("naka") || msgLower.includes("salaam")) {
    return "Salaam aleekum dëkkandoo! Man la Ndimmalu Kiringo AI 🌟. Naka la la mën a jàppale tey? Mën nga sàmm gox bi, laaj Amina, Sidy walla Ibrahima Fall say laaj yu dëgër!";
  }
  if (msgLower.includes("kiringo")) {
    return "Kiringo mooy sa réseau social dëkkandoo bu mag te bees, boo xam ne dafa and ak teranga gu mag. Mën nga fi binde, andi reaction yu bees, tontu, tàbbil dëkkandoo yi ndimbal te waxante ci Messenger!";
  }
  return "Dëgg la! Mën nga tàbbil sa xalaat ci mbooloo mii ngir dëkkandoo yi and ak yaw ci tontu yu neex te set.";
};

// API: Messenger Chat Handler
app.post("/api/chat", async (req, res) => {
  const { persona, message, history } = req.body;

  if (!persona || !message) {
    return res.status(400).json({ error: "Champs 'persona' et 'message' requis." });
  }

  const systemInstruction = PERSONA_PROMPTS[persona] || PERSONA_PROMPTS.bot;
  const client = getGeminiClient();

  if (!client) {
    // Return a rich mock simulation reply if API key is not configured yet
    const fallbackText = getFallbackResponse(persona, message);
    return res.json({ text: fallbackText, isMock: true });
  }

  try {
    // Format history for @google/genai SDK
    const formattedHistory = (history || []).map((msg: any) => ({
      role: msg.role === "model" ? "model" as const : "user" as const,
      parts: [{ text: msg.text }],
    }));

    // Add current user prompt
    formattedHistory.push({
      role: "user" as const,
      parts: [{ text: message }],
    });

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedHistory,
      config: {
        systemInstruction,
        temperature: 1.0,
      },
    });

    res.json({ text: response.text || "...", isMock: false });
  } catch (error: any) {
    console.error("Gemini API Error in /api/chat:", error);
    const fallbackText = getFallbackResponse(persona, message);
    res.json({ text: fallbackText, isMock: true, error: error.message });
  }
});

// API: Post Generation and Polish Helper
app.post("/api/generate-post", async (req, res) => {
  const { topic, tone } = req.body;

  if (!topic) {
    return res.status(400).json({ error: "Sujet bi laaj nañu ko." });
  }

  const selectedTone = tone || "Amical";
  const client = getGeminiClient();

  if (!client) {
    // Return a beautiful template if API key is not configured
    const mockPost = `✨ [Mbooloo waa Kiringo] ✨\n\n📢 Mbiri : *${topic}*\n\n🤝 Ñëwalen nu and, waxante te dundal sunu gox bi ci Kiringo! Fi la plaj bu baax ngir wax li nekk ci sunu xol.\n\n#Kiringo #GoxBi #Dimbalante #Teranga`;
    return res.json({ text: mockPost, isMock: true });
  }

  try {
    const prompt = `Génère une publication de réseau social en langue wolof (avec des expressions sénégalaises chaleureuses) de style Facebook, hautement engageante, chaleureuse et captivante à propos de l'idée suivante : "${topic}".
Le ton de la publication doit être résolument "${selectedTone}".
Ajoute des émojis pertinents, des sauts de ligne élégants pour faciliter la lecture, et quelques hashtags inspirants à la fin (toujours inclure #Kiringo #Teranga #GoxBi).
La publication doit donner envie aux utilisateurs de Kiringo de commenter, liker et partager en wolof.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "Tu es un Community Manager expert pour Kiringo, le réseau social le plus convivial du Sénégal. Tu t'exprimes en wolof naturel et chaleureux.",
        temperature: 0.9,
      },
    });

    res.json({ text: response.text || "...", isMock: false });
  } catch (error: any) {
    console.error("Gemini API Error in /api/generate-post:", error);
    const mockPost = `✨ [Mbooloo waa Kiringo] ✨\n\n📢 Mbiri : *${topic}*\n\n🤝 Ñëwalen nu and, waxante te dundal sunu gox bi ci Kiringo! Fi la plaj bu baax ngir wax li nekk ci sunu xol.\n\n#Kiringo #GoxBi #Dimbalante #Teranga`;
    res.json({ text: mockPost, isMock: true, error: error.message });
  }
});

// Serve frontend and handle SPA fallback
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
