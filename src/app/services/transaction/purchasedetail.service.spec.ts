import { TestBed } from '@angular/core/testing';

import { PurchasedetailService } from './purchasedetail.service';

describe('PurchasedetailService', () => {
  let service: PurchasedetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PurchasedetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
