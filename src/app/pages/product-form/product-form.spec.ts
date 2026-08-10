import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ProductFormComponent } from './product-form';

describe('ProductFormComponent', () => {
  let fixture: ComponentFixture<ProductFormComponent>;
  let component: ProductFormComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductFormComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start invalid, keeping the save button disabled', () => {
    expect(component.productForm.invalid).toBe(true);
  });

  it('should require a name', () => {
    const name = component.productForm.controls.name;
    name.setValue('');
    expect(name.hasError('required')).toBe(true);
  });

  it('should require a minimum of 20 characters in the description', () => {
    const description = component.productForm.controls.description;
    description.setValue('descrição curta');
    expect(description.hasError('minlength')).toBe(true);
  });

  it('should require a price greater than zero', () => {
    const price = component.productForm.controls.price;
    price.setValue(0);
    expect(price.hasError('min')).toBe(true);
  });

  it('should not accept negative quantity', () => {
    const quantity = component.productForm.controls.quantity;
    quantity.setValue(-1);
    expect(quantity.hasError('min')).toBe(true);
  });

  it('should be valid when all rules are satisfied', () => {
    component.productForm.setValue({
      name: 'Naruto',
      description: 'O ninja da Vila Oculta da Folha.',
      category: 'Shonen',
      price: 39.9,
      quantity: 10,
      image: null,
    });
    expect(component.productForm.valid).toBe(true);
  });
});
