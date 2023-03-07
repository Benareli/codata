import { TestBed } from '@angular/core/testing';

import { StockmoveService } from './stockmove.service';

describe('StockmoveService', () => {
  let service: StockmoveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockmoveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
