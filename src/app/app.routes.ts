import { Routes } from '@angular/router';

import { ProductsGridComponent } from './products/products-grid/products-grid.component';
import { ProductDetailsComponent } from './pages/product-details/product-details';
import { ProductFormComponent } from './pages/product-form/product-form';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { AdminComponent } from './pages/admin/admin.component';
import { NotFoundComponent } from './pages/not-found/not-found';

export const routes: Routes = [
  { path: '', component: ProductsGridComponent },
  { path: 'products/:id', component: ProductDetailsComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'admin/products/new', component: ProductFormComponent },
  { path: 'admin/products/:id/edit', component: ProductFormComponent },
  { path: '**', component: NotFoundComponent },
];
