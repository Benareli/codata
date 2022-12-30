import { TestBed } from '@angular/core/testing';

import { PosdetailService } from './posdetail.service';

describe('PosdetailService', () => {
  let service: PosdetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PosdetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
