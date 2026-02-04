import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-rose px-4">
      <div className="text-center max-w-md">
        <h1 className="font-display text-8xl font-bold text-primary mb-4">404</h1>
        <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
          Página não encontrada
        </h2>
        <p className="text-muted-foreground mb-8">
          A página que você está procurando não existe ou foi movida para outro endereço.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="btn-gold">
            <Link to="/">
              <Home className="w-4 h-4 mr-2" />
              Ir para Home
            </Link>
          </Button>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
