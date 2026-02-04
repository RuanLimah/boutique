// Product types for the perfume e-commerce

export type ProductCategory = 'floral' | 'doce' | 'amadeirado' | 'citrico';

export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  category: ProductCategory;
  image: string;
  stock: number;
  featured?: boolean;
  slug: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  total: number;
}

export const categoryLabels: Record<ProductCategory, string> = {
  floral: 'Florais',
  doce: 'Doces',
  amadeirado: 'Amadeirados',
  citrico: 'Cítricos',
};

export const categoryDescriptions: Record<ProductCategory, string> = {
  floral: 'Fragrâncias delicadas com notas de rosas, jasmim e lírios',
  doce: 'Aromas envolventes de baunilha, caramelo e frutas',
  amadeirado: 'Notas sofisticadas de sândalo, cedro e âmbar',
  citrico: 'Frescor vibrante de bergamota, limão e laranja',
};
