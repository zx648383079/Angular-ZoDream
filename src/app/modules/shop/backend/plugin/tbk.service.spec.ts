/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TbkService } from './tbk.service';

describe('Service: Tbk', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TbkService]
    });
  });

  it('should ...', inject([TbkService], (service: TbkService) => {
    expect(service).toBeTruthy();
  }));
});
