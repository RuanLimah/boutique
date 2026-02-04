import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';

// Import product images
import floralImg from '@/assets/perfume-floral.jpg';
import vanillaImg from '@/assets/perfume-vanilla.jpg';
import citrusImg from '@/assets/perfume-citrus.jpg';
import woodyImg from '@/assets/perfume-woody.jpg';

const categoryImages: Record<string, string> = {
  floral: floralImg,
  doce: vanillaImg,
  citrico: citrusImg,
  amadeirado: woodyImg,
};

const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();

  if (cart.items.length === 0) {
    return (
      <Layout title="Carrinho - Essência Feminina">
        <div className="container mx-auto px-4 py-16 text-center">
          <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-6" />
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">
            Seu carrinho está vazio
          </h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Descubra nossas fragrâncias exclusivas e adicione seus produtos favoritos ao carrinho.
          </p>
          <Button asChild size="lg" className="btn-gold">
            <Link to="/produtos">
              Explorar produtos
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Carrinho - Essência Feminina">
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-8">
          Meu Carrinho
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => {
              const productImage = categoryImages[item.product.category] || floralImg;
              
              return (
                <div
                  key={item.product.id}
                  className="flex gap-4 p-4 bg-card rounded-xl shadow-sm"
                >
                  {/* Image */}
                  <Link 
                    to={`/produto/${item.product.slug}`}
                    className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-secondary/30"
                  >
                    <img
                      src={productImage}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 flex flex-col">
                    <Link 
                      to={`/produto/${item.product.slug}`}
                      className="font-display text-lg font-semibold text-foreground hover:text-primary transition-colors"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {item.product.shortDescription}
                    </p>
                    
                    <div className="mt-auto flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>

                      {/* Price & Remove */}
                      <div className="flex items-center gap-4">
                        <span className="font-semibold text-foreground">
                          R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => removeFromCart(item.product.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-destructive"
              onClick={clearCart}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Limpar carrinho
            </Button>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="font-display text-xl font-semibold mb-6">
                Resumo do Pedido
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal ({cart.items.length} {cart.items.length === 1 ? 'item' : 'itens'})</span>
                  <span>R$ {cart.total.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Frete</span>
                  <span className="text-green-600">Grátis</span>
                </div>
              </div>

              <div className="border-t border-border pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg">Total</span>
                  <span className="font-bold text-xl">
                    R$ {cart.total.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  ou 3x de R$ {(cart.total / 3).toFixed(2).replace('.', ',')} sem juros
                </p>
              </div>

              <Button asChild size="lg" className="w-full btn-gold">
                <Link to="/checkout">
                  Finalizar compra
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>

              <Link
                to="/produtos"
                className="block text-center text-sm text-muted-foreground hover:text-foreground mt-4 transition-colors"
              >
                Continuar comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
