import { CartItem } from '../cart/cart-item';

export interface Sale {
  id: number;
  date: string;
  customerName: string;
  items: CartItem[];
  total: number;
}
