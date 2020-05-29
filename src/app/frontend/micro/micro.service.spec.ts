/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MicroService } from './micro.service';

describe('Service: Micro', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MicroService]
    });
  });

  it('should ...', inject([MicroService], (service: MicroService) => {
    expect(service).toBeTruthy();
  }));
});
