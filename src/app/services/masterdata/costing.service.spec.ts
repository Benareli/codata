import { TestBed } from '@angular/core/testing';

import { CostingService } from './costing.service';

describe('CostingService', () => {
  let service: CostingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CostingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
