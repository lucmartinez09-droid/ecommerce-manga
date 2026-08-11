import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ProductService } from '../../products/product-service';

const IMAGEM_PADRAO = 'images/shogun livraria.png';

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
    // 👇 agora é OPCIONAL (sem Validators.required)
    image: [this.productEdit?.image ?? ''],
  });

  /** Capa que será usada: URL digitada ou a arte oficial da Shogun */
  protected readonly imagemPreview = signal(
    (this.productEdit?.image ?? '').trim() || IMAGEM_PADRAO,
  );

  constructor() {
    this.productForm.controls.image.valueChanges.subscribe((value) => {
      this.imagemPreview.set((value ?? '').trim() || IMAGEM_PADRAO);
    });
  }

  protected saveProduct(): void {
    if (this.productForm.invalid) return;

    const value = this.productForm.value;
    const imagem = (value.image ?? '').trim() || IMAGEM_PADRAO;

    if (this.productEdit) {
      this.productService.atualizar({
        ...this.productEdit,
        name: value.name!,
        description: value.description!,
        category: value.category!,
        price: value.price!,
        stock: value.quantity!,
        image: imagem,
      });
      this.snackBar.open('Produto atualizado com sucesso!', 'Fechar', { duration: 3000 });
    } else {
      this.productService.criar({
        name: value.name!,
        description: value.description!,
        category: value.category!,
        price: value.price!,
        stock: value.quantity!,
        image: imagem,
        rating: 0,
        hidden: false,
        promotion: false,
      });
      this.snackBar.open('Produto cadastrado com sucesso!', 'Fechar', { duration: 3000 });
    }

    this.router.navigate(['/admin']);
  }
}
