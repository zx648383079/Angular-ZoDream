import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SearchEventEmitter, SearchEvents, SearchListeners } from '../models/event';

@Injectable({
    providedIn: 'root',
})
export class SearchService implements SearchEventEmitter {

    private eventPair: {
        [trigger: string]: string;
    } = {
        [SearchEvents.CHANGE]: SearchEvents.SUGGEST
    };

    private listeners: {
        [key: string]: Function[];
    } = {};

    constructor(
        private router: Router
    ) {
    }

    public on<E extends keyof SearchListeners>(event: E, listener: SearchListeners[E]): void;
    public on(event: string, cb: (...items: any[]) => void|boolean|Observable<any>): this;
    public on(event: string, cb: any) {
        if (!Object.prototype.hasOwnProperty.call(this.listeners, event)) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(cb);
        return this;
    }

    public emit<E extends keyof SearchListeners>(event: E, ...eventObject: Parameters<SearchListeners[E]>): void;
    public emit(event: string, ...items: any[]): this;
    public emit(event: string, ...items: any[]) {
        if (!Object.prototype.hasOwnProperty.call(this.listeners, event)) {
            return this;
        }
        const pair = this.eventPair[event];
        const listeners = this.listeners[event];
        for (let i = listeners.length - 1; i >= 0; i--) {
            const cb = listeners[i];
            const res = cb(...items);
            //  允许事件不进行传递
            if (res === false) {
                break;
            }
            if (!res || !pair) {
                continue;
            }
            if (res instanceof Observable) {
                res.subscribe(data => {
                    this.emit(pair, data);
                });
                continue;
            }
            this.emit(pair, res);
        }
        return this;
    }

    public emitLogin(allowGo = true) {
        if (Object.prototype.hasOwnProperty.call(this.listeners, 'login')) {
            this.emit('login');
            return;
        }
        if (allowGo) {
            this.router.navigate(['/auth']);
        }
    }

    public off<E extends keyof SearchListeners>(event: E, listener?: SearchListeners[E] | undefined): void;
    public off(...events: string[]): this;
    public off(event: string, cb: Function): this;
    public off(...events: any[]) {
        if (events.length == 2 && typeof events[1] === 'function') {
            return this.offListener(events[0], events[1]);
        }
        for (const event of events) {
            delete this.listeners[event];
        }
        return this;
    }

    /**
     * 移除搜索框页面的接受事件
     */
    public offTrigger() {
        return this.off(SearchEvents.SUGGEST);
    }

    /**
     * 移除搜索结果页面的接受事件
     */
    public offReceiver() {
        return this.off(SearchEvents.CHANGE, SearchEvents.CONFIRM);
    }

    private offListener(event: string, cb: Function): this {
        if (!Object.prototype.hasOwnProperty.call(this.listeners, event)) {
            return this;
        }
        const items = this.listeners[event];
        for (let i = items.length - 1; i >= 0; i--) {
            if (items[i] === cb) {
                items.splice(i, 1);
            }
        }
        return this;
    }

}
