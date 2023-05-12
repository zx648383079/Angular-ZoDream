export const EVENT_INPUT_KEYDOWN = 'input.keydown';
export const EVENT_INPUT_BLUR = 'input.blur';
export const EVENT_INPUT_CLICK = 'input.click';

export const EVENT_EDITOR_CHANGE = 'change';
export const EVENT_SELECTION_CHANGE = 'selection_change';
export const EVENT_UNDO_CHANGE = 'undo';

export const EVENT_SHOW_ADD_TOOL = 'tool.add';
export const EVENT_SHOW_LINE_BREAK_TOOL = 'tool.line.break';
export const EVENT_SHOW_IMAGE_TOOL = 'tool.image';
export const EVENT_SHOW_LINK_TOOL = 'tool.link';
export const EVENT_SHOW_TABLE_TOOL = 'tool.table';
export const EVENT_CLOSE_TOOL = 'tool.flow.close';

export interface IEditorListeners {
    [EVENT_INPUT_KEYDOWN]: (e: KeyboardEvent) => void;
    [EVENT_INPUT_BLUR]: () => void;
    [EVENT_EDITOR_CHANGE]: () => void;
    [EVENT_INPUT_CLICK]: () => void;
    [EVENT_SHOW_ADD_TOOL]: (y: number) => void;
    [EVENT_CLOSE_TOOL]: () => void;
    [EVENT_SHOW_LINE_BREAK_TOOL]: (p: IPoint) => void;
    [EVENT_SHOW_IMAGE_TOOL]: (b: IBound) => void;
    [EVENT_SHOW_LINK_TOOL]: (p: IPoint) => void;
    [EVENT_SHOW_TABLE_TOOL]: (p: IPoint) => void;
    [EVENT_SELECTION_CHANGE]: () => void;
    [EVENT_UNDO_CHANGE]: () => void;
}

export const EDITOR_CLOSE_TOOL = 'close';
export const EDITOR_ADD_TOOL = 'add';
export const EDITOR_ENTER_TOOL = 'enter';
export const EDITOR_UNDO_TOOL = 'undo';
export const EDITOR_REDO_TOOL = 'redo';
export const EDITOR_IMAGE_TOOL = 'image_edit';
export const EDITOR_TABLE_TOOL = 'table_edit';
export const EDITOR_VIDEO_TOOL = 'video_edit';
export const EDITOR_LINK_TOOL = 'link_edit';

export interface IPoint {
    x: number;
    y: number;
}

export interface IBound extends IPoint {
    width: number;
    height: number;
}