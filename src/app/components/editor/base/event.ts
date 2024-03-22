import { IBound, IPoint } from '../../../theme/utils/canvas';
import { IEditorBlock } from '../model';
import { IEditorTool } from './option';

export const EDITOR_EVENT_INPUT_KEYDOWN = 'input.keydown';
export const EDITOR_EVENT_INPUT_BLUR = 'input.blur';
export const EDITOR_EVENT_INPUT_CLICK = 'input.click';
export const EDITOR_EVENT_MOUSE_UP = 'mouse.up';
export const EDITOR_EVENT_MOUSE_MOVE = 'mouse.move';

export const EDITOR_EVENT_EDITOR_CHANGE = 'change';
export const EDITOR_EVENT_EDITOR_READY = 'ready';
export const EDITOR_EVENT_EDITOR_DESTORY = 'destroy';
export const EDITOR_EVENT_EDITOR_AUTO_SAVE = 'auto_save'; // 自动保存跟内容变化不一样，自动保存步骤少于内容变化
export const EDITOR_EVENT_SELECTION_CHANGE = 'selection_change';
export const EDITOR_EVENT_UNDO_CHANGE = 'undo';

export const EDITOR_EVENT_SHOW_ADD_TOOL = 'tool.add';
export const EDITOR_EVENT_SHOW_LINE_BREAK_TOOL = 'tool.line.break';
export const EDITOR_EVENT_SHOW_IMAGE_TOOL = 'tool.image';
export const EDITOR_EVENT_SHOW_COLUMN_TOOL = 'tool.column';
export const EDITOR_EVENT_SHOW_LINK_TOOL = 'tool.link';
export const EDITOR_EVENT_SHOW_TABLE_TOOL = 'tool.table';
export const EDITOR_EVENT_CLOSE_TOOL = 'tool.flow.close';
export const EDITOR_EVENT_CUSTOM = 'tool.custom'; // 自定义事件

export interface IEditorListeners {
    [EDITOR_EVENT_INPUT_KEYDOWN]: (e: KeyboardEvent) => void;
    [EDITOR_EVENT_INPUT_BLUR]: () => void;
    [EDITOR_EVENT_EDITOR_CHANGE]: () => void;
    [EDITOR_EVENT_INPUT_CLICK]: () => void;
    [EDITOR_EVENT_SHOW_ADD_TOOL]: (y: number) => void;
    [EDITOR_EVENT_CLOSE_TOOL]: () => void;
    [EDITOR_EVENT_SHOW_LINE_BREAK_TOOL]: (p: IPoint) => void;
    [EDITOR_EVENT_SHOW_IMAGE_TOOL]: (b: IBound, cb: EditorUpdatedCallback) => void;
    [EDITOR_EVENT_SHOW_LINK_TOOL]: (p: IPoint, cb: EditorUpdatedCallback) => void;
    [EDITOR_EVENT_SHOW_TABLE_TOOL]: (p: IPoint, cb: EditorUpdatedCallback) => void;
    [EDITOR_EVENT_SHOW_COLUMN_TOOL]: (b: IBound, cb: EditorUpdatedCallback) => void;
    [EDITOR_EVENT_SELECTION_CHANGE]: () => void;
    [EDITOR_EVENT_UNDO_CHANGE]: () => void;
    [EDITOR_EVENT_EDITOR_AUTO_SAVE]: () => void;
    [EDITOR_EVENT_EDITOR_READY]: () => void;
    [EDITOR_EVENT_MOUSE_MOVE]: (p: IPoint) => void;
    [EDITOR_EVENT_MOUSE_UP]: (p: IPoint) => void;
    [EDITOR_EVENT_EDITOR_DESTORY]: () => void;
    [EDITOR_EVENT_CUSTOM]: (item: IEditorTool) => void;
}

export const EDITOR_CLOSE_TOOL = 'close';
export const EDITOR_ADD_TOOL = 'add';
export const EDITOR_ENTER_TOOL = 'enter';
export const EDITOR_UNDO_TOOL = 'undo';
export const EDITOR_REDO_TOOL = 'redo';
export const EDITOR_FULL_SCREEN_TOOL = 'full-screen';
export const EDITOR_CODE_TOOL = 'code_toggle';
export const EDITOR_IMAGE_TOOL = 'image_edit';
export const EDITOR_TABLE_TOOL = 'table_edit';
export const EDITOR_VIDEO_TOOL = 'video_edit';
export const EDITOR_LINK_TOOL = 'link_edit';
export const EDITOR_MORE_TOOL = 'more';
export const EDITOR_PREVIEW_TOOL = 'preview';

export type EditorUpdatedCallback<T = IEditorBlock> = (data: T) => void;
