import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { CartService } from '../../cart/cart-service';
import { SaleService } from '../../cart/sale-service';

@Component({
  selector: 'app-checkout',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent {
  private readonly fb = inject(FormBuilder);
  protected readonly cartService = inject(CartService);
  private readonly saleService = inject(SaleService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  readonly checkoutForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
    email: ['', [Validators.required, Validators.email]],
    address: ['', [Validators.required, Validators.minLength(10)]],
    payment: ['', [Validators.required]],
  });

  protected finalizarCompra(): void {
    if (this.checkoutForm.invalid || this.cartService.itens().length === 0) return;

    this.saleService.registrarVenda({
      customerName: this.checkoutForm.value.name!,
      items: this.cartService.itens(),
      total: this.cartService.totalCarrinho(),
    });

    this.cartService.finalizar();
    this.snackBar.open('Compra realizada com sucesso! 🎉', 'Fechar', { duration: 4000 });
    this.router.navigate(['/']);
  }
}
