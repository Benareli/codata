import { TestBed } from '@angular/core/testing';

import { ProductCatService } from './product-cat.service';

describe('ProductCatService', () => {
  let service: ProductCatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductCatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
