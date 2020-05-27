/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DiskService } from './disk.service';

describe('Service: Disk', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DiskService]
    });
  });

  it('should ...', inject([DiskService], (service: DiskService) => {
    expect(service).toBeTruthy();
  }));
});
