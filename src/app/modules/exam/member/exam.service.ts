import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ExamService {

    constructor(
        private http: HttpClient
    ) { }

}
