import { TestBed } from '@angular/core/testing';

import { StockrequestService } from './stockrequest.service';

describe('StockrequestService', () => {
  let service: StockrequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockrequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
