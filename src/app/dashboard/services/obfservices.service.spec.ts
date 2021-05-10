import { TestBed } from '@angular/core/testing';

import { OBFServices } from './obfservices.service';

describe('OBFServices', () => {
  let service: OBFServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OBFServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
