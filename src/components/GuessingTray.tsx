import { motion } from 'framer-motion';
import { ANIMALS, useGameStore, UI_TEXT } from '../store/gameStore';

export const GuessingTray = () => {
  const { slots, language } = useGameStore();
  const ui = UI_TEXT[language];

  const handleDragStart = (e: React.DragEvent, animalId: string) => {
    e.dataTransfer.setData('animalId', animalId);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const isAnimalUsed = (id: string) => slots.some(s => s?.id === id);

  return (
    <div className="w-full bg-white/10 backdrop-blur-md p-6 rounded-t-3xl border-t-4 border-cyber-purple shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
      <h2 className="text-2xl font-bold mb-4 text-center text-cyber-green drop-shadow-md">
        {ui.trayTitle}
      </h2>
      
      <div className="flex gap-4 overflow-x-auto pb-4 px-2 tray-scroll justify-center">
        {ANIMALS.map((animal) => {
          const used = isAnimalUsed(animal.id);
          return (
            <motion.div
              key={animal.id}
              draggable={!used}
              onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent, animal.id)}
              whileHover={!used ? { scale: 1.1, y: -5 } : {}}
              whileTap={!used ? { scale: 0.95 } : {}}
              className={`
                flex flex-col items-center justify-center 
                w-24 h-32 flex-shrink-0 
                bg-white rounded-2xl shadow-lg border-b-8 
                ${used 
                  ? 'opacity-40 cursor-not-allowed border-gray-300' 
                  : 'cursor-grab active:cursor-grabbing border-cyber-purple hover:border-cyber-green'
                }
                transition-colors duration-200
              `}
            >
              <span className="text-5xl mb-2 filter drop-shadow-sm select-none">
                {animal.icon}
              </span>
              <span className="text-sm font-bold text-lab-dark bg-gray-100 px-2 py-1 rounded-full whitespace-nowrap">
                {animal.name[language]}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
