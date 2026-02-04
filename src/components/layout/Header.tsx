import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Heart, User, Search } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';

const Header: React.FC = () => {
  const { itemCount } = useCart();
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/produtos', label: 'Produtos' },
    { href: '/admin', label: 'Admin' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="font-display text-2xl md:text-3xl font-semibold text-foreground group-hover:text-primary transition-colors">
              Essência
            </span>
            <span className="font-display text-lg md:text-xl text-primary italic">Feminina</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`relative font-medium text-sm tracking-wide transition-colors link-underline ${
                  isActive(link.href)
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Cart */}
            <Link to="/carrinho" className="relative p-2 hover:bg-muted rounded-full transition-colors">
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <Badge 
                  className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs bg-primary text-primary-foreground"
                >
                  {itemCount}
                </Badge>
              )}
            </Link>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] bg-background">
                <div className="flex flex-col gap-6 mt-8">
                  <Link to="/" className="flex items-center gap-2">
                    <span className="font-display text-xl font-semibold">Essência</span>
                    <span className="font-display text-lg text-primary italic">Feminina</span>
                  </Link>
                  <nav className="flex flex-col gap-4">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        to={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`font-medium text-lg transition-colors ${
                          isActive(link.href)
                            ? 'text-primary'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
