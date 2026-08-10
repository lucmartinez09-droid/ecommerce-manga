import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { ProductDetailsComponent } from './product-details';

describe('ProductDetailsComponent', () => {
  let fixture: ComponentFixture<ProductDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailsComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '1' } } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailsComponent);
    fixture.detectChanges();
  });

  it('should create and resolve the product by id', () => {
    expect(fixture.componentInstance).toBeTruthy();
    expect((fixture.componentInstance as any).product()?.id).toBe(1);
  });
});
