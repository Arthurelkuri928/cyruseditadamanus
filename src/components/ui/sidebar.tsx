import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Home, 
  Grid, 
  Star, 
  User, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight,
  UserCog
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import LanguageSelector from "@/components/member/LanguageSelector";
import { useMobile } from "@/hooks/use-mobile";

interface SidebarProps {
  onShowProfileDialog?: () => void;
}

export function Sidebar({ onShowProfileDialog }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const isMobile = useMobile();
  
  const [username, setUsername] = useState(() => {
    return user?.user_metadata?.username || localStorage.getItem("username") || "Usuário";
  });
  
  const [avatarUrl, setAvatarUrl] = useState(() => {
    const customAvatar = localStorage.getItem("customAvatar");
    if (customAvatar) {
      return customAvatar;
    }
    return localStorage.getItem("selectedAvatar") || "";
  });
  
  const handleLogout = async () => {
    await signOut();
  };
  
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  
  const closeSidebar = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };
  
  const navItems = [
    {
      title: "Início",
      icon: <Home className="h-5 w-5" />,
      href: "/area-membro",
    },
    {
      title: "Ferramentas",
      icon: <Grid className="h-5 w-5" />,
      href: "/ferramentas",
    },
    {
      title: "Favoritos",
      icon: <Star className="h-5 w-5" />,
      href: "/favoritos",
    },
    {
      title: "Perfil",
      icon: <User className="h-5 w-5" />,
      href: "/perfil",
    },
  ];
  
  return (
    <>
      {/* Mobile Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden bg-zinc-900/80 backdrop-blur-md border border-zinc-800 text-white"
        onClick={toggleSidebar}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>
      
      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-zinc-900/80 backdrop-blur-md border-r border-zinc-800 transition-transform duration-300 ease-in-out",
          isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-zinc-800">
            <Link to="/area-membro" className="flex items-center" onClick={closeSidebar}>
              <span className="text-[#A259FF] text-2xl font-bold tracking-wider">CYRUS</span>
            </Link>
          </div>
          
          {/* Navigation */}
          <ScrollArea className="flex-1 py-4">
            <nav className="px-2 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={closeSidebar}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md text-sm font-medium group transition-all",
                    location.pathname === item.href
                      ? "bg-[#A259FF]/20 text-white"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                  )}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.title}</span>
                  {location.pathname === item.href && (
                    <ChevronRight className="ml-auto h-4 w-4" />
                  )}
                </Link>
              ))}
            </nav>
          </ScrollArea>
          
          {/* User Section */}
          <div className="p-4 border-t border-zinc-800">
            <div className="flex items-center justify-between mb-4">
              <LanguageSelector />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="w-full bg-zinc-800 hover:bg-zinc-700 text-white justify-start"
                >
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={avatarUrl} alt={username} />
                    <AvatarFallback className="bg-zinc-700 text-white">
                      {username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate">{username}</span>
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent className="bg-zinc-900 border-zinc-800 text-white">
                <DropdownMenuItem 
                  className="hover:bg-zinc-800 cursor-pointer"
                  onClick={() => {
                    navigate("/perfil");
                    closeSidebar();
                  }}
                >
                  <UserCog className="mr-2 h-4 w-4" />
                  <span>Editar Perfil</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator className="bg-zinc-800" />
                
                <DropdownMenuItem 
                  className="hover:bg-zinc-800 text-red-400 hover:text-red-300 cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair da Conta</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </>
  );
}
