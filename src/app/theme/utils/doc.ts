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

export const fileToBase64 = (file: File|Blob, callback: (text: string) => void) => {
    const reader = new FileReader();
    // 传入一个参数对象即可得到基于该参数对象的文本内容
    reader.readAsDataURL(file);
    reader.onload = function (e) {
        // target.result 该属性表示目标对象的DataURL
        callback(e.target.result as string)
    };
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

export function css(el: HTMLElement, key: any);
export function css(el: HTMLElement, style: string, value: any)
export function css(el: HTMLElement, style: string|any, value?: any) {
    if (typeof style === 'string') {
        el.style[camelCase(style)] = value;
        return;
    }
    eachObject(style, (v, k: string) => {
        el.style[camelCase(k)] = v;
    });
}

export function scrollTop(): number;
export function scrollTop(target: HTMLElement): number;
export function scrollTop(target: HTMLElement, value: number): void;
export function scrollTop(value: number): void;
export function scrollTop(target?: HTMLElement|number, value?: number): number|void {
    if (typeof value !== 'undefined') {
        (target as HTMLElement).scrollTo({
            top: value
        });
        return;
    }
    if (typeof target === 'number') {
        window.scrollTo({top: target});
        return;
    }
    if (target) {
        return target.scrollTop || 0;
    }
    return document.documentElement.scrollTop || document.body.scrollTop || 0;
}

export function isHidden(target: HTMLElement): boolean {
    return target.offsetWidth <= 0 || target.offsetHeight <= 0;
}