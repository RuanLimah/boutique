import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/product/ProductCard';
import { useProducts, ProductFilters } from '@/context/ProductContext';
import { categoryLabels, ProductCategory } from '@/types/product';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

const ProductsPage: React.FC = () => {
  const { filterProducts, products } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Get initial filters from URL
  const initialCategory = searchParams.get('categoria') as ProductCategory | 'all' | null;
  
  const [filters, setFilters] = useState<ProductFilters>({
    category: initialCategory || 'all',
    search: '',
    sortBy: 'newest',
    minPrice: 0,
    maxPrice: 500,
  });

  // Calculate price range from products
  const priceRange = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 500 };
    const prices = products.map(p => p.price);
    return { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) };
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return filterProducts(filters);
  }, [filters, filterProducts]);

  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    
    // Update URL for category
    if (key === 'category') {
      if (value && value !== 'all') {
        setSearchParams({ categoria: value });
      } else {
        setSearchParams({});
      }
    }
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      search: '',
      sortBy: 'newest',
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
    });
    setSearchParams({});
  };

  const categories = Object.entries(categoryLabels) as [ProductCategory, string][];

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Categoria</Label>
        <Select
          value={filters.category || 'all'}
          onValueChange={(value) => handleFilterChange('category', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todas as categorias" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {categories.map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div>
        <Label className="text-sm font-medium mb-4 block">
          Preço: R$ {filters.minPrice?.toFixed(0)} - R$ {filters.maxPrice?.toFixed(0)}
        </Label>
        <Slider
          value={[filters.minPrice || priceRange.min, filters.maxPrice || priceRange.max]}
          min={priceRange.min}
          max={priceRange.max}
          step={10}
          onValueChange={([min, max]) => {
            handleFilterChange('minPrice', min);
            handleFilterChange('maxPrice', max);
          }}
          className="mt-2"
        />
      </div>

      {/* Sort */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Ordenar por</Label>
        <Select
          value={filters.sortBy || 'newest'}
          onValueChange={(value: ProductFilters['sortBy']) => handleFilterChange('sortBy', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Mais recentes</SelectItem>
            <SelectItem value="price-asc">Menor preço</SelectItem>
            <SelectItem value="price-desc">Maior preço</SelectItem>
            <SelectItem value="name">Nome A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={clearFilters}
      >
        Limpar filtros
      </Button>
    </div>
  );

  return (
    <Layout
      title="Produtos - Essência Feminina | Perfumes e Essências Femininas"
      description="Explore nossa coleção completa de perfumes e essências femininas. Fragrâncias florais, doces, amadeiradas e cítricas para todos os estilos."
    >
      {/* Header */}
      <div className="bg-gradient-rose py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-center text-foreground">
            Nossa Coleção
          </h1>
          <p className="text-muted-foreground text-center mt-3 max-w-2xl mx-auto">
            Fragrâncias exclusivas criadas para mulheres que buscam elegância e sofisticação
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar perfumes..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Desktop Filters */}
          <div className="hidden md:flex gap-4">
            <Select
              value={filters.category || 'all'}
              onValueChange={(value) => handleFilterChange('category', value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {categories.map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.sortBy || 'newest'}
              onValueChange={(value: ProductFilters['sortBy']) => handleFilterChange('sortBy', value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Mais recentes</SelectItem>
                <SelectItem value="price-asc">Menor preço</SelectItem>
                <SelectItem value="price-desc">Maior preço</SelectItem>
                <SelectItem value="name">Nome A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Mobile Filter Button */}
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" className="gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                Filtros
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <SheetHeader>
                <SheetTitle>Filtros</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FilterContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Results Count */}
        <p className="text-sm text-muted-foreground mb-6">
          {filteredProducts.length} {filteredProducts.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
        </p>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              Nenhum produto encontrado com os filtros selecionados.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={clearFilters}
            >
              Limpar filtros
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductsPage;
