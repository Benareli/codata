import { TestBed } from '@angular/core/testing';

import { UomcatService } from './uomcat.service';

describe('UomcatService', () => {
  let service: UomcatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UomcatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
