import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable()
export class TrackerMemberService {    private http = inject(HttpClient);


}
