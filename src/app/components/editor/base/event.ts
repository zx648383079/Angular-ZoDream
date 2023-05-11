export const EVENT_INPUT_KEYDOWN = 'input.keydown';
export const EVENT_INPUT_BLUR = 'input.blur';
export const EVENT_INPUT_CLICK = 'input.click';

export const EVENT_EDITOR_CHANGE = 'change';

export const EVENT_TOOL_ADD = 'tool.add';
export const EVENT_TOOL_ENTER = 'tool.enter';
export const EVENT_TOOL_FLOW_CLOSE = 'tool.flow.close';

export interface IEditorListeners {
    [EVENT_INPUT_KEYDOWN]: (e: KeyboardEvent) => void;
    [EVENT_INPUT_BLUR]: () => void;
    [EVENT_EDITOR_CHANGE]: () => void;
    [EVENT_INPUT_CLICK]: () => void;
    [EVENT_TOOL_ADD]: (y: number) => void;
    [EVENT_TOOL_FLOW_CLOSE]: () => void;
    [EVENT_TOOL_ENTER]: (p: IPoint) => void;
}

export const EDITOR_CLOSE_TOOL = 'close';
export const EDITOR_ADD_TOOL = 'add';
export const EDITOR_ENTER_TOOL = 'enter';

export interface IPoint {
    x: number;
    y: number;
}