import { TestBed } from '@angular/core/testing';

import { PossessionService } from './possession.service';

describe('PossessionService', () => {
  let service: PossessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PossessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
