export type ZodiacSign = 
  | 'aries' 
  | 'taurus' 
  | 'gemini' 
  | 'cancer' 
  | 'leo' 
  | 'virgo' 
  | 'libra' 
  | 'scorpio' 
  | 'sagittarius' 
  | 'capricorn' 
  | 'aquarius' 
  | 'pisces';

export type ZodiacSignDetails = {
  name: string;
  date: string;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  symbol: string;
  emoji: string;
};

export const zodiacSigns: Record<ZodiacSign, ZodiacSignDetails> = {
  aries: {
    name: 'Koç',
    date: '21 Mart - 19 Nisan',
    element: 'Fire',
    symbol: 'Koç',
    emoji: '♈',
  },
  taurus: {
    name: 'Boğa',
    date: '20 Nisan - 20 Mayıs',
    element: 'Earth',
    symbol: 'Boğa',
    emoji: '♉',
  },
  gemini: {
    name: 'İkizler',
    date: '21 Mayıs - 20 Haziran',
    element: 'Air',
    symbol: 'İkizler',
    emoji: '♊',
  },
  cancer: {
    name: 'Yengeç',
    date: '21 Haziran - 22 Temmuz',
    element: 'Water',
    symbol: 'Yengeç',
    emoji: '♋',
  },
  leo: {
    name: 'Aslan',
    date: '23 Temmuz - 22 Ağustos',
    element: 'Fire',
    symbol: 'Aslan',
    emoji: '♌',
  },
  virgo: {
    name: 'Başak',
    date: '23 Ağustos - 22 Eylül',
    element: 'Earth',
    symbol: 'Başak',
    emoji: '♍',
  },
  libra: {
    name: 'Terazi',
    date: '23 Eylül - 22 Ekim',
    element: 'Air',
    symbol: 'Terazi',
    emoji: '♎',
  },
  scorpio: {
    name: 'Akrep',
    date: '23 Ekim - 21 Kasım',
    element: 'Water',
    symbol: 'Akrep',
    emoji: '♏',
  },
  sagittarius: {
    name: 'Yay',
    date: '22 Kasım - 21 Aralık',
    element: 'Fire',
    symbol: 'Yay',
    emoji: '♐',
  },
  capricorn: {
    name: 'Oğlak',
    date: '22 Aralık - 19 Ocak',
    element: 'Earth',
    symbol: 'Oğlak',
    emoji: '♑',
  },
  aquarius: {
    name: 'Kova',
    date: '20 Ocak - 18 Şubat',
    element: 'Air',
    symbol: 'Kova',
    emoji: '♒',
  },
  pisces: {
    name: 'Balık',
    date: '19 Şubat - 20 Mart',
    element: 'Water',
    symbol: 'Balık',
    emoji: '♓',
  },
};

export type TarotSpread = 
  | 'three-card' 
  | 'celtic-cross' 
  | 'single-card';

export type FortuneType = 
  | 'horoscope' 
  | 'tarot' 
  | 'coffee' 
  | 'dream';

export type FortuneTypeDetails = {
  name: string;
  description: string;
  icon: string;
  path: string;
};

export const fortuneTypes: Record<FortuneType, FortuneTypeDetails> = {
  horoscope: {
    name: 'Günlük Burç Yorumu',
    description: 'Yıldızların sizin için ne söylediğini öğrenin',
    icon: '✨',
    path: '/horoscope',
  },
  tarot: {
    name: 'Tarot Falı',
    description: 'Tarot kartları ile geleceğinizi keşfedin',
    icon: '🔮',
    path: '/tarot',
  },
  coffee: {
    name: 'Kahve Falı',
    description: 'Türk kahvesi falınıza bakın',
    icon: '☕',
    path: '/coffee',
  },
  dream: {
    name: 'Rüya Yorumu',
    description: 'Rüyalarınızın anlamını öğrenin',
    icon: '💤',
    path: '/dream',
  },
}; 