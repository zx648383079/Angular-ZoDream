import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class KeepAliveService {


    private _lastAt = 0;
    private _isLoading = false;
    

    constructor(
        private http: HttpClient
    ) {

    }

}
