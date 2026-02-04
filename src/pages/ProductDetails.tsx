import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Minus, Plus, Check, Package } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/product/ProductCard';
import { useProducts } from '@/context/ProductContext';
import { useCart } from '@/context/CartContext';
import { categoryLabels } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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

const ProductDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { getProductBySlug, getProductsByCategory } = useProducts();
  const { addToCart, getItemQuantity, updateQuantity, removeFromCart } = useCart();
  
  const product = getProductBySlug(slug || '');
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <Layout title="Produto não encontrado - Essência Feminina">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">
            Produto não encontrado
          </h1>
          <p className="text-muted-foreground mb-6">
            O produto que você procura não existe ou foi removido.
          </p>
          <Button asChild>
            <Link to="/produtos">Ver todos os produtos</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const productImage = categoryImages[product.category] || floralImg;
  const quantityInCart = getItemQuantity(product.id);
  const relatedProducts = getProductsByCategory(product.category)
    .filter(p => p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setQuantity(1);
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, Math.min(prev + delta, product.stock)));
  };

  return (
    <Layout
      title={`${product.name} - Essência Feminina | Perfume Feminino ${categoryLabels[product.category]}`}
      description={product.description}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <Link to="/produtos" className="hover:text-foreground transition-colors">Produtos</Link>
          <span>/</span>
          <Link 
            to={`/produtos?categoria=${product.category}`} 
            className="hover:text-foreground transition-colors"
          >
            {categoryLabels[product.category]}
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-secondary/30">
            <img
              src={productImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.featured && (
              <Badge className="absolute top-4 left-4 bg-gold text-white border-0">
                Destaque
              </Badge>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <Badge variant="secondary" className="w-fit mb-4">
              {categoryLabels[product.category]}
            </Badge>
            
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              {product.name}
            </h1>
            
            <p className="mt-4 text-xl text-muted-foreground">
              {product.shortDescription}
            </p>

            <div className="mt-6">
              <span className="text-3xl font-bold text-foreground">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </span>
              <span className="ml-2 text-sm text-muted-foreground">
                ou 3x de R$ {(product.price / 3).toFixed(2).replace('.', ',')}
              </span>
            </div>

            {/* Stock */}
            <div className="mt-6 flex items-center gap-2">
              <Package className="w-4 h-4 text-muted-foreground" />
              {product.stock > 10 ? (
                <span className="text-sm text-green-600">Em estoque</span>
              ) : product.stock > 0 ? (
                <span className="text-sm text-amber-600">Últimas {product.stock} unidades</span>
              ) : (
                <span className="text-sm text-destructive">Esgotado</span>
              )}
            </div>

            {/* Quantity & Add to Cart */}
            {product.stock > 0 && (
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">Quantidade:</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="flex-1 btn-gold gap-2"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Adicionar ao carrinho
                  </Button>
                  {quantityInCart > 0 && (
                    <Button
                      variant="outline"
                      size="lg"
                      asChild
                      className="btn-outline-rose"
                    >
                      <Link to="/carrinho">
                        Ver carrinho ({quantityInCart})
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="mt-10 pt-8 border-t border-border">
              <h2 className="font-display text-xl font-semibold mb-4">Descrição</h2>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Features */}
            <div className="mt-8">
              <h3 className="font-medium mb-4">Características:</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Check className="w-4 h-4 text-primary" />
                  Alta fixação
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Check className="w-4 h-4 text-primary" />
                  Fragrância {categoryLabels[product.category].toLowerCase()}
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Check className="w-4 h-4 text-primary" />
                  Embalagem premium
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 pt-16 border-t border-border">
            <h2 className="font-display text-2xl font-bold text-foreground mb-8">
              Você também pode gostar
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetailsPage;
