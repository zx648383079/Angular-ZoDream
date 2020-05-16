/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FrontendService } from './frontend.service';

describe('Service: Frontend', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FrontendService]
    });
  });

  it('should ...', inject([FrontendService], (service: FrontendService) => {
    expect(service).toBeTruthy();
  }));
});
