import { DivElement, EVENT_EDITOR_CHANGE, EVENT_INPUT_BLUR, EVENT_INPUT_KEYDOWN, EditorOptionManager, IEditorContainer, IEditorElement, IEditorTool, TextareaElement } from './base';
import { EditorBlockType, IEditorBlock, IEditorRange } from './model';

export class EditorContainer implements IEditorContainer {
    private selection: IEditorRange;
    private element: IEditorElement;
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
                this.insertBlock({type: EditorBlockType.AddLineBreak});
                return;
            }
            if (e.key === 'Tab') {
                e.preventDefault();
                this.insertBlock({type: EditorBlockType.Indent});
            }
        });
        this.on(EVENT_INPUT_BLUR, () => {
            this.saveSelection();
            this.emit(EVENT_EDITOR_CHANGE);
        });
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

    private checkSelection() {
        if (!this.selection) {
            this.selection = this.element.selection;
        }
    }

    public saveSelection() {
        this.selection = this.element.selection;
    }

    public insertBlock(block: IEditorBlock|string, range?: IEditorRange): void {
        if (typeof block !== 'object') {
            block = {
                type: EditorBlockType.AddText,
                text: block,
            }
        }
        this.element.insert(block, range ?? this.selection);
    }
    public execute(module: string|IEditorTool, range?: IEditorRange, data?: any): void {
        const instance = this.option.toModule(module);
        if (!instance || !instance.handler) {
            return;
        }
        instance.handler(this, range, data);
    }

    public insertOrInclude(val: string): void;
    public insertOrInclude(val: string, move: number): void;
    public insertOrInclude(begin: string, end: string): void;
    public insertOrInclude(val: string, move: string|number = 0) {
        if (!this.hasSelection) {
            if (typeof move === 'string') {
                this.insert(val + move, val.length);
                return;
            }
            this.insert(val, move);
            return;
        }
        this.replace(v => {
            if (typeof move === 'string') {
                return val + v + move;
            }
            return val.substring(0, move) + v + val.substring(move);
        });
    }



    public insert(val: string, move: number = 0, focus: boolean = true) {
        this.checkSelection();
        this.insertBlock(val);
        this.move(move);
        if (!focus) {
            return;
        }
        this.focus();
    }

    /**
     * replace
     */
    public replace(val: (str: string) => string | string, move: number = 0, focus: boolean = true) {
        this.checkSelection();
        if (!this.hasSelection) {
            this.insert(typeof val === 'function' ? val('') : val);
            return;
        }
        this.element.selection = this.selection;
        const v = typeof val === 'function' ? val(this.element.selectedValue) : val;
        this.element.selectedValue = v;
        this.move(move === 0 ? v.length : 0);
        if (!focus) {
            return;
        }
        this.focus();
    }

    public append(val: string, move: number = 0, focus: boolean = true) {
        this.replace(str => {
            if (str.length < 1) {
                return val;
            }
            if (move < 1) {
                return str + val;
            }
            if (move > val.length) {
                return val + str;
            }
            return val.substring(0, move) + str + val.substring(move);
        }, move, focus);
    }

    public clear(focus: boolean = true) {
        this.element.value = '';
        if (!focus) {
            return;
        }
        this.focus();
    }

    /**
     * move
     */
    public move(x: number) {
        if (x === 0) {
            return;
        }
        x = this.selection.start + x;
        this.selection = {
            start: x,
            end: Math.max(x, this.selection.end)
        };
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

    }
    public redo(): void {

    }

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