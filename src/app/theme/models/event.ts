import { Observable } from 'rxjs';

export enum SearchEvents {
    /** 输入文字发送改变 */
    CHANGE = 'change',
    /** 确认搜索 */
    CONFIRM = 'confirm',
    /** 根据文字设置搜索建议 */
    SUGGEST = 'suggest',
    LOGIN = 'login',
    /** 菜单改变 */
    NAV_TOGGLE = 'nav.toggle',
    NAV_RESIZE = 'nav.resize',
    /** 隐藏显示头部尾部公共位置内容 */
    LAYOUT_TOGGLE = 'layout.toggle',
}

export interface SearchListeners {
    [SearchEvents.CHANGE]: (keywords: string) => void|boolean|Observable<any[]>,
    [SearchEvents.CONFIRM]: (keywords: any) => void|false,
    [SearchEvents.SUGGEST]: (items: any[]) => void,
    [SearchEvents.LOGIN]: () => void,
    [SearchEvents.NAV_TOGGLE]: (toggle: number) => void;
    [SearchEvents.NAV_RESIZE]: (toggle: number, navWidth: number, bodyWidth: number) => void;
}

export interface SearchEventEmitter {
    on<E extends keyof SearchListeners>(event: E, listener: SearchListeners[E]): void;
    off<E extends keyof SearchListeners>(event: E, listener?: SearchListeners[E] | undefined): void;
    emit<E extends keyof SearchListeners>(event: E, ...eventObject: Parameters<SearchListeners[E]>): void;
}