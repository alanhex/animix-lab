import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, UI_TEXT, ANIMALS } from '../store/gameStore';

const images = import.meta.glob('../assets/*.png', { eager: true, query: '?url', import: 'default' });

export const HybridDisplay = () => {
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const { currentHybrid, getLocalizedHybrid, language, replaceCurrentHybrid } = useGameStore();

  if (!currentHybrid) return null;

  const hybrid = getLocalizedHybrid(currentHybrid);
  if (!hybrid) return null;

  const imagePath = `../assets/${hybrid.id}.png`;
  const imageSrc = (images[imagePath] as string) || '';
  const ui = UI_TEXT[language];

  return (
    <div className="relative w-auto max-w-3xl bg-white/50 rounded-2xl border-[6px] border-bubbly-teal/50 overflow-hidden shadow-xl group min-h-[200px] mx-auto">
      <div className="absolute top-0 left-0 w-8 md:w-16 h-8 md:h-16 border-t-8 border-l-8 border-zesty-orange rounded-tl-lg z-20 pointer-events-none opacity-80" />
      <div className="absolute top-0 right-0 w-8 md:w-16 h-8 md:h-16 border-t-8 border-r-8 border-zesty-orange rounded-tr-lg z-20 pointer-events-none opacity-80" />
      <div className="absolute bottom-0 left-0 w-8 md:w-16 h-8 md:h-16 border-b-8 border-l-8 border-zesty-orange rounded-bl-lg z-20 pointer-events-none opacity-80" />
      <div className="absolute bottom-0 right-0 w-8 md:w-16 h-8 md:h-16 border-b-8 border-r-8 border-zesty-orange rounded-br-lg z-20 pointer-events-none opacity-80" />
      
      <div className="w-full h-full flex items-center justify-center">
         {imageSrc ? (
            <motion.img 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            src={imageSrc} 
            alt={hybrid.name} 
            className="w-auto h-auto max-h-[40vh] md:max-h-[50vh] block relative z-10 drop-shadow-lg"
            onError={() => replaceCurrentHybrid()}
            />
         ) : (
             <div className="text-text-dark-blue animate-pulse py-20">{ui.loading} {hybrid.name}...</div>
         )}
      </div>

      {(imageSrc || true) && hybrid.hotspots.map((spot) => (
        <motion.button
          key={spot.id}
          className="absolute w-12 h-12 bg-zesty-orange rounded-full border-4 border-white shadow-lg cursor-pointer z-10 flex items-center justify-center text-white font-bold text-xl hover:scale-110 active:scale-95"
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
            className="absolute bottom-4 left-4 right-4 bg-white/95 text-text-dark-blue p-6 rounded-2xl shadow-xl border-l-8 border-bubbly-teal z-20 max-h-[80%] overflow-y-auto"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold mb-1 text-bubbly-teal">{ui.scientistSays}</h3>
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

      {(imageSrc || true) && hybrid.hotspots.map((spot) => (
        <motion.button
          key={spot.id}
          className="absolute w-12 h-12 bg-zesty-orange rounded-full border-4 border-white shadow-lg cursor-pointer z-10 flex items-center justify-center text-white font-bold text-xl hover:scale-110 active:scale-95"
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
            className="absolute bottom-4 left-4 right-4 bg-white/95 text-text-dark-blue p-6 rounded-2xl shadow-xl border-l-8 border-bubbly-teal z-20 max-h-[80%] overflow-y-auto"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold mb-1 text-bubbly-teal">{ui.scientistSays}</h3>
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
