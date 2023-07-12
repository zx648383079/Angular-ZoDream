import { Injectable } from '@angular/core';
import { css, toggleClass } from '../utils/doc';

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
        toggleClass(this.body, tag, force);
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
        css(this.body, 'background-image', url ? `url(${url})` : '');
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

    // public touchable(target: HTMLDivElement, onStart: , onMove, onFinish) {

    // }

    // public unbind(target: HTMLDivElement) {

    // }
}
