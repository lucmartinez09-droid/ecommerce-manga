import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';

import { CartComponent } from './cart/cart.component';
import { CartService } from './cart/cart-service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    CartComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class App {
  protected readonly cartService = inject(CartService);
  protected readonly carrinhoAberto = signal(false);
}
