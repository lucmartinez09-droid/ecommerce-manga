import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Product, precoComDesconto } from '../product';

@Component({
  selector: 'app-product-card',
  imports: [MatCardModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
  readonly product = input.required<Product>();
  readonly adicionarAoCarrinho = output<Product>();
  readonly notificarEsgotado = output<Product>();

  protected precoFinal(): number {
    return precoComDesconto(this.product());
  }

  protected readonly estoqueBaixo = () => this.product().stock > 0 && this.product().stock <= 5;
}
