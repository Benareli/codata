import { TestBed } from '@angular/core/testing';

import { QopService } from './qop.service';

describe('QopService', () => {
  let service: QopService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QopService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
