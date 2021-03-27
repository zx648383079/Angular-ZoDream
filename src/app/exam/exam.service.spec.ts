/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ExamService } from './exam.service';

describe('Service: Exam', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExamService]
    });
  });

  it('should ...', inject([ExamService], (service: ExamService) => {
    expect(service).toBeTruthy();
  }));
});
