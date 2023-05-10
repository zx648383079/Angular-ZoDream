export const EVENT_INPUT_KEYDOWN = 'input.keydown';
export const EVENT_INPUT_BLUR = 'input.blur';

export const EVENT_EDITOR_CHANGE = 'change';

export interface IEditorListeners {
    [EVENT_INPUT_KEYDOWN]: (e: KeyboardEvent) => void;
    [EVENT_INPUT_BLUR]: () => void;
    [EVENT_EDITOR_CHANGE]: () => void;
}

export const EDITOR_CLOSE_TOOL = 'close';