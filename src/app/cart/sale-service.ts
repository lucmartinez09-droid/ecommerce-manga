import { Injectable, computed, signal } from '@angular/core';
import { CartItem } from './cart-item';

export interface Sale {
  id: number;
  date: string;
  customerName: string;
  items: CartItem[];
  total: number;
}

@Injectable({
  providedIn: 'root',
})
export class SaleService {
  // 👈 o "export" aqui é o que resolve o TS2305
  private readonly storageKey = 'shogun-sales';
  private readonly vendas = signal<Sale[]>(this.load());

  readonly todas = computed(() => this.vendas());

  readonly receitaTotal = computed(() =>
    this.vendas().reduce((soma, venda) => soma + venda.total, 0),
  );

  readonly totalProdutosVendidos = computed(() =>
    this.vendas().reduce(
      (soma, venda) => soma + venda.items.reduce((acc, item) => acc + item.quantity, 0),
      0,
    ),
  );

  readonly produtoMaisVendido = computed(() => {
    const porNome = new Map<string, number>();

    for (const venda of this.vendas()) {
      for (const item of venda.items) {
        porNome.set(item.product.name, (porNome.get(item.product.name) ?? 0) + item.quantity);
      }
    }

    let nome: string | null = null;
    let recorde = 0;

    for (const [n, quantidade] of porNome) {
      if (quantidade > recorde) {
        recorde = quantidade;
        nome = n;
      }
    }

    return nome;
  });

  registrarVenda(dados: { customerName: string; items: CartItem[]; total: number }): void {
    const venda: Sale = {
      id: this.vendas().length + 1,
      date: new Date().toISOString(),
      ...dados,
    };

    this.vendas.update((vendas) => [...vendas, venda]);
    localStorage.setItem(this.storageKey, JSON.stringify(this.vendas()));
  }

  private load(): Sale[] {
    try {
      const salvo = localStorage.getItem(this.storageKey);
      if (salvo) return JSON.parse(salvo) as Sale[];
    } catch {
      /* primeiro acesso */
    }
    return [];
  }
}
