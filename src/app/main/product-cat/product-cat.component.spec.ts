import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCatComponent } from './product-cat.component';

describe('ProductCatComponent', () => {
  let component: ProductCatComponent;
  let fixture: ComponentFixture<ProductCatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductCatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
