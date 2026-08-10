import { Component, inject, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { CartService } from './cart-service';
import { CartItem } from './cart-item';

@Component({
  selector: 'app-cart',
  imports: [MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  protected readonly cartService = inject(CartService);

  readonly fechar = output<void>();

  protected aoAumentar(item: CartItem): void {
    this.cartService.aumentar(item.product);
  }

  protected aoDiminuir(item: CartItem): void {
    this.cartService.diminuir(item.product);
  }

  protected aoRemover(item: CartItem): void {
    this.cartService.remover(item.product.id);
  }

  protected aoLimpar(): void {
    this.cartService.limpar();
  }
}
