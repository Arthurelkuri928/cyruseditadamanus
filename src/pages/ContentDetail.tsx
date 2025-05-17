import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Copy, CheckCircle, AlertCircle, Clock, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useToolCredentials } from "@/hooks/use-tool-credentials";
import { useAuth } from "@/contexts/AuthContext";
import Footer from "@/components/member/Footer";
import { toolsData } from "./MemberArea";

const ContentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { getCredentials } = useToolCredentials();
  
  const [tool, setTool] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isFavorite, setIsFavorite] = useState(false);
  
  useEffect(() => {
    // Encontrar a ferramenta pelo ID
    const foundTool = toolsData.find(t => t.id.toString() === id);
    
    if (foundTool) {
      setTool(foundTool);
      
      // Verificar se a ferramenta está nos favoritos
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setIsFavorite(favorites.includes(foundTool.id));
    } else {
      // Ferramenta não encontrada, redirecionar para página 404
      navigate('/not-found');
    }
    
    setLoading(false);
  }, [id, navigate]);
  
  const handleCopyCredentials = () => {
    if (!user) return;
    
    const credentials = getCredentials(tool.id);
    navigator.clipboard.writeText(credentials);
    
    setCopied(true);
    toast({
      title: "Credenciais copiadas!",
      description: "As credenciais foram copiadas para sua área de transferência.",
    });
    
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };
  
  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (isFavorite) {
      // Remover dos favoritos
      const updatedFavorites = favorites.filter((favId: number) => favId !== tool.id);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      setIsFavorite(false);
      
      toast({
        title: "Removido dos favoritos",
        description: `${tool.title} foi removido dos seus favoritos.`,
      });
    } else {
      // Adicionar aos favoritos
      const updatedFavorites = [...favorites, tool.id];
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      setIsFavorite(true);
      
      toast({
        title: "Adicionado aos favoritos",
        description: `${tool.title} foi adicionado aos seus favoritos.`,
      });
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A259FF]"></div>
      </div>
    );
  }
  
  if (!tool) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Ferramenta não encontrada</h1>
        <p className="text-gray-400 mb-6">A ferramenta que você está procurando não existe ou foi removida.</p>
        <Button onClick={() => navigate('/area-membro')} className="bg-[#A259FF] hover:bg-[#C084FC]">
          Voltar para Área de Membros
        </Button>
      </div>
    );
  }
  
  const getStatusBadge = () => {
    switch (tool.status) {
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
    <div className="min-h-screen bg-black text-white">
      {/* Barra Lateral */}
      <Sidebar />
      
      {/* Conteúdo Principal */}
      <main className="md:ml-64 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Coluna da Esquerda - Imagem e Informações Básicas */}
            <div className="w-full md:w-1/3">
              <Card className="bg-zinc-900/80 backdrop-blur-md border-zinc-800 overflow-hidden">
                <div 
                  className="h-48 flex items-center justify-center" 
                  style={{ 
                    backgroundColor: tool.bgColor || '#1A1A1A',
                    color: tool.textColor || 'white'
                  }}
                >
                  <img 
                    src={tool.logoImage} 
                    alt={tool.title} 
                    className="max-h-32 max-w-full object-contain"
                  />
                </div>
                
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <Badge variant="outline" className="border-[#A259FF] text-[#A259FF]">
                      {tool.category}
                    </Badge>
                    {getStatusBadge()}
                  </div>
                  
                  <h1 className="text-2xl font-bold mb-2">{tool.title}</h1>
                  
                  <div className="mt-6 space-y-4">
                    <Button 
                      className={`w-full ${isFavorite ? 'bg-zinc-800 hover:bg-zinc-700 border border-[#A259FF]' : 'bg-[#A259FF] hover:bg-[#C084FC]'}`}
                      onClick={toggleFavorite}
                    >
                      {isFavorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
                    </Button>
                    
                    {tool.status === 'online' && (
                      <Button 
                        className="w-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center gap-2"
                        onClick={handleCopyCredentials}
                      >
                        {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copied ? 'Copiado!' : 'Copiar Credenciais'}
                      </Button>
                    )}
                    
                    <Button 
                      className="w-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center gap-2"
                      onClick={() => window.open(`https://${tool.title.toLowerCase().replace(/\s+/g, '')}.com`, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                      Acessar Site Oficial
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Coluna da Direita - Conteúdo Detalhado */}
            <div className="w-full md:w-2/3 mt-6 md:mt-0">
              <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="bg-zinc-900 border-b border-zinc-800 w-full justify-start rounded-none p-0">
                  <TabsTrigger 
                    value="overview" 
                    className={`px-6 py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#A259FF] data-[state=active]:text-white data-[state=active]:bg-transparent ${activeTab === 'overview' ? 'text-white' : 'text-gray-400'}`}
                  >
                    Visão Geral
                  </TabsTrigger>
                  <TabsTrigger 
                    value="tutorial" 
                    className={`px-6 py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#A259FF] data-[state=active]:text-white data-[state=active]:bg-transparent ${activeTab === 'tutorial' ? 'text-white' : 'text-gray-400'}`}
                  >
                    Tutorial
                  </TabsTrigger>
                  <TabsTrigger 
                    value="faq" 
                    className={`px-6 py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#A259FF] data-[state=active]:text-white data-[state=active]:bg-transparent ${activeTab === 'faq' ? 'text-white' : 'text-gray-400'}`}
                  >
                    FAQ
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="pt-6">
                  <Card className="bg-zinc-900/80 backdrop-blur-md border-zinc-800">
                    <CardHeader>
                      <CardTitle>Sobre {tool.title}</CardTitle>
                      <CardDescription className="text-gray-400">
                        Tudo o que você precisa saber sobre esta ferramenta
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Descrição</h3>
                        <p className="text-gray-300">
                          {tool.title} é uma ferramenta premium que oferece recursos avançados para profissionais da área de {tool.category.toLowerCase()}. 
                          Com uma interface intuitiva e recursos poderosos, esta ferramenta permite que você eleve seus projetos a um novo patamar.
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Recursos Principais</h3>
                        <ul className="list-disc pl-5 text-gray-300 space-y-1">
                          <li>Acesso completo a todos os recursos premium</li>
                          <li>Suporte a projetos de alta qualidade</li>
                          <li>Integração com outras ferramentas populares</li>
                          <li>Atualizações regulares com novos recursos</li>
                          <li>Sem marcas d'água ou limitações</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Como Usar</h3>
                        <ol className="list-decimal pl-5 text-gray-300 space-y-1">
                          <li>Copie as credenciais clicando no botão "Copiar Credenciais"</li>
                          <li>Acesse o site oficial da ferramenta</li>
                          <li>Faça login usando as credenciais fornecidas</li>
                          <li>Aproveite todos os recursos premium disponíveis</li>
                        </ol>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="border-t border-zinc-800 pt-4">
                      <p className="text-sm text-gray-400">
                        Última atualização: {new Date().toLocaleDateString()}
                      </p>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="tutorial" className="pt-6">
                  <Card className="bg-zinc-900/80 backdrop-blur-md border-zinc-800">
                    <CardHeader>
                      <CardTitle>Tutorial de {tool.title}</CardTitle>
                      <CardDescription className="text-gray-400">
                        Aprenda a utilizar esta ferramenta de forma eficiente
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-3">Primeiros Passos</h3>
                        <div className="rounded-lg overflow-hidden bg-zinc-800 p-4">
                          <p className="text-gray-300 mb-4">
                            Para começar a usar o {tool.title}, siga estas etapas iniciais:
                          </p>
                          <ol className="list-decimal pl-5 text-gray-300 space-y-2">
                            <li>Acesse o site oficial usando o botão "Acessar Site Oficial"</li>
                            <li>Na página de login, insira as credenciais que você copiou</li>
                            <li>Após o login, você terá acesso a todos os recursos premium</li>
                            <li>Explore a interface para se familiarizar com as funcionalidades</li>
                          </ol>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-3">Recursos Avançados</h3>
                        <div className="rounded-lg overflow-hidden bg-zinc-800 p-4">
                          <p className="text-gray-300 mb-4">
                            Depois de se familiarizar com os recursos básicos, experimente estas funcionalidades avançadas:
                          </p>
                          <ul className="list-disc pl-5 text-gray-300 space-y-2">
                            <li>Personalização de templates e configurações</li>
                            <li>Exportação em formatos de alta qualidade</li>
                            <li>Colaboração em tempo real com sua equipe</li>
                            <li>Automação de tarefas repetitivas</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-3">Vídeo Tutorial</h3>
                        <div className="rounded-lg overflow-hidden bg-zinc-800 aspect-video flex items-center justify-center">
                          <p className="text-gray-400">Vídeo tutorial em breve</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="faq" className="pt-6">
                  <Card className="bg-zinc-900/80 backdrop-blur-md border-zinc-800">
                    <CardHeader>
                      <CardTitle>Perguntas Frequentes</CardTitle>
                      <CardDescription className="text-gray-400">
                        Respostas para as dúvidas mais comuns sobre {tool.title}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="space-y-4">
                        <div className="border-b border-zinc-800 pb-4">
                          <h3 className="text-lg font-medium mb-2">As credenciais são compartilhadas?</h3>
                          <p className="text-gray-300">
                            Não, cada membro da CYRUS recebe credenciais exclusivas para acesso às ferramentas. 
                            É importante não compartilhar suas credenciais para manter a segurança da sua conta.
                          </p>
                        </div>
                        
                        <div className="border-b border-zinc-800 pb-4">
                          <h3 className="text-lg font-medium mb-2">O que fazer se as credenciais não funcionarem?</h3>
                          <p className="text-gray-300">
                            Se você encontrar problemas com as credenciais, tente copiar novamente. 
                            Se o problema persistir, entre em contato com nosso suporte através da seção de ajuda.
                          </p>
                        </div>
                        
                        <div className="border-b border-zinc-800 pb-4">
                          <h3 className="text-lg font-medium mb-2">Posso usar esta ferramenta em projetos comerciais?</h3>
                          <p className="text-gray-300">
                            Sim, você pode utilizar {tool.title} em projetos comerciais. 
                            Seu acesso premium através da CYRUS permite uso comercial completo.
                          </p>
                        </div>
                        
                        <div className="border-b border-zinc-800 pb-4">
                          <h3 className="text-lg font-medium mb-2">Com que frequência as credenciais são atualizadas?</h3>
                          <p className="text-gray-300">
                            As credenciais são atualizadas periodicamente para garantir segurança e disponibilidade. 
                            Você sempre terá acesso às credenciais mais recentes através da plataforma.
                          </p>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-2">Existe limite de uso para esta ferramenta?</h3>
                          <p className="text-gray-300">
                            Não há limites específicos impostos pela CYRUS, mas cada ferramenta pode ter suas próprias 
                            limitações de acordo com seus termos de serviço.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
        
        {/* Rodapé */}
        <Footer />
      </main>
    </div>
  );
};

export default ContentDetail;
