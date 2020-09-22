/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { OpenService } from './open.service';

describe('Service: Open', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OpenService]
    });
  });

  it('should ...', inject([OpenService], (service: OpenService) => {
    expect(service).toBeTruthy();
  }));
});
