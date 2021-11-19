import { TestBed } from '@angular/core/testing';

import { SfBayTransitService } from './sf-bay-transit.service';

describe('SfBayTransitService', () => {
  let service: SfBayTransitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SfBayTransitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
