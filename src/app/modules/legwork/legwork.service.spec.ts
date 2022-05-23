/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LegworkService } from './legwork.service';

describe('Service: Legwork', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LegworkService]
    });
  });

  it('should ...', inject([LegworkService], (service: LegworkService) => {
    expect(service).toBeTruthy();
  }));
});
