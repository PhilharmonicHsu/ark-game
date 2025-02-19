import { motion } from "framer-motion";

export default function GameOver({ onRestart }: { onRestart: () => void }) {
    return (
        <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div 
                className="bg-gradient-to-br from-[#1E1F2F] to-[#282A3A] text-white p-8 rounded-lg shadow-2xl flex flex-col items-center border border-[#7D7DFF] backdrop-blur-md"
                animate={{ y: [0, -10, 0] }} 
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
                <motion.h1 
                    className="font-pixel text-6xl font-bold uppercase text-[#D47DFF] drop-shadow-lg"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    Game Over!
                </motion.h1>

                <p 
                    className="font-pixel mt-3 text-4xl text-[#B7B8E3] drop-shadow-sm"
                >
                    Some animals fell out of the ark!
                </p>

                <button 
                    onClick={onRestart}
                    className="font-pixel text-xl mt-5 bg-[#4F7DFF] hover:bg-[#6B9DFF] text-white font-bold py-2 px-6 rounded-md shadow-md transition-all duration-200"
                >
                    Restart Game
                </button>
            </motion.div>
        </motion.div>
    );
}
