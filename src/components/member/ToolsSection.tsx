import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Tool {
  id: number;
  title: string;
  logoImage: string;
  bgColor: string;
  textColor: string;
  status: 'online' | 'offline' | 'maintenance';
  category: string;
}

interface ToolsSectionProps {
  title: string;
  tools: Tool[];
  favorites?: number[];
}

const ToolsSection = ({ title, tools, favorites = [] }: ToolsSectionProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const toggleFavorite = (toolId: number, toolTitle: string) => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (savedFavorites.includes(toolId)) {
      // Remover dos favoritos
      const updatedFavorites = savedFavorites.filter((id: number) => id !== toolId);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      
      toast({
        title: "Removido dos favoritos",
        description: `${toolTitle} foi removido dos seus favoritos.`,
      });
    } else {
      // Adicionar aos favoritos
      const updatedFavorites = [...savedFavorites, toolId];
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      
      toast({
        title: "Adicionado aos favoritos",
        description: `${toolTitle} foi adicionado aos seus favoritos.`,
      });
    }
    
    // Forçar atualização da página para refletir as mudanças
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return <Badge className="bg-green-600 hover:bg-green-700"><CheckCircle className="h-3 w-3 mr-1" /> Online</Badge>;
      case 'offline':
        return <Badge className="bg-red-600 hover:bg-red-700"><AlertCircle className="h-3 w-3 mr-1" /> Offline</Badge>;
      case 'maintenance':
        return <Badge className="bg-yellow-600 hover:bg-yellow-700"><Clock className="h-3 w-3 mr-1" /> Em Manutenção</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <div className="mb-12">
      {tools.length === 0 ? (
        <div className="text-center py-12 bg-zinc-900/50 rounded-lg border border-zinc-800">
          <p className="text-zinc-400">Nenhuma ferramenta encontrada nesta categoria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tools.map((tool) => (
            <Card 
              key={tool.id}
              className="bg-zinc-900/80 backdrop-blur-md border-zinc-800 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-[#A259FF]/10 hover:-translate-y-1"
            >
              <div 
                className="h-32 flex items-center justify-center relative" 
                style={{ 
                  backgroundColor: tool.bgColor || '#1A1A1A',
                  color: tool.textColor || 'white'
                }}
              >
                <img 
                  src={tool.logoImage} 
                  alt={tool.title} 
                  className="max-h-20 max-w-full object-contain"
                />
                <button 
                  className={`absolute top-2 right-2 text-white ${favorites.includes(tool.id) ? 'text-yellow-400' : 'hover:text-yellow-400'} transition-colors`}
                  onClick={() => toggleFavorite(tool.id, tool.title)}
                  title={favorites.includes(tool.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                >
                  <Star className={`h-5 w-5 ${favorites.includes(tool.id) ? 'fill-current' : ''}`} />
                </button>
              </div>
              
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold truncate">{tool.title}</h3>
                  {getStatusBadge(tool.status)}
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <Badge variant="outline" className="border-[#A259FF] text-[#A259FF]">
                    {tool.category}
                  </Badge>
                  
                  <Button 
                    size="sm" 
                    className="bg-[#A259FF] hover:bg-[#C084FC] text-xs px-3"
                    onClick={() => navigate(`/ferramenta/${tool.id}`)}
                  >
                    Acessar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ToolsSection;
