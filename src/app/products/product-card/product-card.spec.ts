import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ProductCardComponent } from './product-card.component';
import { Product } from '../product';

describe('ProductCardComponent', () => {
  let fixture: ComponentFixture<ProductCardComponent>;
  let component: ProductCardComponent;

  const mockProduct: Product = {
    id: 1,
    name: 'Naruto',
    description: 'Obra de Masashi Kishimoto',
    price: 39.9,
    image: 'images/naruto.png',
    stock: 10,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCardComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('product', mockProduct);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit the product when the button is clicked', () => {
    let emitted: Product | undefined;
    component.adicionarAoCarrinho.subscribe((p) => (emitted = p));

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    button.click();

    expect(emitted).toEqual(mockProduct);
  });
});
