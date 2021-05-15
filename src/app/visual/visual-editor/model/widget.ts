import { Subject } from 'rxjs';
import { cloneObject } from '../../../theme/utils';
import { IBound, IPoint, ISize } from './core';

export interface WidgetBound extends IBound {
    zIndex: number;
    /** 360 度 */
    rotate: number;

    /**
     * 缩放
     */
    scale: number;
}
export class WidgetProperty {
    public data: any = {};
    public get(key: string|number, def?: any) {
        if (!this.has(key)) {
            return def;
        }
        return this.data[key];
    }

    public set(key: string|number, value: any) {
        this.data[key] = value;
    }

    public has(key: string|number) {
        return Object.prototype.hasOwnProperty.call(this.data, key);
    }
}

export class EventManager {
    public listeners: {
        [key: string]: Function[];
    } = {};

    public on(event: string, callback: Function): this {
        const eventName = this.formatEvent(event);
        if (!this.listeners[eventName]) {
            this.listeners[eventName] = [callback];
        } else {
            this.listeners[eventName].push(callback);
        }
        return this;
    }

    public has(event: string): boolean {
        return this.listeners.hasOwnProperty(this.formatEvent(event));
    }

    public trigger(event: string, ... args: any[]) {
        const eventName = this.formatEvent(event);
        if (!this.listeners.hasOwnProperty(eventName)) {
            return;
        }
        this.listeners[eventName].forEach(cb => {
            cb(...args);
        });
        return;
    }

    public remove(event: string, ...callbacks: Function[]) {
        const eventName = this.formatEvent(event);
        if (!this.listeners.hasOwnProperty(eventName)) {
            return;
        }
        let len = callbacks.length;
        for (let i = this.listeners[eventName].length - 1; i >= 0; i--) {
            if (callbacks.indexOf(this.listeners[eventName][i]) < 0) {
                continue;
            }
            len --;
            this.listeners[eventName].splice(i, 1);
            if (len < 1) {
                return;
            }
        }
        return;
    }

    private formatEvent(name: any): string {
        return name + '';
    }
}

export class Widget implements WidgetBound {
    public unit: 'px' | '%' = 'px';
    public x: number = 0;
    public y: number = 0;

    public width: number = 0;
    public height: number = 0;

    // TODO 移入properties
    public opacity: number = 1;
    /**
     * 倾斜
     */
    public skew = 0;
    public zIndex: number = 0;
    /**
     * 旋转
    */
    public rotate: number = 0;
    /**
     * 收缩
    */
    public scale: number = 1;

    public name: string;
    public icon?: string;
    public tag: string;
    public preview?: string;
    public id: string|number;
    public properties = new WidgetProperty();
    public events = new EventManager();
    public readonly propertyChange$ = new Subject();

    public get location(): IPoint {
        return {
            x: this.x,
            y: this.y,
        };
    }

    public set location(p: IPoint) {
        this.x = p.x;
        this.y = p.y;
    }

    public get size(): ISize {
        return {
            width: this.width,
            height: this.height,
        };
    }

    public set size(s: ISize) {
        this.width = s.width;
        this.height = s.height;
    }

    public get bound(): IBound {
        return {...this.location, ...this.size};
    }
    public set bound(b: IBound) {
        this.x = b.x;
        this.y = b.y;
        this.width = b.width;
        this.height = b.height;
    }

    public onInit(source: WidgetSource) {
        this.name = source.name;
        this.icon = source.icon;
        this.preview = source.preview;
        this.tag = source.tag;
        if (source.properties) {
            this.properties.data = cloneObject(source.properties);
        }
    }

    public eq(item: Widget) {
        return item.id && item.id === this.id;
    }

    public get style() {
        if (this.opacity <= 0) {
            return {
                display: 'none',
            };
        }
        const data: any = {
            left: this.x + this.unit,
            top: this.y  + this.unit,
            opacity: this.opacity,
            'z-index': this.zIndex,
        };
        if (this.width > 0 || this.height > 0) {
            data.width = this.width + this.unit;
            data.height = this.height + this.unit;
        }
        const transform = [];
        if (this.rotate !== 0) {
            transform.push('rotate(' + this.degToAngle(this.rotate) + 'deg)')
        }
        if (this.scale !== 1) {
            transform.push('scale(' + this.scale + ')');
        }
        if (this.skew !== 0) {
            transform.push('skew(' + this.skew + ')');
        }
        if (transform.length > 0) {
            data.transform = transform.join(' ');
        }
        return data;
    }

    private degToAngle(i: number) {
        i = (i - 90) % 360;
        if (i < 0) {
            i += 360;
        }
        return i * Math.PI / 180 ;
    }
}

export class PanelWidget extends Widget {
    public children: Widget[] = [];

    public get length() {
        return this.children.length;
    }

    public push(item: Widget) {
        this.children.push(item);
    }

    public remove(i: Widget|number) {
        if (typeof i === 'number') {
            this.splice(i, 1);
            return;
        }
        this.forEach((item, j) => {
            if (item.eq(i)) {
                this.splice(j, 1);
                return false;
            }
        }, false);
    }

    public splice(i: number, length = 1) {
        this.children.splice(i, length);
    }

    public clear() {
        this.children = [];
    }

    public forEach(cb: (item: Widget, i: number) => false|void, asc = true) {
        const len = this.length;
        if (asc) {
            for (let i = 0; i < len; i++) {
                if (cb(this.children[i], i) === false) {
                    return;
                }
            }
            return;
        }
        for (let i = len - 1; i >= 0; i--) {
            if (cb(this.children[i], i) === false) {
                return;
            }
        }
    }
}

export interface WidgetPreview {
    name: string;
    tag: string;
    icon?: string;
    preview?: string;
}

export enum WidgetType {
    CONTROL,
    PANEL,
}

export interface WidgetSource extends WidgetPreview {
    type: WidgetType;
    properties?: any;
    onInit?: (instance: Widget) => Widget;
    onDestroy?: (instance: Widget) => void;
}

export interface WidgetMoveEvent {
    data: WidgetPreview;
    start?: IPoint;
}