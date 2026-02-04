import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, ProductCategory } from '@/types/product';
import { initialProducts, generateSlug } from '@/data/products';
import { toast } from 'sonner';

// Context type
interface ProductContextType {
  products: Product[];
  getProduct: (id: string) => Product | undefined;
  getProductBySlug: (slug: string) => Product | undefined;
  getProductsByCategory: (category: ProductCategory) => Product[];
  getFeaturedProducts: () => Product[];
  addProduct: (product: Omit<Product, 'id' | 'slug'>) => void;
  updateProduct: (id: string, updates: Partial<Omit<Product, 'id' | 'slug'>>) => void;
  deleteProduct: (id: string) => void;
  searchProducts: (query: string) => Product[];
  filterProducts: (filters: ProductFilters) => Product[];
}

export interface ProductFilters {
  category?: ProductCategory | 'all';
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: 'price-asc' | 'price-desc' | 'name' | 'newest';
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Storage key
const PRODUCTS_STORAGE_KEY = 'essencia-feminina-products';

// Provider
export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  // Load products from localStorage on mount
  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      } else {
        setProducts(initialProducts);
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(initialProducts));
      }
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts(initialProducts);
    }
  }, []);

  // Save products to localStorage on change
  useEffect(() => {
    if (products.length > 0) {
      try {
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
      } catch (error) {
        console.error('Error saving products:', error);
      }
    }
  }, [products]);

  const getProduct = (id: string): Product | undefined => {
    return products.find((p) => p.id === id);
  };

  const getProductBySlug = (slug: string): Product | undefined => {
    return products.find((p) => p.slug === slug);
  };

  const getProductsByCategory = (category: ProductCategory): Product[] => {
    return products.filter((p) => p.category === category);
  };

  const getFeaturedProducts = (): Product[] => {
    return products.filter((p) => p.featured);
  };

  const addProduct = (productData: Omit<Product, 'id' | 'slug'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      slug: generateSlug(productData.name),
    };

    setProducts((prev) => [...prev, newProduct]);
    toast.success('Produto adicionado com sucesso!');
  };

  const updateProduct = (id: string, updates: Partial<Omit<Product, 'id' | 'slug'>>) => {
    setProducts((prev) =>
      prev.map((product) => {
        if (product.id === id) {
          const updated = { ...product, ...updates };
          // Update slug if name changed
          if (updates.name) {
            updated.slug = generateSlug(updates.name);
          }
          return updated;
        }
        return product;
      })
    );
    toast.success('Produto atualizado com sucesso!');
  };

  const deleteProduct = (id: string) => {
    const product = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (product) {
      toast.info(`${product.name} foi removido`);
    }
  };

  const searchProducts = (query: string): Product[] => {
    const lowerQuery = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery) ||
        p.shortDescription.toLowerCase().includes(lowerQuery)
    );
  };

  const filterProducts = (filters: ProductFilters): Product[] => {
    let filtered = [...products];

    // Category filter
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter((p) => p.category === filters.category);
    }

    // Price filters
    if (filters.minPrice !== undefined) {
      filtered = filtered.filter((p) => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter((p) => p.price <= filters.maxPrice!);
    }

    // Search filter
    if (filters.search) {
      const lowerSearch = filters.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerSearch) ||
          p.shortDescription.toLowerCase().includes(lowerSearch)
      );
    }

    // Sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price-asc':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'name':
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'newest':
          filtered.sort((a, b) => parseInt(b.id) - parseInt(a.id));
          break;
      }
    }

    return filtered;
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        getProduct,
        getProductBySlug,
        getProductsByCategory,
        getFeaturedProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        searchProducts,
        filterProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

// Hook
export const useProducts = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
