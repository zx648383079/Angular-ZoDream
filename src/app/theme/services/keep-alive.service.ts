import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs';

const SESSION_KEY = 'session_token';

@Injectable({
    providedIn: 'root'
})
export class KeepAliveService {

    private readonly http = inject(HttpClient);

    public readonly pulsed = new Subject<any>();

    private sessionToken = '';
    private delta = 0;
    private lastAt = Date.now();
    private isLoading = false;
    private last = {} as any;
    private timer = 0;
    private timeout = 60000;


    constructor() {
        this.sessionToken = window.localStorage.getItem(SESSION_KEY) || '';
        this.next();
    }


    public get token() {
        return this.sessionToken;
    }

    public set token(arg: string) {
        if (arg === this.sessionToken) {
            return;
        }
        this.sessionToken = arg;
        if (!arg) {
            window.localStorage.removeItem(SESSION_KEY);
            return;
        }
        window.localStorage.setItem(SESSION_KEY, arg);
    }


    private pulse() {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        this.http.post<any>('open/keep-alive', {
            since: this.lastAt,
            session_token: this.sessionToken,
            delta: this.delta ++
        }).subscribe({
            next: res => {
                this.lastAt = Date.now();
                this.isLoading = false;
                this.pulsed.next(this.last = {...this.last, ...res});
                this.next(Object.keys(res).length > 3 ? 1 : 2);
                if (res.session_token) {
                    this.token = res.session_token;
                }
            },
            error: _ => {
                this.isLoading = false;
                this.next(5);
            }
        });
    }

    private next(double = 1) {
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.timer = window.setTimeout(() => {
            this.timer = 0;
            this.pulse();
        }, this.timeout * Math.max(double, 1));
    }
}
