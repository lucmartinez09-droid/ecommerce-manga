import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ProductsGridComponent } from './products-grid.component';

describe('ProductsGridComponent', () => {
  let fixture: ComponentFixture<ProductsGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsGridComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsGridComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
