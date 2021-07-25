import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SearchService {

    /**
     * 输入文字发送改变
     */
    static EVENT_CHANGE = 'change';
    /**
     * 确认搜索
     */
    static EVENT_CONFIRM = 'confirm';

    /**
     * 根据文字设置搜索建议
     */
    static EVENT_CHANGE_SUGGEST = 'suggest';

    private eventPair: {
        [trigger: string]: string;
    } = {
        [SearchService.EVENT_CHANGE]: SearchService.EVENT_CHANGE_SUGGEST
    };

    private listeners: {
        [key: string]: Function[];
    } = {};

    constructor(
    ) {
    }

    public on(event: 'change', cb: (keywords: string) => void|boolean|Observable<any[]>): this;
    public on(event: 'confirm', cb: (keywords: any) => void|false): this;
    public on(event: 'suggest', cb: (items: any[]) => void): this;
    public on(event: 'toggle', cb: (toggle: number) => void): this;
    public on(event: string, cb: (...items: any[]) => void|boolean|Observable<any>): this;
    public on(event: string, cb: any) {
        if (!Object.prototype.hasOwnProperty.call(this.listeners, event)) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(cb);
        return this;
    }

    public emit(event: 'change', keywords: string): this;
    public emit(event: 'confirm', keywords: any): this;
    public emit(event: 'suggest', items: any[]): this;
    public emit(event: 'toggle', toggle: number): this;
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
        return this.off(SearchService.EVENT_CHANGE_SUGGEST);
    }

    /**
     * 移除搜索结果页面的接受事件
     */
    public offReceiver() {
        return this.off(SearchService.EVENT_CHANGE, SearchService.EVENT_CONFIRM);
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
