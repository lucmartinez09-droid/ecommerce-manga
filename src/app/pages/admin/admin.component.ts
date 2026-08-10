import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ProductService } from '../../products/product-service';
import { SaleService } from '../../cart/sale-service';
import { Product, precoComDesconto } from '../../products/product';

@Component({
  selector: 'app-admin',
  imports: [
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent {
  protected readonly productService = inject(ProductService);
  protected readonly saleService = inject(SaleService);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly displayedColumns = [
    'produto',
    'categoria',
    'preco',
    'estoque',
    'status',
    'acoes',
  ];

  protected precoFinal(product: Product): number {
    return precoComDesconto(product);
  }

  protected aoAlternarPromocao(product: Product): void {
    this.productService.alternarPromocao(product.id);
  }

  protected aoAlternarVisibilidade(product: Product): void {
    this.productService.alternarVisibilidade(product.id);
  }

  protected aoDeletar(product: Product): void {
    this.productService.deletar(product.id);
    this.snackBar.open(`"${product.name}" foi removido do catálogo.`, 'Fechar', { duration: 3000 });
  }
}
