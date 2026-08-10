import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ProductService } from '../../products/product-service';

@Component({
  selector: 'app-product-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
})
export class ProductFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly productService = inject(ProductService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  private readonly productEdit = this.productService.buscarPorId(
    Number(this.route.snapshot.paramMap.get('id')),
  );

  protected readonly editMode = !!this.productEdit;

  readonly productForm = this.fb.group({
    name: [
      this.productEdit?.name ?? '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(60)],
    ],
    description: [
      this.productEdit?.description ?? '',
      [Validators.required, Validators.minLength(20)],
    ],
    category: [this.productEdit?.category ?? '', [Validators.required]],
    price: [this.productEdit?.price ?? 0, [Validators.required, Validators.min(1)]],
    quantity: [this.productEdit?.stock ?? 0, [Validators.required, Validators.min(0)]],
    image: [this.productEdit?.image ?? '', [Validators.required]],
  });

  protected saveProduct(): void {
    if (this.productForm.invalid) return;
    const value = this.productForm.value;

    if (this.productEdit) {
      this.productService.atualizar({
        ...this.productEdit,
        name: value.name!,
        description: value.description!,
        category: value.category!,
        price: value.price!,
        stock: value.quantity!,
        image: value.image!,
      });
      this.snackBar.open('Produto atualizado com sucesso!', 'Fechar', { duration: 3000 });
    } else {
      this.productService.criar({
        name: value.name!,
        description: value.description!,
        category: value.category!,
        price: value.price!,
        stock: value.quantity!,
        image: value.image!,
        rating: 0,
        hidden: false,
        promotion: false,
      });
      this.snackBar.open('Produto cadastrado com sucesso!', 'Fechar', { duration: 3000 });
    }

    this.router.navigate(['/admin']);
  }
}
