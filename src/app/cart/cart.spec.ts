import { TestBed } from '@angular/core/testing';
import { CartService } from './cart-service';
import { Product } from '../products/product';

describe('CartService', () => {
  let service: CartService;

  const mockProduct: Product = {
    id: 1,
    name: 'Naruto',
    description: 'teste',
    price: 10,
    image: 'i.png',
    stock: 5,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add, count, total and remove items', () => {
    service.adicionaCart(mockProduct);
    expect(service.quantidadeTotal()).toBe(1);
    expect(service.totalCarrinho()).toBe(10);

    service.removerDoCarrinho(0);
    expect(service.quantidadeTotal()).toBe(0);
    expect(service.totalCarrinho()).toBe(0);
  });
});
