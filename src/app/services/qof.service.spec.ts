import { TestBed } from '@angular/core/testing';

import { QofService } from './qof.service';

describe('QofService', () => {
  let service: QofService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QofService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
