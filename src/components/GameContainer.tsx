import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useGameStore, UI_TEXT } from '../store/gameStore';
import { HybridDisplay } from './HybridDisplay';
import { GuessingTray } from './GuessingTray';
import { DeMixer } from './DeMixer';

export const GameContainer = () => {
  const { isGameWon, startGame, currentHybrid, score, level, maxLevels, language, setLanguage } = useGameStore();

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
    <div className="min-h-screen bg-lab-dark text-white flex flex-col items-center relative overflow-hidden">
      
      <header className="w-full p-4 flex justify-between items-center max-w-6xl z-10">
        <div className="flex items-center gap-2">
           <div className="w-10 h-10 bg-cyber-green rounded-full flex items-center justify-center text-2xl animate-bounce-slow shadow-[0_0_15px_#39FF14]">
             🧬
           </div>
           <h1 className="text-3xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyber-green to-cyber-purple drop-shadow-sm hidden md:block">
             {ui.title}
           </h1>
        </div>

        <div className="flex gap-4 items-center">
            <button 
                onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
                className="bg-transparent border border-white/30 px-3 py-2 rounded-xl text-2xl hover:bg-white/10 transition-colors"
                title="Switch Language"
            >
                {language === 'en' ? '🇫🇷' : '🇬🇧'}
            </button>

            <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md border border-white/20 font-bold hidden sm:block">
                {ui.level} {level}/{maxLevels}
            </div>
            <div className="bg-cyber-purple px-4 py-2 rounded-xl font-bold shadow-lg border border-white/20">
                {ui.score}: {score}
            </div>
            <button 
                onClick={startGame}
                className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm font-bold backdrop-blur-sm transition-colors border border-white/20"
            >
                {ui.reset}
            </button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl flex flex-col items-center justify-center px-4 py-2 z-10 relative">
        <HybridDisplay />
        <DeMixer />
      </main>

      <div className="w-full z-20">
        <GuessingTray />
      </div>

      <div className="absolute top-20 left-10 w-64 h-64 bg-cyber-purple/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-40 right-10 w-80 h-80 bg-cyber-green/10 rounded-full blur-[120px] pointer-events-none" />
    </div>
  );
};
