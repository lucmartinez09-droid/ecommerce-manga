import { Injectable, computed, inject, signal } from '@angular/core';
import { CartItem } from './cart-item';
import { Product, precoComDesconto } from '../products/product';
import { ProductService } from '../products/product-service';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly productService = inject(ProductService);
  private readonly storageKey = 'shogun-cart';
  private readonly itensCarrinho = signal<CartItem[]>(this.load());

  readonly itens = computed(() => this.itensCarrinho());

  readonly quantidadeTotal = computed(() =>
    this.itensCarrinho().reduce((soma, item) => soma + item.quantity, 0),
  );

  readonly totalBruto = computed(() =>
    this.itensCarrinho().reduce((soma, item) => soma + item.product.price * item.quantity, 0),
  );

  readonly totalDescontos = computed(() =>
    this.itensCarrinho().reduce(
      (soma, item) => soma + (item.product.price - precoComDesconto(item.product)) * item.quantity,
      0,
    ),
  );

  readonly totalCarrinho = computed(() => this.totalBruto() - this.totalDescontos());

  adicionar(product: Product): boolean {
    if (this.estoqueAtual(product) <= 0) return false;

    const item = this.encontrar(product.id);
    if (item) {
      this.atualizarQuantidade(product.id, 1);
    } else {
      this.itensCarrinho.update((itens) => [...itens, { product, quantity: 1 }]);
    }

    this.productService.diminuirEstoque(product.id, 1);
    this.save();
    return true;
  }

  aumentar(product: Product): boolean {
    if (this.estoqueAtual(product) <= 0) return false;

    const item = this.encontrar(product.id);
    if (!item) return false;

    this.atualizarQuantidade(product.id, 1);
    this.productService.diminuirEstoque(product.id, 1);
    this.save();
    return true;
  }

  diminuir(product: Product): void {
    const item = this.encontrar(product.id);
    if (!item || item.quantity <= 1) return;

    this.atualizarQuantidade(product.id, -1);
    this.productService.devolverEstoque(product.id, 1);
    this.save();
  }

  remover(productId: number): void {
    const item = this.encontrar(productId);
    if (!item) return;

    this.productService.devolverEstoque(productId, item.quantity);
    this.itensCarrinho.update((itens) => itens.filter((i) => i.product.id !== productId));
    this.save();
  }

  limpar(): void {
    for (const item of this.itensCarrinho()) {
      this.productService.devolverEstoque(item.product.id, item.quantity);
    }
    this.itensCarrinho.set([]);
    this.save();
  }

  finalizar(): void {
    this.itensCarrinho.set([]);
    this.save();
  }

  private estoqueAtual(product: Product): number {
    return this.productService.buscarPorId(product.id)?.stock ?? product.stock;
  }

  private encontrar(id: number): CartItem | undefined {
    return this.itensCarrinho().find((i) => i.product.id === id);
  }

  private atualizarQuantidade(id: number, delta: number): void {
    this.itensCarrinho.update((itens) =>
      itens.map((i) => (i.product.id === id ? { ...i, quantity: i.quantity + delta } : i)),
    );
  }

  private load(): CartItem[] {
    try {
      const salvo = localStorage.getItem(this.storageKey);
      if (salvo) return JSON.parse(salvo) as CartItem[];
    } catch {}
    return [];
  }

  private save(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.itensCarrinho()));
  }
}
