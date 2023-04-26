import { TestBed } from '@angular/core/testing';

import { PaymentmethodService } from './paymentmethod.service';

describe('PaymentmethodService', () => {
  let service: PaymentmethodService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentmethodService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
