import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class KeepAliveService {


    private _lastAt = 0;
    private _isLoading = false;

    private http = inject(HttpClient);


}
