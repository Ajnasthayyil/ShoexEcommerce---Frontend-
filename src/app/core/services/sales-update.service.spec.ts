import { TestBed } from '@angular/core/testing';

import { SalesUpdateService } from './sales-update.service';

describe('SalesUpdateService', () => {
  let service: SalesUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalesUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
