import { DOCUMENT, DestroyRef, Injectable, inject } from '@angular/core';
import { css, documentHeight, scrollBottom, toggleClass, windowHeight } from '../utils/doc';
import { BehaviorSubject, Subject } from 'rxjs';
import { INavigationDisplay, NavigationDisplayMode } from '../models/event';
import { Router } from '@angular/router';
import { SuggestChangeEvent } from '../../components/form';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private readonly router = inject(Router);
    private readonly document = inject<Document>(DOCUMENT);


    private readonly body: HTMLElement;
    /**
     * 是否是屏幕宽度小于 48rem
     */
    public readonly tabletChanged = new BehaviorSubject<boolean>(false);
    /**
     * 网页标题改变
     */
    public readonly titleChanged = new BehaviorSubject<string>('');
    /**
     * 请求显示登录弹窗
     */
    public readonly loginRequest = new Subject<void>();
    /**
     * 请求更改导航样式
     */
    public readonly navigationDisplayRequest = new Subject<NavigationDisplayMode>();
    /**
     * 导航样式变更结果通知
     */
    public readonly navigationChanged = new BehaviorSubject<INavigationDisplay>({
        mode: NavigationDisplayMode.Inline,
        paneWidth: 0,
        bodyWidth: 0
    });
    /**
     * 搜索文字输入事件
     */
    public readonly suggestTextChanged = new Subject<SuggestChangeEvent>();
    /**
     * 搜索确认提交事件
     */
    public readonly suggestQuerySubmitted = new Subject<string|any>();

    constructor() {
        const doc = this.document;
        this.body = doc.body;
        this.titleChanged.next(doc.title);
        this.titleChanged.subscribe(title => doc.title = title);
        this.tabletChanged.subscribe(isTablet => this.toggleClass('screen-tablet', isTablet));
    }

    public get bodyWidth(): number {
        return this.body.clientWidth;
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

    public scrollTop(): number;
    public scrollTop(target: HTMLElement): number;
    public scrollTop(target: HTMLElement, value: number): void;
    public scrollTop(value: number): void;
    public scrollTop(target?: HTMLElement|number, value?: number): number|void {
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
        const doc = this.document;
        return doc.documentElement.scrollTop || doc.body.scrollTop || 0;
    }

    public windowHeight(): number {
        return windowHeight(this.document);
    }

    /**
     * 整个页面的高度
     * @returns 
     */
    public documentHeight(): number {
        return documentHeight(this.document);
    }

    /**
     * 滚动条距离底部的距离
     * @returns 
     */
    public scrollBottom(): number {
        return scrollBottom(this.document);
    }

    public emitLogin(allowGo = true) {
        if (this.loginRequest.observed) {
            this.loginRequest.next();
            return;
        }
        if (allowGo) {
            this.router.navigate(['/auth'], {queryParams: {queryParams: {redirect_uri: window.location.href}}});
        }
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

    /**
     * 平板模式根据隐藏底部栏
     * @param destroyRef 
     * @returns 
     */
    public tabletIf(destroyRef: DestroyRef) {
        if (!this.tabletChanged.value) {
            return;
        }
        this.navigationDisplayRequest.next(NavigationDisplayMode.Collapse);
        destroyRef.onDestroy(() => {
            this.navigationDisplayRequest.next(this.tabletChanged.value ? NavigationDisplayMode.BottomOverlay : NavigationDisplayMode.Inline);
        });
    }

    // public touchable(target: HTMLDivElement, onStart: , onMove, onFinish) {

    // }

    // public unbind(target: HTMLDivElement) {

    // }
}
