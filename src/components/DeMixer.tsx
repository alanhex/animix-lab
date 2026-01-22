import { motion } from 'framer-motion';
import { useGameStore, ANIMALS, UI_TEXT } from '../store/gameStore';
import clsx from 'clsx';

const images = import.meta.glob('../assets/*.png', { eager: true, query: '?url', import: 'default' });

export const DeMixer = () => {
  const { slots, addAnimalToSlot, removeAnimalFromSlot, isGameWon, isGameFinished, nextLevel, startGame, currentHybrid, getLocalizedHybrid, language } = useGameStore();
  const ui = UI_TEXT[language];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const animalId = e.dataTransfer.getData('animalId');
    const animal = ANIMALS.find(a => a.id === animalId);
    
    if (animal) {
      addAnimalToSlot(animal);
    }
  };

  if (isGameFinished) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative bg-white p-8 rounded-3xl text-lab-dark text-center border-8 border-cyber-green max-w-md w-full shadow-2xl"
            >
                <h2 className="text-4xl font-bold text-cyber-purple mb-4">{ui.missionComplete}</h2>
                <p className="text-xl mb-6">{ui.allIdentified}</p>
                <button 
                    onClick={startGame}
                    className="bg-cyber-purple text-white px-8 py-4 rounded-full text-2xl font-bold shadow-lg hover:bg-purple-600 transition-transform hover:scale-105"
                >
                    {ui.playAgain}
                </button>
            </motion.div>
        </div>
      );
  }

  const localizedHybrid = getLocalizedHybrid(currentHybrid);
  const imagePath = localizedHybrid ? `../assets/${localizedHybrid.id}.png` : '';
  const imageSrc = (images[imagePath] as string) || '';

  return (
    <div className="flex flex-col items-center gap-4 my-4 w-full max-w-3xl">
      <div className="flex gap-4 md:gap-8 w-full justify-center">
        {slots.map((animal, index) => (
          <div
            key={index}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => animal && removeAnimalFromSlot(index)}
            className={clsx(
              "w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full border-4 border-dashed flex items-center justify-center transition-all duration-300 relative",
              animal 
                ? "bg-white border-cyber-green shadow-[0_0_20px_#39FF14] cursor-pointer hover:bg-red-50 hover:border-red-400 group" 
                : "bg-black/20 border-white/30 backdrop-blur-sm"
            )}
          >
            {animal ? (
              <>
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-4xl sm:text-5xl md:text-6xl select-none"
                >
                  {animal.icon}
                </motion.span>
                <div className="absolute inset-0 flex items-center justify-center bg-red-500/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-white font-bold text-sm">
                  {ui.remove}
                </div>
              </>
            ) : (
              <span className="text-white/30 text-3xl sm:text-4xl font-bold">+</span>
            )}
          </div>
        ))}
      </div>
      
      {isGameWon && localizedHybrid && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative bg-white text-lab-dark p-2 sm:p-6 rounded-2xl shadow-2xl border-4 border-cyber-green text-center max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
            {imageSrc && (
                <div className="w-full mb-2 flex items-center justify-center">
                    <img src={imageSrc} alt={localizedHybrid.name} className="w-full h-auto object-contain drop-shadow-md" />
                </div>
            )}
            <h2 className="text-xl sm:text-3xl font-bold text-cyber-purple mb-2">
                IT'S A {localizedHybrid.name.toUpperCase()}!
            </h2>
            <div className="bg-yellow-100 p-2 sm:p-4 rounded-xl border-l-4 border-yellow-400 text-left mb-4 text-sm sm:text-base">
                <span className="font-bold block mb-1">{ui.funFact}</span>
                {localizedHybrid.fact}
            </div>
            
            <button 
                onClick={nextLevel}
                className="w-full bg-cyber-green text-lab-dark py-2 sm:py-3 rounded-xl text-lg sm:text-xl font-bold hover:brightness-110 active:scale-95 transition-all shadow-md"
            >
                {ui.nextLevel}
            </button>
            </motion.div>
        </div>
      )}
    </div>
  );
};
