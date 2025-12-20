import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDiagnosis } from "@/hooks/useDiagnosis";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import ReactMarkdown from 'react-markdown';

// Helper to format text with line breaks after periods and remove bold markers and MBTI terms
const formatText = (text: string) => {
  // Replace period with period + 2 newlines for clear separation
  // Also remove MBTI terms like (Fe), (Ni), etc.
  return text
    .replace(/\*\*/g, "")
    .replace(/\([A-Za-z]{2}\)/g, "")
    .replace(/。/g, "。\n\n&nbsp;\n\n");
};

// Helper to parse markdown content into sections based on headers and colons
const parseContent = (content: string) => {
  const sections: { title: string; content: string }[] = [];
  const lines = content.split('\n');
  let currentTitle = "概要";
  let currentContent: string[] = [];

  const pushSection = (title: string, contentLines: string[]) => {
    const contentStr = contentLines.join('\n').trim();
    // Skip empty sections or sections with only whitespace
    if (contentStr && title !== "概要") {
      sections.push({ title, content: contentStr });
    } else if (contentStr && title === "概要" && contentStr.length > 20) {
       // Only push "概要" if it has substantial content
       sections.push({ title, content: contentStr });
    }
  };

  lines.forEach(line => {
    const trimmedLine = line.trim();
    
    // Check for headers
    if (line.startsWith('### ')) {
      pushSection(currentTitle, currentContent);
      currentTitle = line.replace('### ', '').trim();
      currentContent = [];
    } 
    // Check for lines containing "：" which might be key-value pairs (e.g., Lucky Item)
    else if (trimmedLine.includes('：') && trimmedLine.length < 50 && !trimmedLine.endsWith('。')) {
      pushSection(currentTitle, currentContent);
      const parts = trimmedLine.split('：');
      currentTitle = parts[0].trim();
      // If there is content after the colon, add it as the first line of new section
      if (parts[1]) {
        currentContent = [parts[1].trim()];
      } else {
        currentContent = [];
      }
    }
    else if (line.startsWith('## ')) {
       // Skip H2 as it's usually subtitle
    } else if (line.startsWith('# ')) {
       // Skip H1 as it's title
    } else {
      currentContent.push(line);
    }
  });
  
  pushSection(currentTitle, currentContent);

  return sections;
};

export default function Diagnosis() {
  const {
    currentQuestion,
    handleAnswer,
    result,
    progress,
    isDiagnosing,
    startDiagnosis
  } = useDiagnosis();
  
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("section-0");
  const [showVideo, setShowVideo] = useState(false);

  // Start diagnosis on mount if not already started
  useEffect(() => {
    if (!isDiagnosing && !result) {
      startDiagnosis();
    }
  }, []);

  if (result) {
    const sections = parseContent(result.content);

    return (
      <div className="min-h-screen w-full bg-[#050A18] text-white overflow-x-hidden relative flex justify-center">
        {/* Background Elements */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/hero_bg.png')] bg-cover bg-center opacity-40"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-900/30 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-900/30 rounded-full blur-[100px]"></div>
        </div>

        {/* Mobile Container */}
        <div className="relative z-10 w-full max-w-[480px] bg-black/20 min-h-screen shadow-2xl border-x border-white/5 flex flex-col">
          
          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="pt-12 pb-8 px-6 text-center bg-gradient-to-b from-black/60 to-transparent"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="inline-block mb-6"
            >
              <img 
                src={result.type === 'Sun' ? '/images/sun_symbol.png' : '/images/moon_symbol.png'} 
                alt={result.type} 
                className="w-32 h-32 object-contain drop-shadow-[0_0_30px_rgba(255,215,0,0.5)]"
              />
            </motion.div>
            
            <h2 className="text-sm text-blue-300 font-serif tracking-widest mb-2">あなたの魂の波動タイプ</h2>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 mb-4 font-serif leading-tight">
              {result.title}
            </h1>
            <p className="text-lg text-gray-300 font-light tracking-wide leading-relaxed">
              {result.subtitle}
            </p>
          </motion.div>

          {/* Content List (Vertical Scroll) */}
          <div className="flex-1 px-4 pb-32 space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={`section-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg"
              >
                <h3 className="text-xl font-serif text-amber-100 mb-6 border-b border-white/10 pb-4 flex items-center">
                  <span className="inline-block w-2 h-2 bg-amber-200 rounded-full mr-3 shadow-[0_0_10px_rgba(253,230,138,0.8)]"></span>
                  {section.title}
                </h3>
                <div className="prose prose-invert prose-p:text-gray-300 prose-p:leading-loose prose-p:font-serif prose-p:text-base">
                  <ReactMarkdown>
                    {formatText(section.content)}
                  </ReactMarkdown>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Purification Section */}
          <div className="px-4 pb-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-gradient-to-b from-indigo-900/40 to-purple-900/40 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-[0_0_30px_rgba(139,92,246,0.2)] text-center"
            >
              <h3 className="text-xl font-serif text-amber-100 mb-6 flex items-center justify-center">
                <span className="inline-block w-2 h-2 bg-amber-200 rounded-full mr-3 shadow-[0_0_10px_rgba(253,230,138,0.8)]"></span>
                魂の浄化
                <span className="inline-block w-2 h-2 bg-amber-200 rounded-full ml-3 shadow-[0_0_10px_rgba(253,230,138,0.8)]"></span>
              </h3>
              
              <p className="text-gray-200 font-serif leading-loose mb-8">
                あなたの魂が真に覚醒し<br/>
                本来の輝きを取り戻すための鍵<br/><br/>
                それは、あなた自身の波動を<br/>
                深く清めることにあります<br/><br/>
                日々の喧騒の中で<br/>
                曇ってしまった<br/>
                魂の鏡を磨き<br/><br/>
                宇宙の純粋なエネルギーと<br/>
                再び共鳴するために<br/><br/>
                もし、今ここで<br/>
                心を清めたいと感じたなら<br/><br/>
                その直感に従ってください
              </p>

              <Button 
                onClick={() => setShowVideo(true)}
                className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:via-orange-400 hover:to-amber-400 text-white rounded-full py-8 text-lg font-serif shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all animate-pulse hover:animate-none"
              >
                ヒーリングを希望する
              </Button>
            </motion.div>
          </div>

          {/* Video Modal */}
          <AnimatePresence>
            {showVideo && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
                onClick={() => setShowVideo(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    onClick={() => setShowVideo(false)}
                    className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 w-10 h-10 flex items-center justify-center border border-white/20"
                  >
                    ✕
                  </Button>
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/CdwtgAvrh80?autoplay=1&rel=0"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#050A18] text-white overflow-hidden relative flex justify-center">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/hero_bg.png')] bg-cover bg-center opacity-40"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-900/20 rounded-full blur-[120px] animate-pulse"></div>
      </div>

      {/* Mobile Container */}
      <div className="relative z-10 w-full max-w-[480px] px-6 flex flex-col justify-center min-h-screen">
        {/* Progress Bar */}
        <div className="w-full h-1 bg-white/10 rounded-full mb-12 overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-amber-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion?.id}
            initial={{ opacity: 0, x: 50, filter: "blur(10px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: -50, filter: "blur(10px)" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full"
          >
            <Card className="bg-black/30 backdrop-blur-md border-white/10 p-8 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              <div className="flex justify-center mb-8">
                <span className="text-blue-300 font-serif tracking-widest text-sm uppercase">
                  Question {currentQuestion?.id < 10 ? `0${currentQuestion?.id}` : currentQuestion?.id}
                </span>
              </div>
              
              <div className="flex justify-center mb-12">
                <h2 className="text-xl md:text-2xl font-serif text-center leading-relaxed text-white/90 max-w-[14em] mx-auto break-words whitespace-pre-line">
                  {currentQuestion?.text}
                </h2>
              </div>

              <div className="flex flex-col gap-4">
                <Button
                  onClick={() => handleAnswer('yes')}
                  className="w-full py-8 text-lg bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 rounded-xl transition-all duration-300 group relative overflow-hidden"
                >
                  <span className="relative z-10">はい</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </Button>
                
                <Button
                  onClick={() => handleAnswer('no')}
                  className="w-full py-8 text-lg bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 rounded-xl transition-all duration-300 group relative overflow-hidden"
                >
                  <span className="relative z-10">いいえ</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </Button>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
