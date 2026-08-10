export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
  stock: number;
  rating: number;
  hidden: boolean;
  promotion: boolean;
}

export const DESCONTO_PROMOCAO = 0.2;

export function precoComDesconto(product: Product): number {
  return product.promotion
    ? Math.round(product.price * (1 - DESCONTO_PROMOCAO) * 100) / 100
    : product.price;
}
