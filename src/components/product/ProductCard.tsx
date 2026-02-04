import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { Product, categoryLabels } from '@/types/product';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Import product images
import floralImg from '@/assets/perfume-floral.jpg';
import vanillaImg from '@/assets/perfume-vanilla.jpg';
import citrusImg from '@/assets/perfume-citrus.jpg';
import woodyImg from '@/assets/perfume-woody.jpg';

interface ProductCardProps {
  product: Product;
}

// Map categories to images
const categoryImages: Record<string, string> = {
  floral: floralImg,
  doce: vanillaImg,
  citrico: citrusImg,
  amadeirado: woodyImg,
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, getItemQuantity } = useCart();
  const quantityInCart = getItemQuantity(product.id);

  const productImage = categoryImages[product.category] || floralImg;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <Link
      to={`/produto/${product.slug}`}
      className="group card-product flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-secondary/30">
        <img
          src={productImage}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.featured && (
            <Badge className="bg-gold text-white border-0">
              Destaque
            </Badge>
          )}
          <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
            {categoryLabels[product.category]}
          </Badge>
        </div>

        {/* Quick Add Button */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <Button
            onClick={handleAddToCart}
            className="w-full btn-primary shadow-elegant gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            {quantityInCart > 0 ? `No carrinho (${quantityInCart})` : 'Adicionar'}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="text-muted-foreground text-sm mt-1 line-clamp-2 flex-1">
          {product.shortDescription}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-semibold text-lg text-foreground">
            R$ {product.price.toFixed(2).replace('.', ',')}
          </span>
          {product.stock <= 5 && product.stock > 0 && (
            <span className="text-xs text-destructive">
              Últimas {product.stock} unidades
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
