import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class TrackerMemberService {

    constructor(
        private http: HttpClient
    ) { }

}
