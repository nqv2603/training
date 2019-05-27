import { TestBed } from '@angular/core/testing';

import { NewGuardService } from './new-guard.service';

describe('NewGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NewGuardService = TestBed.get(NewGuardService);
    expect(service).toBeTruthy();
  });
});
