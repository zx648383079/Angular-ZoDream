import { ElementRef } from '@angular/core';
import { IRect, PanelWidget, Widget } from '../model';
import { IBound, IPoint } from '../../../../theme/utils/canvas';

export function isRect(val: IBound|IRect|IPoint): boolean {
    return Object.prototype.hasOwnProperty.call(val, 'right') && Object.prototype.hasOwnProperty.call(val, 'bottom');
}

export function isBound(val: IBound|IRect|IPoint): boolean {
    return Object.prototype.hasOwnProperty.call(val, 'width') && Object.prototype.hasOwnProperty.call(val, 'height');
}

export function boundToRect(val: IBound|IRect): IRect {
    if (isRect(val)) {
        return val as IRect;
    }
    return {
        x: val.x,
        y: val.y,
        right: val.x + (val as IBound).width,
        bottom: val.y + (val as IBound).height,
    };
}

export function rectToBound(val: IBound|IRect): IBound {
    if (!isRect(val)) {
        return val as IBound;
    }
    return {
        x: val.x,
        y: val.y,
        width: (val as IRect).right - val.x,
        height: (val as IRect).bottom - val.y
    };
}

export function wordBound(base: IBound, relatvie: IBound): IBound {
    if (!base) {
        return {...relatvie};
    }
    return {
        x: relatvie.x + base.x,
        y: relatvie.y + base.y,
        width: relatvie.width,
        height: relatvie.height,
    };
}

export function relativePoint<T extends IPoint>(base: IPoint, word: T): T {
    if (!base) {
        return {...word};
    }
    if (isRect(word)) {
        return <IRect>{
            x: word.x - base.x,
            y: word.y - base.y,
            right: (word as any).right - base.x,
            bottom: (word as any).bottom - base.y,
        } as any;
    }
    return {
        ...word,
        x: word.x - base.x,
        y: word.y - base.y,
    };
}

export function wordRect(base: IRect|IBound, relatvie: IRect|IBound): IRect {
    const b = rectToBound(relatvie);
    if (!base) {
        return {x: relatvie.x, y: relatvie.y, right: relatvie.x + b.width, bottom: relatvie.y + b.height};
    }
    const x = relatvie.x + base.x;
    const y = relatvie.y + base.y;
    return {
        x,
        y,
        right: x + b.width, 
        bottom: y + b.height
    };
}

export function workVisibleRect(base: IRect|IBound, relatvie: IRect|IBound): IRect {
    return visibleRect(base, wordRect(base, relatvie));
}

/**
 * 获取元素的可见区域
 * @param base 
 * @param search 
 * @returns 
 */
export function visibleRect(base: IRect|IBound, search: IRect|IBound): IRect {
    const a = boundToRect(base);
    const b = boundToRect(search);
    if (b.right <= a.x || b.x >= a.right || b.bottom <= a.y || b.bottom >= a.bottom) {
        return {x: b.x, y: b.y, right: b.x, bottom: b.x};
    }
    if (b.x < base.x) {
        b.x = base.x;
    }
    if (b.y < base.y) {
        b.y = base.y;
    }
    return {
        x: Math.max(base.x, b.x),
        y: Math.max(base.y, b.y),
        right: Math.min(b.right, a.right),
        bottom: Math.min(b.bottom, a.bottom),
    };
}

/**
 * 判断两个区域是否相交
 * @param a 
 * @param b 
 * @returns 
 */
export function isIntersect(a: IRect|IBound, b: IRect|IBound|IPoint): boolean {
    const rect1 = boundToRect(a instanceof Widget ? a.actualBound : a);
    if (!isBound(b) && !isRect(b)) {
        return rect1.x <= b.x && rect1.y <= b.y && rect1.bottom >= b.y && rect1.right >= b.x;
    }
    const rect2 = boundToRect(b as any);
    return Math.abs(rect1.right + rect1.x - rect2.right - rect2.x) <= (rect1.right - rect1.x + rect2.right - rect2.x) && Math.abs(rect1.bottom + rect1.y - rect2.bottom - rect2.y) <= (rect1.bottom - rect1.y + rect2.bottom - rect2.y);
}

/**
 * 获取元素的位置和尺寸
 * @param ele 
 * @returns 
 */
export function elementBound(ele: ElementRef<HTMLElement>|HTMLElement): IBound {
    if (!ele) {
        return {x: 0, y: 0, width: 0, height: 0};
    }
    const box: HTMLElement = ele instanceof ElementRef ? (ele as any).nativeElement : ele;
    if (!box) {
        return {x: 0, y: 0, width: 0, height: 0};
    }
    const rect = box.getBoundingClientRect();
    return {
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height
    };
}
/**
 * 计算缩放的值，纵向坐标不变
 * @param box 
 * @param scale 
 * @param base 
 * @returns 
 */
export function scaleBound(box: IBound, scale = 1, base = 1): IBound {
    const width = box.width * scale / base;
    const height = box.height * scale / base;
    return {
        x: box.x + (box.width - width) / 2,
        y: box.y,// + (box.height - height) / 2,
        width,
        height
    };
}

export function boundFromScale(box: IBound, scale = 1, base = 1): IBound {
    const width = box.width * base / scale;
    const height = box.height * base / scale;
    return {
        x: box.x, //- (box.width - width) / 2,
        y: box.y,// + (box.height - height) / 2,
        width,
        height
    };
}

export function pointFromScale<T extends IPoint>(val: T, wordBound: IBound, scale = 1, base = 1): T {
    return {
        ...val,
        x: val.x - wordBound.x * scale / base,
        y: val.y - wordBound.y * scale / base,
    }
}

/**
 * 根据框选的区域获取里面的内容
 * @param items 
 * @param selection 
 * @returns 
 */
export function filterItems<T extends IBound>(items: T[], selection: IBound|IPoint|IRect): T[] {
    return items.filter(i => isIntersect(i, selection));
}

/**
 * 获取包括所有区域的范围
 * @param items 
 * @returns 
 */
export function maxBound(items: IBound[]): IBound {
    let x = 0;
    let y = 0;
    let right = 0;
    let bottom = 0;
    let init = false;
    for (const item of items) {
        const bound = item instanceof Widget ? item.actualBound : item;
        const r = bound.x + bound.width;
        const b = bound.y + bound.height;
        if (!init) {
            x = bound.x;
            y = bound.y;
            right = r;
            bottom = b;
            init = true;
            continue;
        }
        if (bound.x < x) {
            x = bound.x;
        }
        if (bound.y < y) {
            y = bound.y;
        }
        if (r > right) {
            right = r;
        }
        if (b > bottom) {
            bottom = b;
        }
    }
    return {
        x,
        y,
        width: right - x,
        height: bottom - y,
    }
}

export function isMergeable(items: Widget[]) {
    return items.length > 1;
}

export function isSplitable(items: Widget[]) {
    return items.length === 1 && items[0] instanceof PanelWidget;
}
