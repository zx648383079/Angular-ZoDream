import { Injectable } from '@angular/core';
import { IMediaFile } from './model';

@Injectable({
    providedIn: 'root'
})
export class PlayerService {

    private listeners: {
        [key: string]: Function[];
    } = {};

    constructor() { }

    public play(): void;
    public play(item: IMediaFile): void;
    public play(item?: IMediaFile) {

    }

    public pause() {

    }

    public stop() {

    }

    public push(... items: IMediaFile[]) {

    }

    public on(event: string, cb: any) {
        if (!Object.prototype.hasOwnProperty.call(this.listeners, event)) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(cb);
        return this;
    }

    public emit(event: string, ...items: any[]) {
        if (!Object.prototype.hasOwnProperty.call(this.listeners, event)) {
            return this;
        }
        const listeners = this.listeners[event];
        for (let i = listeners.length - 1; i >= 0; i--) {
            const cb = listeners[i];
            const res = cb(...items);
            //  允许事件不进行传递
            if (res === false) {
                break;
            }
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
