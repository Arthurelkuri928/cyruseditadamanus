
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ToolCardProps {
  id: number;
  title: string;
  logoImage: string;
  bgColor: string;
  textColor: string;
  status: "online" | "maintenance" | "offline";
  category: string;
}

const ToolCard = ({ id, title, logoImage, bgColor, textColor, status, category }: ToolCardProps) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isFavoriteHovered, setIsFavoriteHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [logoError, setLogoError] = useState(false);
  
  // Check if this tool is in favorites on component mount
  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(savedFavorites.includes(id));
  }, [id]);
  
  const getStatusInfo = () => {
    switch(status) {
      case "online":
        return { color: "bg-green-500", label: "Ativa" };
      case "maintenance":
        return { color: "bg-yellow-500", label: "Em manutenção" };
      case "offline":
        return { color: "bg-red-500", label: "Offline" };
      default:
        return { color: "bg-gray-500", label: "Desconhecido" };
    }
  };
  
  const statusInfo = getStatusInfo();
  
  // Toggle favorite status
  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);
    
    // Save to localStorage
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (newFavoriteState) {
      localStorage.setItem('favorites', JSON.stringify([...savedFavorites, id]));
    } else {
      localStorage.setItem('favorites', JSON.stringify(savedFavorites.filter((favId: number) => favId !== id)));
    }
  };
  
  return (
    <motion.div 
      className="relative rounded-lg overflow-hidden h-[110px] cursor-pointer"
      style={{ backgroundColor: bgColor || "#111" }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ 
        scale: 1.03,
        boxShadow: `0 10px 25px rgba(0, 0, 0, 0.25)`,
        transition: { duration: 0.2 }
      }}
      onClick={() => navigate(`/ferramenta/${id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Status indicator */}
      <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
        <motion.div 
          className={`h-2 w-2 rounded-full ${statusInfo.color}`}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ repeat: Infinity, duration: 2 }}
        ></motion.div>
        <span className={`text-xs font-medium ${textColor === 'white' ? 'text-white' : 'text-black'} opacity-80`}>
          {statusInfo.label}
        </span>
      </div>
      
      {/* Favorite button */}
      <motion.div
        className="absolute top-3 left-3 z-20"
        whileHover={{ scale: 1.2 }}
        onMouseEnter={() => setIsFavoriteHovered(true)}
        onMouseLeave={() => setIsFavoriteHovered(false)}
        onClick={toggleFavorite}
      >
        <motion.div 
          className={`w-6 h-6 flex items-center justify-center rounded-full ${
            isFavorite ? 'bg-red-500' : 'bg-zinc-800/70'
          } cursor-pointer transition-colors`}
          animate={
            isFavorite && isFavoriteHovered 
              ? { scale: [1, 1.2, 1], transition: { duration: 0.3 } }
              : {}
          }
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="14" 
            height="14" 
            viewBox="0 0 24 24" 
            fill={isFavorite ? "white" : "none"} 
            stroke="white" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          {isFavorite && isFavoriteHovered && (
            <motion.div
              className="absolute inset-0 rounded-full bg-red-400 z-[-1]"
              initial={{ opacity: 0.5, scale: 1 }}
              animate={{ opacity: 0, scale: 1.8 }}
              transition={{ duration: 0.8 }}
            />
          )}
        </motion.div>
      </motion.div>
      
      {/* Card layout - New improved layout */}
      <div className="flex h-full">
        {/* Logo side - Enhanced with more space and better centering */}
        <div className="w-2/5 flex items-center justify-center p-3 border-r border-white/10 relative">
          {logoImage && !logoError ? (
            <motion.div 
              className="flex items-center justify-center w-full h-full"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <img 
                src={logoImage} 
                alt={title} 
                className="max-w-[85%] max-h-[85%] object-contain" 
                onError={() => setLogoError(true)}
              />
            </motion.div>
          ) : (
            <div className={`text-4xl font-bold flex items-center justify-center ${textColor === 'white' ? 'text-white' : 'text-black'}`}>
              {title.charAt(0)}
            </div>
          )}
        </div>
        
        {/* Content side */}
        <div className="w-3/5 flex flex-col justify-center p-4 relative">
          <h3 className={`text-lg font-bold ${textColor === 'white' ? 'text-white' : 'text-black'} line-clamp-1`}>
            {title}
          </h3>
          
          <div className={`text-xs mt-1 ${textColor === 'white' ? 'text-white/70' : 'text-black/70'}`}>
            {category}
          </div>
          
          {/* Hover button - appears only on hover */}
          <motion.div 
            className="absolute inset-0 bg-black/70 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              variant="purpleDark"
              size="sm"
              className="text-white"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/ferramenta/${id}`);
              }}
              style={{
                opacity: isHovered ? 1 : 0,
                transform: isHovered ? 'scale(1)' : 'scale(0.9)',
                transition: 'all 0.2s ease'
              }}
            >
              Acessar <ArrowRight size={16} className="ml-1" />
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ToolCard;
