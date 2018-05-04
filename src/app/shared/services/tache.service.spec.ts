import { TestBed, inject } from '@angular/core/testing';

import { TacheService } from './tache.service';

describe('TacheService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TacheService]
    });
  });

  it('should be created', inject([TacheService], (service: TacheService) => {
    expect(service).toBeTruthy();
  }));
});
