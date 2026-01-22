import { create } from 'zustand';
import hybridsDataEn from './hybridsData.json';
import hybridsDataFr from './hybridsData_fr.json';

type Language = 'en' | 'fr';

export type Animal = {
  id: string;
  name: Record<Language, string>;
  icon: string;
  fact: Record<Language, string>;
};

export type Hybrid = {
  id: string;
  name: string;
  components: string[];
  imagePrompt: string;
  hotspots: { id: string; x: string; y: string; note: string }[];
  fact: string;
};

export const ANIMALS: Animal[] = [
  { 
    id: 'lion', 
    icon: '🦁', 
    name: { en: 'Lion', fr: 'Lion' },
    fact: { en: 'Lions sleep for 20 hours a day!', fr: 'Les lions dorment 20 heures par jour !' } 
  },
  { 
    id: 'penguin', 
    icon: '🐧', 
    name: { en: 'Penguin', fr: 'Manchot' },
    fact: { en: 'Penguins can drink sea water.', fr: 'Les manchots peuvent boire de l\'eau de mer.' } 
  },
  { 
    id: 'crocodile', 
    icon: '🐊', 
    name: { en: 'Crocodile', fr: 'Crocodile' },
    fact: { en: 'Crocodiles can live for 80 years.', fr: 'Les crocodiles peuvent vivre 80 ans.' } 
  },
  { 
    id: 'elephant', 
    icon: '🐘', 
    name: { en: 'Elephant', fr: 'Éléphant' },
    fact: { en: 'Elephants are the largest land animals.', fr: 'Les éléphants sont les plus grands animaux terrestres.' } 
  },
  { 
    id: 'zebra', 
    icon: '🦓', 
    name: { en: 'Zebra', fr: 'Zèbre' },
    fact: { en: 'Every zebra has unique stripes.', fr: 'Chaque zèbre a des rayures uniques.' } 
  },
  { 
    id: 'monkey', 
    icon: '🐒', 
    name: { en: 'Monkey', fr: 'Singe' },
    fact: { en: 'Monkeys can count!', fr: 'Les singes savent compter !' } 
  },
  { 
    id: 'tiger', 
    icon: '🐅', 
    name: { en: 'Tiger', fr: 'Tigre' },
    fact: { en: 'Tigers love to swim!', fr: 'Les tigres adorent nager !' } 
  },
  { 
    id: 'giraffe', 
    icon: '🦒', 
    name: { en: 'Giraffe', fr: 'Girafe' },
    fact: { en: 'Giraffes have blue tongues.', fr: 'Les girafes ont la langue bleue.' } 
  },
  { 
    id: 'hippo', 
    icon: '🦛', 
    name: { en: 'Hippo', fr: 'Hippopotame' },
    fact: { en: 'Hippos produce pink "sweat".', fr: 'Les hippopotames produisent de la "sueur" rose.' } 
  },
  { 
    id: 'parrot', 
    icon: '🦜', 
    name: { en: 'Parrot', fr: 'Perroquet' },
    fact: { en: 'Some parrots can live over 80 years.', fr: 'Certains perroquets peuvent vivre plus de 80 ans.' } 
  },
];

export const UI_TEXT = {
  en: {
    title: 'Animix Lab',
    reset: 'RESET',
    level: 'LEVEL',
    score: 'SCORE',
    trayTitle: 'Who is in the mix?',
    remove: 'REMOVE',
    nextLevel: 'NEXT EXPERIMENT ➡️',
    funFact: 'FUN FACT:',
    missionComplete: 'MISSION COMPLETE!',
    allIdentified: 'You have identified all the hybrids!',
    playAgain: 'PLAY AGAIN',
    scientistSays: 'Dr. Mixer says:',
    loading: 'Loading...'
  },
  fr: {
    title: 'Labo Animix',
    reset: 'RÉINITIALISER',
    level: 'NIVEAU',
    score: 'SCORE',
    trayTitle: 'Qui est dans le mélange ?',
    remove: 'RETIRER',
    nextLevel: 'PROCHAINE EXPÉRIENCE ➡️',
    funFact: 'LE SAVIEZ-VOUS :',
    missionComplete: 'MISSION ACCOMPLIE !',
    allIdentified: 'Vous avez identifié tous les hybrides !',
    playAgain: 'REJOUER',
    scientistSays: 'Dr. Mixer dit :',
    loading: 'Chargement...'
  }
};

interface GameState {
  language: Language;
  score: number;
  level: number;
  maxLevels: number;
  
  hybridQueue: Hybrid[];
  currentHybrid: Hybrid | null;
  
  slots: (Animal | null)[];
  isGameWon: boolean;
  isGameFinished: boolean;
  failedHybridIds: string[];

  setLanguage: (lang: Language) => void;
  startGame: () => void;
  addAnimalToSlot: (animal: Animal) => void;
  removeAnimalFromSlot: (index: number) => void;
  nextLevel: () => void;
  resetLevel: () => void;
  replaceCurrentHybrid: () => void;
  getLocalizedHybrid: (hybrid: Hybrid | null) => Hybrid | null;
}

const getInitialLanguage = (): Language => {
  const saved = localStorage.getItem('animix_lang');
  return (saved === 'en' || saved === 'fr') ? saved : 'fr';
};

export const useGameStore = create<GameState>((set, get) => ({
  language: getInitialLanguage(),
  score: 0,
  level: 1,
  maxLevels: 5,
  hybridQueue: [],
  currentHybrid: null,
  slots: [null, null, null],
  isGameWon: false,
  isGameFinished: false,
  failedHybridIds: [],

  setLanguage: (lang) => {
    localStorage.setItem('animix_lang', lang);
    set({ language: lang });
  },

  startGame: () => {
    const shuffled = [...hybridsDataEn].sort(() => 0.5 - Math.random());
    const queue = shuffled.slice(0, 5);
    
    set({
      score: 0,
      level: 1,
      hybridQueue: queue,
      currentHybrid: queue[0],
      slots: [null, null, null],
      isGameWon: false,
      isGameFinished: false,
    });
  },

  addAnimalToSlot: (animal) => {
    const { slots, isGameWon, currentHybrid } = get();
    if (isGameWon || !currentHybrid) return;

    if (slots.some(s => s?.id === animal.id)) return;

    const emptyIndex = slots.findIndex(s => s === null);
    if (emptyIndex === -1) return;

    const newSlots = [...slots];
    newSlots[emptyIndex] = animal;

    const currentIds = newSlots.map(s => s?.id).filter(Boolean) as string[];
    const targetIds = currentHybrid.components;
    
    const hasWon = targetIds.length === currentIds.length && 
                   targetIds.every(id => currentIds.includes(id));

    if (hasWon) {
        set(state => ({ 
            slots: newSlots, 
            isGameWon: true,
            score: state.score + 100 
        }));
    } else {
        set({ slots: newSlots });
    }
  },

  removeAnimalFromSlot: (index) => {
    const { isGameWon } = get();
    if (isGameWon) return;

    set(state => {
      const newSlots = [...state.slots];
      newSlots[index] = null;
      return { slots: newSlots };
    });
  },

  nextLevel: () => {
      const { level, maxLevels, hybridQueue } = get();
      
      if (level >= maxLevels) {
          set({ isGameFinished: true });
          return;
      }

      const nextIndex = level;
      const nextHybrid = hybridQueue[nextIndex];

      set({
          level: level + 1,
          currentHybrid: nextHybrid,
          slots: [null, null, null],
          isGameWon: false
      });
  },

  resetLevel: () => set({ slots: [null, null, null], isGameWon: false }),

  replaceCurrentHybrid: () => {
      const { hybridQueue, currentHybrid, failedHybridIds } = get();
      if (!currentHybrid) return;

      const newFailed = [...failedHybridIds, currentHybrid.id];
      const usedIds = new Set(hybridQueue.map(h => h.id));
      
      const candidates = hybridsDataEn.filter(h => 
          !usedIds.has(h.id) && !newFailed.includes(h.id)
      );
      
      if (candidates.length === 0) {
          console.warn("No more valid hybrids available.");
          set({ failedHybridIds: newFailed }); 
          return;
      }

      const randomReplacement = candidates[Math.floor(Math.random() * candidates.length)];
      
      const newQueue = hybridQueue.map(h => h.id === currentHybrid.id ? randomReplacement : h);
      
      set({
          failedHybridIds: newFailed,
          hybridQueue: newQueue,
          currentHybrid: randomReplacement,
          slots: [null, null, null],
          isGameWon: false
      });
  },

  getLocalizedHybrid: (hybrid) => {
      if (!hybrid) return null;
      const { language } = get();
      if (language === 'en') return hybrid;

      const localizedData = (hybridsDataFr as any[]).find(h => h.id === hybrid.id);
      if (!localizedData) return hybrid;

      return {
          ...hybrid,
          name: localizedData.name,
          fact: localizedData.fact,
          hotspots: hybrid.hotspots.map(h => {
              const localizedSpot = localizedData.hotspots.find((lh: any) => lh.id === h.id);
              return localizedSpot ? { ...h, note: localizedSpot.note } : h;
          })
      };
  }
}));
