import { motion } from 'framer-motion';
import { ANIMALS, useGameStore, UI_TEXT } from '../store/gameStore';

export const GuessingTray = () => {
  const { slots, language, addAnimalToSlot } = useGameStore();
  const ui = UI_TEXT[language];

  const handleDragStart = (e: React.DragEvent, animalId: string) => {
    e.dataTransfer.setData('animalId', animalId);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const isAnimalUsed = (id: string) => slots.some(s => s?.id === id);

  return (
    <div className="w-full bg-white/10 backdrop-blur-md p-6 rounded-t-3xl border-t-4 border-cyber-purple shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
      <h2 className="text-xl sm:text-2xl font-bold mb-2 text-center text-cyber-green drop-shadow-md">
        {ui.trayTitle}
      </h2>
      
      <div className="relative w-full">
        <div className="flex gap-4 overflow-x-auto pb-4 px-4 justify-start">
          {ANIMALS.map((animal) => {
            const used = isAnimalUsed(animal.id);
            return (
              <motion.div
                key={animal.id}
                draggable={!used}
                onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent, animal.id)}
                onClick={() => !used && addAnimalToSlot(animal)}
                whileHover={!used ? { scale: 1.1, y: -5 } : {}}
                whileTap={!used ? { scale: 0.95 } : {}}
                className={`
                  flex flex-col items-center justify-center 
                  w-28 h-32 flex-shrink-0 
                  bg-white rounded-2xl shadow-lg border-b-8 
                  ${used 
                    ? 'opacity-40 cursor-not-allowed border-gray-300' 
                    : 'cursor-pointer active:scale-95 border-cyber-purple hover:border-cyber-green'
                  }
                  transition-colors duration-200 select-none
                `}
              >
                <span className="text-6xl mb-2 filter drop-shadow-sm select-none">
                  {animal.icon}
                </span>
                <span className="text-sm font-bold text-lab-dark bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap">
                  {animal.name[language]}
                </span>
              </motion.div>
            );
          })}
        </div>
        
        <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-lab-light to-transparent pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-lab-light to-transparent pointer-events-none" />
      </div>
    </div>
  );
};
