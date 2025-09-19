import { Component, Input } from '@angular/core';
import { IMediaFile, PlayerEvent, PlayerListeners } from '../model';
import { assetUri } from '../../../../theme/utils';

@Component({
    standalone: false,
    selector: 'app-image-player',
    templateUrl: './image-player.component.html',
    styleUrls: ['./image-player.component.scss']
})
export class ImagePlayerComponent implements PlayerEvent {

    public items: IMediaFile[] = [];
    public index = -1;
    public data: IMediaFile;
    @Input() public visible = false;
    @Input() public isFixed = false;
    private listeners: {
        [key: string]: Function[];
    } = {};
    
    public get canPrevious() {
        return this.items.length > 1 && this.index > 0;
    }

    public get canNext() {
        return this.items.length > 1 && this.index < this.items.length - 1;
    }

    public formatAsset(val?: string) {
        return assetUri(val);
    }

    public tapPrevious() {
        if (!this.canPrevious) {
            return;
        }
        this.index --;
        this.data = this.items[this.index];
    }

    public tapNext() {
        if (!this.canNext) {
            return;
        }
        this.index ++;
        this.data = this.items[this.index];
    }

    public play(): void;
    public play(item: IMediaFile): void;
    public play(item?: IMediaFile): void {
        let i = 0;
        if (item) {
            this.push(item);
            i = this.indexOf(item);
        }
        if (i < 0 || i >= this.items.length) {
            return;
        }
        this.index = i;
        this.data = this.items[i];
        this.visible = true;
    }
    public pause(): void {
        
    }
    public stop(): void {
        this.items = [];
        this.index = -1;
        this.data = undefined;
    }
    public push(...items: IMediaFile[]): void {
        for (const item of items) {
            if (this.indexOf(item) >= 0) {
                continue;
            }
            this.items.push(item);
        }
    }

    public indexOf(item: IMediaFile): number {
        for (let i = this.items.length - 1; i >= 0; i--) {
            if (this.items[i].source === item.source) {
                return i;
            }
        }
        return -1;
    }

    public on<E extends keyof PlayerListeners>(event: E, listener: PlayerListeners[E]): void;
    public on(event: string, cb: any) {
        if (!Object.prototype.hasOwnProperty.call(this.listeners, event)) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(cb);
        return this;
    }

    public emit<E extends keyof PlayerListeners>(event: E, ...eventObject: Parameters<PlayerListeners[E]>): void;
    public emit(event: string, ...items: any[]) {
        if (!Object.prototype.hasOwnProperty.call(this.listeners, event)) {
            return;
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
    }

    public off<E extends keyof PlayerListeners>(event: E, listener?: PlayerListeners[E] | undefined): void;
    public off(...events: any[]) {
        if (events.length == 2 && typeof events[1] === 'function') {
            return this.offListener(events[0], events[1]);
        }
        for (const event of events) {
            delete this.listeners[event];
        }
    }

    private offListener(event: string, cb: Function) {
        if (!Object.prototype.hasOwnProperty.call(this.listeners, event)) {
            return;
        }
        const items = this.listeners[event];
        for (let i = items.length - 1; i >= 0; i--) {
            if (items[i] === cb) {
                items.splice(i, 1);
            }
        }
    }
}
