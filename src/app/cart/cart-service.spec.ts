import { TestBed } from '@angular/core/testing';
import { CartService } from './cart-service';
import { ProductService } from '../products/product-service';
import { Product } from '../products/product';

describe('CartService', () => {
  let cartService: CartService;
  let productService: ProductService;
  let produto: Product;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    cartService = TestBed.inject(CartService);
    productService = TestBed.inject(ProductService);

    productService.criar({
      name: 'Mangá de Teste',
      description: 'Descrição com mais de vinte caracteres.',
      category: 'Teste',
      price: 10,
      image: 'i.png',
      stock: 2,
      rating: 0,
      hidden: false,
      promotion: false,
    });
    produto = productService.todos()[productService.todos().length - 1];
  });

  it('should be created', () => {
    expect(cartService).toBeTruthy();
  });

  it('should allow buying the entire stock, one by one', () => {
    expect(cartService.adicionar(produto)).toBe(true);
    expect(cartService.adicionar(produto)).toBe(true);
    expect(cartService.quantidadeTotal()).toBe(2);
  });

  it('should block only when the stock reaches zero', () => {
    cartService.adicionar(produto);
    cartService.adicionar(produto);
    expect(cartService.adicionar(produto)).toBe(false); // estoque 0 → bloqueia
    expect(cartService.quantidadeTotal()).toBe(2);
  });

  it('should return the stock when removing from cart', () => {
    cartService.adicionar(produto);
    cartService.remover(produto.id);
    expect(cartService.quantidadeTotal()).toBe(0);
    expect(productService.buscarPorId(produto.id)?.stock).toBe(2);
  });

  it('should calculate promotion discounts', () => {
    productService.criar({
      name: 'Mangá Promo',
      description: 'Descrição com mais de vinte caracteres.',
      category: 'Teste',
      price: 10,
      image: 'i.png',
      stock: 5,
      rating: 0,
      hidden: false,
      promotion: true,
    });
    const promo = productService.todos()[productService.todos().length - 1];

    cartService.adicionar(promo);
    expect(cartService.totalBruto()).toBe(10);
    expect(cartService.totalDescontos()).toBe(2);
    expect(cartService.totalCarrinho()).toBe(8);
  });
});
