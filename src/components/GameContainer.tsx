import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useGameStore, UI_TEXT } from '../store/gameStore';
import { HybridDisplay } from './HybridDisplay';
import { GuessingTray } from './GuessingTray';
import { DeMixer } from './DeMixer';

import { Sun, Moon } from 'lucide-react';

export const GameContainer = () => {
  const { isGameWon, startGame, currentHybrid, score, level, maxLevels, language, setLanguage, theme, setTheme } = useGameStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
      if (!currentHybrid) {
          startGame();
      }
  }, []);

  useEffect(() => {
    if (isGameWon) {
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        
        confetti({
          ...defaults, 
          particleCount,
          origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [isGameWon]);

  const ui = UI_TEXT[language];

  return (
    <div className="min-h-screen flex flex-col items-center relative overflow-hidden">
      
      <header className="w-full p-4 flex justify-between items-center max-w-6xl z-10">
        <div className="flex items-center gap-2">
           <div className="w-10 h-10 bg-zesty-orange rounded-full flex items-center justify-center text-2xl animate-bounce-slow shadow-[0_0_15px_#FF6B00]">
             🧬
           </div>
           <h1 className="text-3xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-zesty-orange to-bubbly-teal drop-shadow-sm hidden md:block">
             {ui.title}
           </h1>
        </div>

        <div className="flex gap-2 sm:gap-4 items-center">
            <button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="bg-white dark:bg-dark-card border border-gray-300 dark:border-dark-border p-2 rounded-xl text-xl sm:text-2xl hover:bg-soft-gray dark:hover:bg-gray-600 transition-colors"
                title="Toggle Theme"
            >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button 
                onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
                className="bg-white dark:bg-dark-card border border-gray-300 dark:border-dark-border px-3 py-2 rounded-xl text-xl sm:text-2xl hover:bg-soft-gray dark:hover:bg-gray-600 transition-colors"
                title="Switch Language"
            >
                {language === 'en' ? '🇫🇷' : '🇬🇧'}
            </button>

            <div className="bg-white dark:bg-dark-card px-3 py-2 rounded-xl border border-gray-300 dark:border-dark-border font-bold hidden sm:block text-sm">
                {ui.level} {level}/{maxLevels}
            </div>
            <div className="bg-bubbly-teal text-white px-3 sm:px-4 py-2 rounded-xl font-bold shadow-lg text-sm sm:text-base">
                {ui.score}: {score}
            </div>
            <button 
                onClick={startGame}
                className="bg-white dark:bg-dark-card hover:bg-soft-gray dark:hover:bg-gray-600 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors border border-gray-300 dark:border-dark-border"
            >
                {ui.reset}
            </button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl flex flex-col items-center justify-center px-4 py-2 z-10 relative">
        <HybridDisplay />
        <DeMixer />
      </main>

      {!isGameWon && (
        <div className="w-full z-20">
          <GuessingTray />
        </div>
      )}

      <div className="absolute top-20 left-10 w-64 h-64 bg-bubbly-teal/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-40 right-10 w-80 h-80 bg-zesty-orange/10 rounded-full blur-[120px] pointer-events-none" />
    </div>
  );
};
