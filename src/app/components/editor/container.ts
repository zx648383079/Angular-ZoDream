import { DivElement, EVENT_EDITOR_CHANGE, EVENT_INPUT_BLUR, EVENT_INPUT_KEYDOWN, EVENT_UNDO_CHANGE, EditorOptionManager, IEditorContainer, IEditorElement, IEditorListeners, IEditorTool, TextareaElement } from './base';
import { EditorBlockType, IEditorBlock, IEditorRange } from './model';

export class EditorContainer implements IEditorContainer {
    private selection: IEditorRange;
    private element: IEditorElement;
    private undoStack: string[] = [];
    private undoIndex: number;
    private listeners: {
        [key: string]: Function[];
    } = {};

    constructor(
        public option: EditorOptionManager = new EditorOptionManager(),
    ) {
    }

    public ready(element: HTMLTextAreaElement|HTMLDivElement) {
        this.element = element instanceof HTMLTextAreaElement ? new TextareaElement(element, this) : new DivElement(element, this);
        this.selection = undefined;
        if (!this.element) {
            return;
        }
        this.on(EVENT_INPUT_KEYDOWN, (e: KeyboardEvent) => {
            const modifiers = [];
            if (e.ctrlKey) {
                modifiers.push('Ctrl');
            }
            if (e.shiftKey) {
                modifiers.push('Shift');
            }
            if (e.altKey) {
                modifiers.push('Alt');
            }
            if (e.metaKey) {
                modifiers.push('Meta');
            }
            if (e.key !== 'Control' && modifiers.indexOf(e.key) < 0) {
                modifiers.push(e.key.length === 1 ? e.key.toUpperCase() : e.key);
            }
            const module = this.option.hotKeyModule(modifiers.join('+'));
            if (module) {
                e.preventDefault();
                this.execute(module);
                return;
            }
            if (e.key === 'Enter') {
                e.preventDefault();
                this.insert({type: EditorBlockType.AddLineBreak});
                return;
            }
            if (e.key === 'Tab') {
                e.preventDefault();
                this.insert({type: EditorBlockType.Indent});
            }
        });
        this.on(EVENT_INPUT_BLUR, () => {
            this.saveSelection();
            // this.emit(EVENT_EDITOR_CHANGE);
        });
        this.on(EVENT_EDITOR_CHANGE, () => {
            if (this.undoIndex >= 0 && this.undoIndex < this.undoStack.length - 1) {
                this.undoStack.splice(this.undoIndex);
            }
            this.undoStack.push(this.value);
            this.undoIndex = this.undoStack.length - 1;
            this.emit(EVENT_UNDO_CHANGE);
        });
    }

    public get canUndo() {
        return this.undoIndex > 0 && this.undoStack.length > 0;
    }

    public get canRedo() {
        return this.undoIndex < this.undoStack.length && this.undoStack.length > 0;
    }


    /**
        是否有选择字符串
     */
    public get hasSelection() {
        return this.selection && this.selection.start < this.selection.end;
    }

    public get value(): string {
        if (!this.element) {
            return '';
        }
        return this.element.value;
    }

    public set value(content: string) {
        if (!this.element) {
            return;
        }
        this.element.value = typeof content === 'undefined' ? '' : content;
        this.emit(EVENT_EDITOR_CHANGE);
    }

    public get length(): number {
        return this.element.length;
    }
    public get wordLength(): number {
        return this.element.wordLength;
    }

    private checkSelection() {
        if (!this.selection) {
            this.selection = this.element.selection;
        }
    }

    public saveSelection() {
        this.selection = this.element.selection;
    }

    public insert(block: IEditorBlock|string, range?: IEditorRange): void {
        if (typeof block !== 'object') {
            block = {
                type: EditorBlockType.AddText,
                value: block,
            }
        }
        this.element.insert(block, range ?? this.selection);
    }
    
    public execute(module: string|IEditorTool, range?: IEditorRange, data?: any): void {
        const instance = this.option.toModule(module);
        if (!instance || !instance.handler) {
            return;
        }
        instance.handler(this, range ?? this.selection, data);
    }

    public clear(focus: boolean = true) {
        this.element.value = '';
        if (!focus) {
            return;
        }
        this.focus();
    }

    /**
     * focus
     */
    public focus() {
        this.checkSelection();
        this.element.selection = this.selection;
        this.element.focus();
    }

    public blur() {
        this.element.blur();
    }

    public undo(): void {
        if (!this.canUndo) {
            this.emit(EVENT_UNDO_CHANGE);
            return;
        }
        this.undoIndex --;
        this.value = this.undoStack[this.undoIndex];
    }
    public redo(): void {
        if (!this.canRedo) {
            this.emit(EVENT_UNDO_CHANGE);
            return;
        }
        this.undoIndex ++;
        this.value = this.undoStack[this.undoIndex];
    }

    public on<E extends keyof IEditorListeners>(event: E, listener: IEditorListeners[E]): IEditorContainer;
    public on(event: string, cb: any) {
        if (!Object.prototype.hasOwnProperty.call(this.listeners, event)) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(cb);
        return this;
    }

    public emit(event: string, ...items: any[]) {
        if (!Object.prototype.hasOwnProperty.call(this.listeners, event)) {
            return this;
        }
        const listeners = this.listeners[event];
        for (let i = listeners.length - 1; i >= 0; i--) {
            const cb = listeners[i];
            const res = cb(...items);
            //  允许事件不进行传递
            if (res === false) {
                break;
            }
        }
        return this;
    }


    public off(...events: string[]): this;
    public off(event: string, cb: Function): this;
    public off(...events: any[]) {
        if (events.length == 2 && typeof events[1] === 'function') {
            return this.offListener(events[0], events[1]);
        }
        for (const event of events) {
            delete this.listeners[event];
        }
        return this;
    }

    private offListener(event: string, cb: Function): this {
        if (!Object.prototype.hasOwnProperty.call(this.listeners, event)) {
            return this;
        }
        const items = this.listeners[event];
        for (let i = items.length - 1; i >= 0; i--) {
            if (items[i] === cb) {
                items.splice(i, 1);
            }
        }
        return this;
    }
}