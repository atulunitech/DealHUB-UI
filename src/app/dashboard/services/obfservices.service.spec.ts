import { TestBed } from '@angular/core/testing';

import { OBFServicesService } from './obfservices.service';

describe('OBFServicesService', () => {
  let service: OBFServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OBFServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
