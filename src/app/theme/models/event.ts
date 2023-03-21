import { Observable } from 'rxjs';

export enum NavToggle {
    Flow,   // 只悬浮显示切换图标，隐藏菜单
    Min,    // 只显示切换图标，隐藏菜单
    Mini,   // 只显示菜单图标
    Unreal, // 完全显示
    Hide, // 完全隐藏
}

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
}

export interface SearchListeners {
    [SearchEvents.CHANGE]: (keywords: string) => void|boolean|Observable<any[]>,
    [SearchEvents.CONFIRM]: (keywords: any) => void|false,
    [SearchEvents.SUGGEST]: (items: any[]) => void,
    [SearchEvents.LOGIN]: () => void,
    [SearchEvents.NAV_TOGGLE]: (toggle: number|NavToggle) => void;
    [SearchEvents.NAV_RESIZE]: (toggle: number, navWidth: number, bodyWidth: number) => void;
}

export interface SearchEventEmitter {
    on<E extends keyof SearchListeners>(event: E, listener: SearchListeners[E]): void;
    off<E extends keyof SearchListeners>(event: E, listener?: SearchListeners[E] | undefined): void;
    emit<E extends keyof SearchListeners>(event: E, ...eventObject: Parameters<SearchListeners[E]>): void;
}