export enum NavigationDisplayMode {
    /** 完全显示  */
    Inline,
    /** 单列显示图标 */
    Compact,
    /** 只占用单列但是悬浮完全显示 */
    CompactOverlay,
    /** 悬浮完全显示 */
    Overlay,
    
    /** 只显示切换图标并占用位置，隐藏菜单 */
    Toggle,
    /** 只悬浮显示切换图标，隐藏菜单 */
    ToggleOverlay,
    /** 完全隐藏 */
    Collapse,
}

export interface INavigationDisplay {
    mode: NavigationDisplayMode;
    paneWidth: number;
    bodyWidth: number;
}