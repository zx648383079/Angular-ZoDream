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

    BACK,
    FORWARD,

    MERGE,
    SPLIT,
    ZINDEX,
    ZINDEX_TOP,
    ZINDEX_BOTTOM,
    ZINDEX_UP,
    ZINDEX_DOWN,
    ALIGN,
}

export interface IEditorAction {
    action: MENU_ACTION,
    data?: any;
}