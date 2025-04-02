import { TarotSpread } from "@/types";
import { 
  Sun, LibraryBig, Flame 
} from "lucide-react";

// Tarot Kart Verileri
export const tarotCards = [
  { id: 1, name: "The Fool", image: "/tarot/fool.jpg" },
  { id: 2, name: "The Magician", image: "/tarot/magician.jpg" },
  { id: 3, name: "The High Priestess", image: "/tarot/high-priestess.jpg" },
  { id: 4, name: "The Empress", image: "/tarot/empress.jpg" },
  { id: 5, name: "The Emperor", image: "/tarot/emperor.jpg" },
  { id: 6, name: "The Hierophant", image: "/tarot/hierophant.jpg" },
  { id: 7, name: "The Lovers", image: "/tarot/lovers.jpg" },
  { id: 8, name: "The Chariot", image: "/tarot/chariot.jpg" },
  { id: 9, name: "Strength", image: "/tarot/strength.jpg" },
  { id: 10, name: "The Hermit", image: "/tarot/hermit.jpg" },
  { id: 11, name: "Wheel of Fortune", image: "/tarot/wheel-of-fortune.jpg" },
  { id: 12, name: "Justice", image: "/tarot/justice.jpg" },
  { id: 13, name: "The Hanged Man", image: "/tarot/hanged-man.jpg" },
  { id: 14, name: "Death", image: "/tarot/death.jpg" },
  { id: 15, name: "Temperance", image: "/tarot/temperance.jpg" },
  { id: 16, name: "The Devil", image: "/tarot/devil.jpg" },
  { id: 17, name: "The Tower", image: "/tarot/tower.jpg" },
  { id: 18, name: "The Star", image: "/tarot/star.jpg" },
  { id: 19, name: "The Moon", image: "/tarot/moon.jpg" },
  { id: 20, name: "The Sun", image: "/tarot/sun.jpg" },
  { id: 21, name: "Judgment", image: "/tarot/judgment.jpg" },
  { id: 22, name: "The World", image: "/tarot/world.jpg" },
];

// Tarot Açılımı Verileri
export const tarotSpreads: Record<TarotSpread, { 
  name: string; 
  description: string; 
  icon: React.ReactNode;
  color: string;
  credits: number;
  cardCount: number;
}> = {
  "single-card": {
    name: "Tek Kart",
    description: "Günlük rehberlik veya basit bir soruya cevap için idealdir",
    icon: <Sun className="h-8 w-8" />,
    color: "from-amber-300 to-yellow-500 border-amber-200 dark:border-amber-800",
    credits: 1,
    cardCount: 1
  },
  "three-card": {
    name: "Üç Kart",
    description: "Geçmiş, şimdi ve gelecek veya durum, eylem ve sonuç gibi üçlü bir perspektif sunar",
    icon: <LibraryBig className="h-8 w-8" />,
    color: "from-emerald-300 to-teal-500 border-emerald-200 dark:border-emerald-800",
    credits: 1,
    cardCount: 3
  },
  "celtic-cross": {
    name: "Kelt Haçı",
    description: "Derinlemesine ve kapsamlı bir okuma için 10 kart kullanılan klasik düzen",
    icon: <Flame className="h-8 w-8" />,
    color: "from-purple-300 to-violet-500 border-purple-200 dark:border-purple-800",
    credits: 3,
    cardCount: 10
  },
}; 