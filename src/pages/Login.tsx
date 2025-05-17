import { useState, useEffect } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, User, Lock, Shield, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [appearAnimation, setAppearAnimation] = useState(false);
  const { signIn, user, loading } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    // Trigger appearance animation after component mount
    setTimeout(() => {
      setAppearAnimation(true);
    }, 100);
  }, []);
  
  const validateEmail = (email: string) => {
    if (!email) {
      setEmailError("Email é obrigatório");
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Email inválido");
      return false;
    }
    setEmailError("");
    return true;
  };
  
  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError("Senha é obrigatória");
      return false;
    } else if (password.length < 6) {
      setPasswordError("Senha deve ter pelo menos 6 caracteres");
      return false;
    }
    setPasswordError("");
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    
    if (!isEmailValid || !isPasswordValid) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await signIn(email, password);
      if (!result.success) {
        setLoginError(result.error || "Falha na autenticação. Verifique suas credenciais.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Redirecionamento se o usuário já estiver autenticado
  if (user && !loading) {
    // Verifica se há um estado de redirecionamento
    const from = location.state?.from || "/area-membro";
    return <Navigate to={from} replace />;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0D0D0D] to-[#1A1A1A] flex flex-col items-center justify-center p-4">
      <div 
        className={`mb-8 text-center transition-all duration-700 transform ${
          appearAnimation ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        <h1 className="text-[#A259FF] text-5xl font-bold tracking-wider uppercase mb-2">CYRUS</h1>
        <p className="text-white/50 text-lg">Sua Central de Pagamentos Unificada</p>
      </div>

      <div 
        className={`w-full max-w-md bg-[#0D0D0D]/80 backdrop-blur-sm rounded-xl shadow-lg border border-[#A259FF]/10 overflow-hidden transition-all duration-700 transform ${
          appearAnimation ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
        style={{
          boxShadow: "0 10px 30px rgba(162, 89, 255, 0.15)"
        }}
      >
        <div className="p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">
            Acesse sua conta na CYRUS
          </h2>
          
          {loginError && (
            <Alert variant="destructive" className="mb-6 bg-red-900/30 border-red-800 text-white">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {loginError}
              </AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div className="space-y-1">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 group-focus-within:text-[#A259FF] transition-colors">
                    <User className="w-5 h-5" />
                  </div>
                  <Input 
                    type="email" 
                    placeholder="Email de usuário" 
                    className={`bg-[#1A1A1A] border ${emailError ? 'border-red-500' : 'border-gray-700 focus:border-[#A259FF]'} text-white pl-10 h-12 transition-all duration-300 focus:shadow-[0_0_0_1px_rgba(162,89,255,0.3)]`}
                    value={email} 
                    onChange={e => {
                      setEmail(e.target.value);
                      if (e.target.value) validateEmail(e.target.value);
                    }}
                  />
                </div>
                {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
              </div>
              
              <div className="space-y-1">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 group-focus-within:text-[#A259FF] transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Sua senha" 
                    className={`bg-[#1A1A1A] border ${passwordError ? 'border-red-500' : 'border-gray-700 focus:border-[#A259FF]'} text-white pl-10 h-12 transition-all duration-300 focus:shadow-[0_0_0_1px_rgba(162,89,255,0.3)]`}
                    value={password} 
                    onChange={e => {
                      setPassword(e.target.value);
                      if (e.target.value) validatePassword(e.target.value);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-[#A259FF] hover:bg-[#C084FC] text-white font-bold py-6 h-12 rounded-lg transition-all duration-300 transform hover:-translate-y-[2px] hover:shadow-[0_5px_15px_rgba(162,89,255,0.4)]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Autenticando...
                  </div>
                ) : "Entrar"}
              </Button>
            </div>
          </form>
          
          <div className="flex items-center justify-center mt-6 text-gray-400 text-sm">
            <Shield className="w-4 h-4 mr-2 text-gray-500" />
            <span>Seus dados estão protegidos com criptografia de ponta.</span>
          </div>
        </div>
        
        <div className="bg-[#141414] p-6 border-t border-gray-800">
          <div className="text-center">
            <p className="text-gray-400 mb-2">Ainda não possui uma conta?</p>
            <a 
              href="https://checkout.cyrus.com.br" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#A259FF] hover:text-[#C084FC] hover:underline font-medium transition-all"
            >
              Realizar Minha Inscrição
            </a>
          </div>
        </div>
      </div>
      
      <div 
        className={`mt-8 text-center text-xs text-gray-500 max-w-md transition-all duration-700 transform ${
          appearAnimation ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
        style={{ transitionDelay: '200ms' }}
      >
        <p>Este site está protegido com a tecnologia reCaptcha do Google.</p>
        <p>Todos os seus dados estão seguros e criptografados.</p>
        <p className="mt-2">
          <a href="#" className="text-gray-500 hover:text-[#A259FF] transition-colors">Termos de Uso</a>
          {" e "}
          <a href="#" className="text-gray-500 hover:text-[#A259FF] transition-colors">Políticas de Privacidade</a>.
        </p>
      </div>
    </div>
  );
};

export default Login;
