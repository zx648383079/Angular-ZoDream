import { Injectable } from '@angular/core';
import { camelCase, eachObject } from '../utils';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {

    public body: HTMLElement;
    private oldTitle = '';

    constructor() {
        this.body = document.body;
        this.oldTitle = document.title;
    }

    public addClass(...tags: string[]) {
        this.body.classList.add(...tags);
    }

    public removeClass(...tags: string[]) {
        this.body.classList.remove(...tags);
    }

    public toggleClass(tag: string, force?: boolean) {
        const ele = this.body;
        if (force === void 0) {
            force = !ele.classList.contains(tag);
        }
        if (force) {
            ele.classList.add(tag);
            return;
        }
        ele.classList.remove(tag);
    }

    /**
     * 清除背景图片
     */
    public setBackground();
    /**
     * 设置背景图片
     * @param url 
     */
    public setBackground(url: string);
    public setBackground(url?: string) {
        this.css(this.body, 'background-image', url ? `url(${url})` : '');
    }

    public setTitle(title: string = this.oldTitle) {
        this.oldTitle = document.title;
        document.title = title;
    }

    public isMobile(): boolean {
        const userAgentInfo = navigator.userAgent;
        const agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
        for (const item of agents) {
            if (userAgentInfo.indexOf(item) > 0) {
                return true;
            }
        }
        return false;
    }

    public css(el: HTMLElement, key: any);
    public css(el: HTMLElement, style: string, value: any)
    public css(el: HTMLElement, style: string|any, value?: any) {
        if (typeof style === 'string') {
            el.style[camelCase(style)] = value;
            return;
        }
        eachObject(style, (v, k: string) => {
            el.style[camelCase(k)] = v;
        });
    }

}
