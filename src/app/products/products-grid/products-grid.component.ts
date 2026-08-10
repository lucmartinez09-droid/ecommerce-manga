import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ProductCardComponent } from '../product-card/product-card.component';
import { Product } from '../product';
import { CartService } from '../../cart/cart-service';
import { ProductService } from '../product-service';

export type Ordenacao = 'relevancia' | 'menor-preco' | 'maior-preco' | 'avaliacao';

@Component({
  selector: 'app-products-grid',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatSnackBarModule,
    ProductCardComponent,
  ],
  templateUrl: './products-grid.component.html',
  styleUrl: './products-grid.component.css',
})
export class ProductsGridComponent {
  private readonly cartService = inject(CartService);
  private readonly productService = inject(ProductService);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly pesquisaDigitada = signal('');
  protected readonly ordenacao = signal<Ordenacao>('relevancia');

  protected readonly produtosFiltrados = computed(() => {
    const pesquisa = this.pesquisaDigitada().toLocaleLowerCase().trim();

    let lista = this.productService
      .visiveis()
      .filter(
        (product) =>
          !pesquisa ||
          product.name.toLocaleLowerCase().includes(pesquisa) ||
          product.description.toLocaleLowerCase().includes(pesquisa),
      );

    switch (this.ordenacao()) {
      case 'menor-preco':
        lista = [...lista].sort((a, b) => a.price - b.price);
        break;
      case 'maior-preco':
        lista = [...lista].sort((a, b) => b.price - a.price);
        break;
      case 'avaliacao':
        lista = [...lista].sort((a, b) => b.rating - a.rating);
        break;
    }

    return lista;
  });

  protected aoAdicionarCarrinho(product: Product): void {
    const sucesso = this.cartService.adicionar(product);
    if (!sucesso) {
      this.snackBar.open(`Estoque insuficiente de "${product.name}".`, 'Fechar', {
        duration: 3000,
      });
    }
  }

  protected aoNotificarEsgotado(product: Product): void {
    this.snackBar.open(`Avisaremos quando "${product.name}" voltar ao estoque!`, 'Fechar', {
      duration: 3000,
    });
  }
}
