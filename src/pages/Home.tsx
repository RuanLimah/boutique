import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Sparkles, Flower2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/product/ProductCard';
import { useProducts } from '@/context/ProductContext';
import { categoryLabels, categoryDescriptions, ProductCategory } from '@/types/product';
import { Button } from '@/components/ui/button';

// Import images
import heroBanner from '@/assets/hero-banner.jpg';
import floralImg from '@/assets/perfume-floral.jpg';
import vanillaImg from '@/assets/perfume-vanilla.jpg';
import citrusImg from '@/assets/perfume-citrus.jpg';
import woodyImg from '@/assets/perfume-woody.jpg';

const categoryImages: Record<ProductCategory, string> = {
  floral: floralImg,
  doce: vanillaImg,
  citrico: citrusImg,
  amadeirado: woodyImg,
};

const testimonials = [
  {
    name: 'Maria Clara',
    text: 'Os perfumes são simplesmente divinos! A qualidade é excepcional e a fixação é incrível. Recomendo demais!',
    rating: 5,
  },
  {
    name: 'Ana Beatriz',
    text: 'Encontrei minha fragrância perfeita aqui. O atendimento é impecável e a entrega super rápida.',
    rating: 5,
  },
  {
    name: 'Juliana Santos',
    text: 'Fragrâncias sofisticadas que recebo elogios toda vez que uso. Já virei cliente fiel!',
    rating: 5,
  },
];

const HomePage: React.FC = () => {
  const { getFeaturedProducts, products } = useProducts();
  const featuredProducts = getFeaturedProducts().slice(0, 4);
  const categories = Object.entries(categoryLabels) as [ProductCategory, string][];

  return (
    <Layout
      title="Essência Feminina - Perfumes e Essências Exclusivas para Mulheres"
      description="Descubra fragrâncias exclusivas e sofisticadas. Perfumes femininos florais, doces, amadeirados e cítricos. Qualidade premium e elegância em cada gota."
    >
      {/* Hero Section */}
      <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBanner})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl animate-fade-up">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Descubra sua{' '}
              <span className="text-gradient-gold">essência</span>{' '}
              perfeita
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed">
              Fragrâncias exclusivas que expressam sua personalidade única. 
              Elegância, sofisticação e feminilidade em cada gota.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="btn-gold text-base px-8">
                <Link to="/produtos">
                  Conheça nossas fragrâncias
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="btn-outline-rose text-base px-8">
                <Link to="/produtos?categoria=floral">
                  Coleção Floral
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-padding bg-gradient-rose">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-up">
            <span className="inline-flex items-center gap-2 text-primary font-medium text-sm uppercase tracking-wider mb-3">
              <Sparkles className="w-4 h-4" />
              Destaques
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Fragrâncias em Destaque
            </h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              Nossas criações mais desejadas, escolhidas especialmente para você
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <div 
                key={product.id} 
                className="animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button asChild variant="outline" size="lg" className="btn-outline-rose">
              <Link to="/produtos">
                Ver todos os produtos
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section-padding">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-primary font-medium text-sm uppercase tracking-wider mb-3">
              <Flower2 className="w-4 h-4" />
              Categorias
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Explore por Família Olfativa
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map(([category, label], index) => (
              <Link
                key={category}
                to={`/produtos?categoria=${category}`}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden hover-lift animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <img
                  src={categoryImages[category]}
                  alt={label}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="font-display text-2xl font-semibold mb-2">{label}</h3>
                  <p className="text-white/80 text-sm line-clamp-2">
                    {categoryDescriptions[category]}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-primary font-medium text-sm uppercase tracking-wider mb-3">
              <Star className="w-4 h-4 fill-current" />
              Depoimentos
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              O que nossas clientes dizem
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-card p-6 rounded-2xl shadow-elegant animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  "{testimonial.text}"
                </p>
                <p className="font-semibold text-foreground">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-r from-primary/10 to-gold/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Pronta para encontrar sua fragrância?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Explore nossa coleção completa e descubra o perfume que combina perfeitamente com você
          </p>
          <Button asChild size="lg" className="btn-gold text-base px-10">
            <Link to="/produtos">
              Explorar coleção
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
