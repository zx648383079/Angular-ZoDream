export enum ALIGN_ACTION {
    H_LEFT,
    H_CENTER,
    H_RIGHT,
    H_STRETCH,
    V_TOP,
    V_CENTER,
    V_BOTTOM,
    V_STRETCH,
    CENTER,
    STRETCH,
}

export enum MENU_ACTION {
    CUT,
    COPY,
    PASTE,
    DELETE,

    BACK, // 撤销操作
    FORWARD, // 撤销上一步撤销，即重新执行操作

    MERGE,
    SPLIT,
    ZINDEX,
    ZINDEX_TOP,
    ZINDEX_BOTTOM,
    ZINDEX_UP,
    ZINDEX_DOWN,
    ALIGN,

    SELECT_ALL,
    SCALE_UP,
    SCALE_DOWN,

    HIDE_RULE,
    VISIBLE_RULE,
}

export interface IEditorAction {
    action: MENU_ACTION,
    data?: any;
}