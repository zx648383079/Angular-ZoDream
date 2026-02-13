import { camelCase, eachObject } from '.';

export function hasElementByClass(path: Array<Element>, className: string): boolean {
    if (!path) {
        return false;
    }
    let hasClass = false;
    for (const item of path) {
        if (!item || !item.className) {
            continue;
        }
        hasClass = item.className.indexOf(className) >= 0;
        if (hasClass) {
            return true;
        }
    }
    return hasClass;
}


export function toggleClass(ele: HTMLElement, tag: string, force?: boolean) {
    if (force === void 0) {
        force = !ele.classList.contains(tag);
    }
    if (force) {
        ele.classList.add(tag);
        return;
    }
    ele.classList.remove(tag);
}

export function css(el: HTMLElement, key: any): void;
export function css(el: HTMLElement, style: string, value: any): void;
export function css(el: HTMLElement, style: string|any, value?: any) {
    if (typeof style === 'string') {
        el.style[camelCase(style)] = value;
        return;
    }
    eachObject(style, (v, k: string) => {
        el.style[camelCase(k)] = v;
    });
}

export function scrollTop(doc: Document): number;
export function scrollTop(target: HTMLElement): number;
export function scrollTop(target: HTMLElement, value: number): void;
export function scrollTop(value: number): void;
export function scrollTop(target?: HTMLElement|number|Document, value?: number): number|void {
    if (typeof target === 'number') {
        window.scrollTo({top: target});
        return;
    }
    if (target.nodeName === '#document') {
        if (typeof value !== 'undefined') {
            window.scrollTo({top: value});
            return;
        }
        const doc = target as Document;
        return doc.documentElement.scrollTop || doc.body.scrollTop || 0;
    }
    if (typeof value !== 'undefined') {
        (target as HTMLElement).scrollTo({
            top: value
        });
        return;
    }
    return (target as HTMLElement).scrollTop || 0;
}

export function windowHeight(doc: Document): number {
    if (doc.compatMode === 'CSS1Compat') {
        return doc.documentElement.clientHeight;
    } 
    return doc.body.clientHeight;
}

/**
 * 整个页面的高度
 * @returns 
 */
export function documentHeight(doc: Document): number {
    const box = doc.querySelector('html');
    if (!box) {
        return 0;
    }
    return box.scrollHeight;
}

/**
 * 滚动条距离底部的距离
 * @returns 
 */
export function scrollBottom(doc: Document): number {
    return documentHeight(doc) - scrollTop(doc) - windowHeight(doc);
}

export function isHidden(target: HTMLElement): boolean {
    // !target.offsetParent
    return target.offsetWidth <= 0 || target.offsetHeight <= 0;
}

/**
 * 获取angular 封装的 私有shimmed
 * @param element 
 * @returns 
 */
export function getShimmed(element: HTMLElement): string {
    for (let i = 0; i < element.attributes.length; i++) {
        const item = element.attributes[i];
        if (item.name.startsWith('_ngcontent')) {
            return item.name;
        }
    }
    return '';
}