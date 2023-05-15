import { IEditorBlock } from '../model';

export const EVENT_INPUT_KEYDOWN = 'input.keydown';
export const EVENT_INPUT_BLUR = 'input.blur';
export const EVENT_INPUT_CLICK = 'input.click';
export const EVENT_MOUSE_UP = 'mouse.up';
export const EVENT_MOUSE_MOVE = 'mouse.move';

export const EVENT_EDITOR_CHANGE = 'change';
export const EVENT_EDITOR_READY = 'ready';
export const EVENT_EDITOR_DESTORY = 'destroy';
export const EVENT_EDITOR_AUTO_SAVE = 'auto_save'; // 自动保存跟内容变化不一样，自动保存步骤少于内容变化
export const EVENT_SELECTION_CHANGE = 'selection_change';
export const EVENT_UNDO_CHANGE = 'undo';

export const EVENT_SHOW_ADD_TOOL = 'tool.add';
export const EVENT_SHOW_LINE_BREAK_TOOL = 'tool.line.break';
export const EVENT_SHOW_IMAGE_TOOL = 'tool.image';
export const EVENT_SHOW_COLUMN_TOOL = 'tool.column';
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
    [EVENT_SHOW_IMAGE_TOOL]: (b: IBound, cb: EditorUpdatedCallback) => void;
    [EVENT_SHOW_LINK_TOOL]: (p: IPoint, cb: EditorUpdatedCallback) => void;
    [EVENT_SHOW_TABLE_TOOL]: (p: IPoint, cb: EditorUpdatedCallback) => void;
    [EVENT_SHOW_COLUMN_TOOL]: (b: IBound, cb: EditorUpdatedCallback) => void;
    [EVENT_SELECTION_CHANGE]: () => void;
    [EVENT_UNDO_CHANGE]: () => void;
    [EVENT_EDITOR_AUTO_SAVE]: () => void;
    [EVENT_EDITOR_READY]: () => void;
    [EVENT_MOUSE_MOVE]: (p: IPoint) => void;
    [EVENT_MOUSE_UP]: (p: IPoint) => void;
    [EVENT_EDITOR_DESTORY]: () => void;
}

export const EDITOR_CLOSE_TOOL = 'close';
export const EDITOR_ADD_TOOL = 'add';
export const EDITOR_ENTER_TOOL = 'enter';
export const EDITOR_UNDO_TOOL = 'undo';
export const EDITOR_REDO_TOOL = 'redo';
export const EDITOR_FULL_SCREEN_TOOL = 'full-screen';
export const EDITOR_CODE_TOOL = 'code';
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

export type EditorUpdatedCallback<T = IEditorBlock> = (data: T) => void;
