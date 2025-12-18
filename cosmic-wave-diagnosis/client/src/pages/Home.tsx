import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useLocation } from "wouter";

export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen w-full bg-[#050A18] text-white overflow-hidden relative flex flex-col items-center justify-center">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/hero_bg.png')] bg-cover bg-center opacity-60"></div>
        
        {/* Animated Orbs */}
        <motion.div 
          animate={{ 
            y: [0, -20, 0],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/20 rounded-full blur-[80px]"
        />
        <motion.div 
          animate={{ 
            y: [0, 30, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-600/20 rounded-full blur-[100px]"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-8"
        >
          <h2 className="text-blue-300 font-serif tracking-[0.2em] text-sm md:text-base mb-4 uppercase">
            Cosmic Wave Diagnosis
          </h2>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/50 font-serif mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            波動診断
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto font-light leading-relaxed">
            あなたの魂が放つ固有の周波数を読み解き、<br className="hidden md:block" />
            宇宙におけるあなたの役割と本質を明らかにします。
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <Button 
            onClick={() => setLocation("/diagnosis")}
            className="group relative px-12 py-8 bg-transparent overflow-hidden rounded-full transition-all duration-500 hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] border border-white/20"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-[url('/images/card_texture.png')] opacity-30 mix-blend-overlay"></div>
            
            <span className="relative z-10 text-xl md:text-2xl font-serif tracking-widest text-white group-hover:text-white transition-colors">
              診断を始める
            </span>
            
            {/* Button Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
          </Button>
          
          <p className="mt-6 text-sm text-gray-500 font-light tracking-wider">
            所要時間: 約 3 分
          </p>
        </motion.div>
      </div>
    </div>
  );
}
