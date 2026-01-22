import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, UI_TEXT, ANIMALS } from '../store/gameStore';

const images = import.meta.glob('../assets/*.png', { eager: true, query: '?url', import: 'default' });

export const HybridDisplay = () => {
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const { currentHybrid, getLocalizedHybrid, language } = useGameStore();

  if (!currentHybrid) return null;

  const hybrid = getLocalizedHybrid(currentHybrid);
  if (!hybrid) return null;

  const imagePath = `../assets/${hybrid.id}.png`;
  const imageSrc = (images[imagePath] as string) || '';
  const ui = UI_TEXT[language];

  const fallbackEmojis = hybrid.components.map(id => 
    ANIMALS.find(a => a.id === id)?.icon || '?'
  ).join('');

  return (
    <div className="relative w-auto max-w-3xl bg-lab-dark rounded-2xl border-[6px] border-cyber-purple/50 overflow-hidden shadow-[0_0_50px_rgba(189,0,255,0.4)] group min-h-[200px] mx-auto">
      <div className="absolute top-0 left-0 w-8 md:w-16 h-8 md:h-16 border-t-8 border-l-8 border-cyber-green rounded-tl-lg z-20 pointer-events-none opacity-80" />
      <div className="absolute top-0 right-0 w-8 md:w-16 h-8 md:h-16 border-t-8 border-r-8 border-cyber-green rounded-tr-lg z-20 pointer-events-none opacity-80" />
      <div className="absolute bottom-0 left-0 w-8 md:w-16 h-8 md:h-16 border-b-8 border-l-8 border-cyber-green rounded-bl-lg z-20 pointer-events-none opacity-80" />
      <div className="absolute bottom-0 right-0 w-8 md:w-16 h-8 md:h-16 border-b-8 border-r-8 border-cyber-green rounded-br-lg z-20 pointer-events-none opacity-80" />
      
      <div className="w-full h-full flex items-center justify-center p-4">
         {imageSrc ? (
            <motion.img 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            src={imageSrc} 
            alt={hybrid.name} 
            className="w-auto h-auto max-h-[40vh] md:max-h-[50vh] block relative z-10 drop-shadow-2xl"
            onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement?.classList.add('fallback-mode');
            }}
            />
         ) : (
             <div className="text-white flex flex-col items-center gap-2">
                 <div className="text-6xl animate-pulse">{fallbackEmojis}</div>
                 <div className="text-sm font-mono opacity-70">Image offline - Use DNA Scanners</div>
             </div>
         )}
         
         <div className="hidden fallback-display">
             <div className="text-6xl animate-pulse">{fallbackEmojis}</div>
         </div>
      </div>

      {(imageSrc || true) && hybrid.hotspots.map((spot) => (
        <motion.button
          key={spot.id}
          className="absolute w-12 h-12 bg-cyber-green rounded-full border-4 border-white shadow-lg cursor-pointer z-10 flex items-center justify-center text-lab-dark font-bold text-xl hover:scale-110 active:scale-95"
          style={{ left: spot.x, top: spot.y }}
          whileHover={{ rotate: 15 }}
          onClick={() => setActiveNote(spot.note)}
        >
          ?
        </motion.button>
      ))}

      <AnimatePresence>
        {activeNote && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-4 left-4 right-4 bg-white/95 text-lab-dark p-6 rounded-2xl shadow-xl border-l-8 border-cyber-purple z-20 max-h-[80%] overflow-y-auto"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold mb-1 text-cyber-purple">{ui.scientistSays}</h3>
                <p className="text-lg font-medium">{activeNote}</p>
              </div>
              <button 
                onClick={() => setActiveNote(null)}
                className="bg-gray-200 hover:bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold"
              >
                ×
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
