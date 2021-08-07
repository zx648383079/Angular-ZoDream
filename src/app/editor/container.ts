import { DivElement, EVENT_EDITOR_CHANGE, EVENT_INPUT_BLUR, EVENT_INPUT_KEYDOWN, IEditorContainer, IEditorElement, TextareaElement } from './base';
import { IEditorRange } from './model';

export class EditorContainer implements IEditorContainer {
    private selection: IEditorRange;
    private element: IEditorElement;
    private listeners: {
        [key: string]: Function[];
    } = {};


    public ready(element: HTMLTextAreaElement|HTMLDivElement) {
        this.element = element instanceof HTMLTextAreaElement ? new TextareaElement(element, this) : new DivElement(element, this);
        this.selection = undefined;
        if (!this.element) {
            return;
        }
        this.on(EVENT_INPUT_KEYDOWN, (e: KeyboardEvent) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                this.saveSelection();
                this.insert('    ', 4, true);
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

    private saveSelection() {
        this.selection = this.element.selection;
    }

    public insertOrInclude(val: string, move = 0) {
        if (!this.hasSelection) {
            this.insert(val, move);
            return;
        }
        this.replace(v => {
            return val.substr(0, move) + v + val.substr(move);
        });
    }

    public insert(val: string, move: number = 0, focus: boolean = true) {
        this.checkSelection();
        this.element.insert(val);
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
            return val.substr(0, move) + str + val.substr(move);
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