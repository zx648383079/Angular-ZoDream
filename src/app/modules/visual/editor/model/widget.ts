import { Subject } from 'rxjs';
import { cloneObject, eachObject } from '../../../../theme/utils';
import { PropertyUtil } from '../util';
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

export interface IStyle {
    [key: string]: any;
}

export class WidgetClass {
    constructor(
        items?: string[]|string,
    ) {
        if (!items) {
            return;
        }
        eachObject(items, v => {
            this.push(v);
        });
    }

    public data: string[] = [];

    public has(cls: string) {
        return this.indexOf(cls) >= 0;
    }

    public indexOf(cls: string): number {
        return this.data.indexOf(cls);
    }

    public toggle(cls: string, add?: boolean) {
        const isNo = typeof add === 'undefined';
        this.each(v => {
            if (isNo) {
                const i = this.indexOf(v);
                if (i >= 0) {
                    this.data.splice(i, 1);
                } else {
                    this.data.push(v);
                }
                return;
            }
            const i = this.indexOf(v);
            if (add) {
                if (i >= 0) {
                    return;
                }
                this.data.push(v);
                return;
            }
            if (i < 0) {
                return;
            }
            this.data.splice(i, 1);
        }, cls)
        return this;
    }

    public remove(cls: string) {
        this.each(v => {
            const i = this.indexOf(v);
            if (i >= 0) {
                this.data.splice(i, 1);
            }
        }, cls);
        return this;
    }

    public push(...items: string[]) {
        this.each(v => {
            const i = this.indexOf(v);
            if (i >= 0) {
                return;
            }
            this.data.push(v);
        }, ...items);
        return this;
    }

    private each(cb: (v: string) => void, ...items: string[]) {
        items.forEach(item => {
            if (!item) {
                return;
            }
            item.split(' ').forEach(val => {
                if (val === '') {
                    return;
                }
                cb(val);
            });
        });
    }

    public toString() {
        return this.data.join(' ');
    }
}

export class WidgetProperty {

    constructor(
        private readonly target: Widget,
        ) {
    }
    private data: IStyle = {};
    public get(key: string|number, def?: any) {
        if (!this.has(key)) {
            return def;
        }
        return this.data[key];
    }

    public set(data: IStyle): void;
    public set(key: string|number, value: any): void;
    public set(key: string|number|any, value?: any) {
        if (typeof key !== 'object') {
            this.data[key] = value;
        } else {
            eachObject(key, (v, k) => {
                this.data[k] = v;
            });
        }
        this.target.propertyChange$.next();
    }

    public has(key: string|number) {
        return Object.prototype.hasOwnProperty.call(this.data, key);
    }

    public getMany(maps: string[]) {
        const data: any = {};
        for (const k of maps) {
            if (!this.has(k)) {
                continue;
            }
            data[k] = this.get(k);
        }
        return data;
    }

    public get style(): IStyle {
        const data: IStyle = {};
        const defMap = {
            opacity: 1,
            'z-index': 0,
        };
        eachObject(defMap, (v, k) => {
            if (!this.has(k)) {
                return;
            }
            const val = this.get(k);
            if (typeof val === 'undefined' || val === null || val === v) {
                return;
            }
            data[k] = val;
        });
        return PropertyUtil.mergeStyle(data, PropertyUtil.transform(this));
    }


}

type UnitType = 'px' | '%' | 'em' | 'rem';

export class EventManager {
    constructor(
        private readonly target: Widget,
        ) {
    }
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
    public unit: UnitType = 'px';
    public x: number = 0;
    public y: number = 0;

    public width: number = 0;
    public height: number = 0;
    public parent?: Widget;
    public name: string;
    public icon?: string;
    public tag: string;
    public preview?: string;
    public id: string|number;
    /**
     * 真实尺寸
     */
    public actualBound?: IBound;
    public classList = new WidgetClass();
    public readonly properties = new WidgetProperty(this);
    public readonly events = new EventManager(this);
    public readonly propertyChange$ = new Subject<void>();

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

    public set opacity(v: number) {
        this.properties.set('opacity', v);
    }

    public get opacity(): number {
        return this.properties.get('opacity', 1);
    }

    public set skew(v: number) {
        this.properties.set('skew', v);
    }
    /** 
     * 倾斜
     */
    public get skew(): number {
        return this.properties.get('skew', 0);
    }

    public set zIndex(v: number) {
        this.properties.set('z-index', v);
    }

    public get zIndex(): number {
        return this.properties.get('z-index', 0);
    }

    public set rotate(v: number) {
        this.properties.set('rotate', v);
    }
    /**
     * 旋转 360
    */
    public get rotate(): number {
        return this.properties.get('rotate', 0);
    }

    public set scale(v: number) {
        this.properties.set('scale', v);
    }
    /**
     * 收缩
    */
    public get scale(): number {
        return this.properties.get('scale', 1);
    }

    public onInit(source: WidgetSource) {
        this.name = source.name;
        this.icon = source.icon;
        this.preview = source.preview;
        this.tag = source.tag;
        if (source.properties) {
            this.properties.set(cloneObject(source.properties));
        }
    }

    public eq(item: Widget) {
        return item.id && item.id === this.id;
    }

    public get style(): IStyle {
        if (this.opacity <= 0) {
            return {
                display: 'none',
            };
        }
        const data: IStyle = {
            position: 'absolute',
            left: this.x + this.unit,
            top: this.y  + this.unit,
            'z-index': this.zIndex,
        };
        if (this.width > 0 || this.height > 0) {
            data.width = this.width + this.unit;
            data.height = this.height + this.unit;
        }
        return {...data, ...this.properties.style};
    }

    /**
     * 调试时外包装的样式
     */
    public get outerStyle(): IStyle {
        if (this.opacity <= 0) {
            return {
                display: 'none',
            };
        }
        const data: IStyle = {
            left: this.x + this.unit,
            top: this.y  + this.unit,
            'z-index': this.zIndex,
        };
        if (this.width > 0 || this.height > 0) {
            data.width = this.width + this.unit;
            data.height = this.height + this.unit;
        }
        if (this.properties.has('position')) {
            data.position = 'absolute';
        }
        return data;
    }

    /**
     * 调试时内部的样式
     */
    public get innerStyle(): IStyle {
        if (this.opacity <= 0) {
            return {
                display: 'none',
            };
        }
        const data: IStyle = this.properties.style;
        if (this.width > 0 || this.height > 0) {
            data.width = this.width + this.unit;
            data.height = this.height + this.unit;
        }
        delete data.position;
        return data;
    }
}

export class PanelWidget extends Widget {
    public children: Widget[] = [];

    public get length() {
        return this.children.length;
    }

    public push(item: Widget) {
        item.parent = this;
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
    // 基本图形，无法编辑内容
    ELEMENT,
    // 包含内容，标题文字
    CONTROL,
    // 包含标题，可以放置子控件
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

