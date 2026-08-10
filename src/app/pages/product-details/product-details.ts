import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ProductService } from '../../products/product-service';
import { CartService } from '../../cart/cart-service';
import { Product, precoComDesconto } from '../../products/product';

@Component({
  selector: 'app-product-details',
  imports: [RouterLink, MatButtonModule, MatIconModule, MatSnackBarModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetailsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly productId = Number(this.route.snapshot.paramMap.get('id'));

  protected readonly product = computed(() =>
    this.productService.todos().find((p) => p.id === this.productId),
  );

  protected precoFinal(): number {
    const p = this.product();
    return p ? precoComDesconto(p) : 0;
  }

  protected aoAdicionarCarrinho(): void {
    const produto = this.product();
    if (!produto) return;

    const sucesso = this.cartService.adicionar(produto);
    if (!sucesso) {
      this.snackBar.open(`Estoque insuficiente de "${produto.name}".`, 'Fechar', {
        duration: 3000,
      });
    }
  }

  protected aoNotificar(): void {
    const p = this.product();
    if (p) {
      this.snackBar.open(`Avisaremos quando "${p.name}" voltar ao estoque!`, 'Fechar', {
        duration: 3000,
      });
    }
  }
}
