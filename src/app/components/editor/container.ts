import { ComponentRef, Injectable, Injector, ViewContainerRef } from '@angular/core';
import { DivElement, EDITOR_EVENT_CUSTOM, EDITOR_EVENT_EDITOR_AUTO_SAVE, EDITOR_EVENT_EDITOR_CHANGE, EDITOR_EVENT_EDITOR_DESTORY, EDITOR_EVENT_EDITOR_READY, EDITOR_EVENT_INPUT_BLUR, EDITOR_EVENT_INPUT_KEYDOWN, EDITOR_EVENT_UNDO_CHANGE, EDITOR_FULL_SCREEN_TOOL, EDITOR_PREVIEW_TOOL, EditorOptionManager, IEditorContainer, IEditorElement, IEditorListeners, IEditorTool, TextareaElement } from './base';
import { EditorBlockType, IEditorBlock, IEditorModal, IEditorRange, IEditorSharedModal } from './model';
import { IPoint } from '../../theme/utils/canvas';

@Injectable()
export class EditorService implements IEditorContainer {
    private selection: IEditorRange;
    private element: IEditorElement;
    private undoStack: string[] = [];
    private undoIndex: number;
    private asyncTimer = 0;
    private listeners: {
        [key: string]: Function[];
    } = {};
    private modalRef: ComponentRef<IEditorModal>;
    private modalContainerRef: ViewContainerRef;
    private used = false;
    public option: EditorOptionManager = new EditorOptionManager();
    // private mouseMoveListeners = {
    //     move: undefined,
    //     finish: undefined,
    // };

    constructor(
        private injector: Injector,
    ) {
        // document.addEventListener('mousemove', e => {
        //     this.emit(EVENT_MOUSE_MOVE, {x: e.clientX, y: e.clientX});
        // });
        // document.addEventListener('mouseup', e => {
        //     this.emit(EVENT_MOUSE_UP, {x: e.clientX, y: e.clientX});
        // });
    }

    /**
     * 一个页面存在多个编辑器时能分开控制
     * @returns 
     */
    public clone(): EditorService {
        if (this.used) {
            return new EditorService(this.injector);
        }
        this.used = true;
        return this;
    }

    public ready(element: HTMLTextAreaElement|HTMLDivElement|IEditorElement, modalTarget?: ViewContainerRef) {
        if (modalTarget) {
            this.modalContainerRef = modalTarget;
        }
        if (element instanceof HTMLDivElement) {
            this.element = new DivElement(element, this);
        } else if (element instanceof HTMLTextAreaElement) {
            this.element = new TextareaElement(element, this);
        } else {
            this.element = element;
        }
        if (!this.element) {
            return;
        }
        // this.on(EVENT_MOUSE_MOVE, p => {
        //     if (this.mouseMoveListeners.move) {
        //         this.mouseMoveListeners.move(p);
        //     }
        // }).on(EVENT_MOUSE_UP, p => {
        //     if (this.mouseMoveListeners.finish) {
        //         this.mouseMoveListeners.finish(p);
        //     }
        // });
        this.on(EDITOR_EVENT_INPUT_KEYDOWN, (e: KeyboardEvent) => {
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
                e.stopPropagation();
                this.execute(module);
                return;
            }
            if (e.key === 'Enter') {
                e.preventDefault();
                e.stopPropagation();
                this.insert({type: EditorBlockType.AddLineBreak});
                return;
            }
            if (e.key === 'Tab') {
                e.preventDefault();
                e.stopPropagation();
                this.insert({type: EditorBlockType.Indent});
            }
        });
        this.on(EDITOR_EVENT_INPUT_BLUR, () => {
            this.saveSelection();
            // this.emit(EVENT_EDITOR_CHANGE);
        });
        this.on(EDITOR_EVENT_EDITOR_CHANGE, () => {
            this.asynSave();
        });
        this.on(EDITOR_EVENT_EDITOR_AUTO_SAVE, () => {
            if (this.undoIndex >= 0 && this.undoIndex < this.undoStack.length - 1) {
                this.undoStack.splice(this.undoIndex);
            }
            const maxUndoCount = this.option.maxUndoCount;
            if (maxUndoCount < this.undoStack.length) {
                this.undoStack.splice(0, this.undoStack.length - maxUndoCount - 1);
            }
            const val = this.value;
            if (this.undoStack.length === 0 || val != this.undoStack[this.undoIndex - 1]) {
                this.undoStack.push(val);
            }
            this.undoIndex = this.undoStack.length - 1;
            this.emit(EDITOR_EVENT_UNDO_CHANGE);
        });
        this.emit(EDITOR_EVENT_EDITOR_READY);
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
            this.once(EDITOR_EVENT_EDITOR_READY, () => {
                this.element.value = content;
            });
            return;
        }
        this.element.value = typeof content === 'undefined' ? '' : content;
        // this.emit(EVENT_EDITOR_CHANGE);
    }

    public get length(): number {
        return this.element ? this.element.length : 0;
    }
    public get wordLength(): number {
        return this.element ? this.element.wordLength : 0;
    }

    private checkSelection() {
        if (!this.selection) {
            this.selection = this.element.selection;
        }
    }

    public selectAll(): void {
        this.element.selectAll();
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

    public paste(data: DataTransfer) {
        this.element.paste(data);
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

    public asynSave() {
        if (this.asyncTimer > 0) {
            clearTimeout(this.asyncTimer);
        }
        this.asyncTimer = window.setTimeout(() => {
            this.asyncTimer = 0;
            this.emit(EDITOR_EVENT_EDITOR_AUTO_SAVE);
        }, 500);
    }

    public blur() {
        this.element.blur();
    }

    public destroy(): void {
        this.emit(EDITOR_EVENT_EDITOR_DESTORY);
        this.listeners = {};
    }

    public toggle(force?: boolean): void {
        if (!this.element) {
            return;
        }
        const ele = this.element.element;
        if (typeof force === 'undefined') {
            force = ele.style.display === 'none';
        }
        ele.style.display = force ? 'block' : 'none';
    }

    public undo(): void {
        if (!this.canUndo) {
            this.emit(EDITOR_EVENT_UNDO_CHANGE);
            return;
        }
        this.undoIndex --;
        this.value = this.undoStack[this.undoIndex];
    }
    public redo(): void {
        if (!this.canRedo) {
            this.emit(EDITOR_EVENT_UNDO_CHANGE);
            return;
        }
        this.undoIndex ++;
        this.value = this.undoStack[this.undoIndex];
    }

    // public get hasMoveListener() {
    //     return typeof this.mouseMoveListeners.move !== 'undefined';
    // }

    // public mouseMove(move?: (p: IPoint) => void, finish?: (p: IPoint) => void) {
    //     this.mouseMoveListeners = {
    //         move,
    //         finish: !move && !finish ? undefined : (p: IPoint) => {
    //             this.mouseMoveListeners = {move: undefined, finish: undefined};
    //             finish && finish(p);
    //         },
    //     };
    // }

    public autoHeight() {
        if (!this.element) {
            return;
        }
        const element = this.element.element;
        element.style.height = Math.max(200, element.scrollHeight) + 'px';
    }

    public emitTool(item: IEditorTool|string, event?: MouseEvent) {
        if (typeof item === 'string') {
            item = this.option.toModule(item);
        }
        this.focus();
        if (!item) {
            return;
        }
        this.executeModule(item, this.getOffsetPosition(event));
    }

    public modalClear() {
        if (this.modalRef) {
            this.modalRef.destroy();
            this.modalRef = undefined;
        }
    }

    private getOffsetPosition(event?: MouseEvent): IPoint {
        if (!event) {
            return {x: 0, y: 0};
        }
        const ele = this.element.element;
        const rect = ele.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }

    private executeModule(item: IEditorTool, position: IPoint) {
        this.modalClear();
        if (item.name === EDITOR_PREVIEW_TOOL || item.name === EDITOR_FULL_SCREEN_TOOL) {
            this.emit(EDITOR_EVENT_CUSTOM, item);
            return;
        }
        const module = this.option.toModule(item);
        if (!module) {
            return;
        }
        if (!module.modal) {
            this.execute(module);
            return;
        }
        this.modalRef = this.modalContainerRef.createComponent<IEditorModal>(module.modal, {
            injector: this.injector
        });
        if (typeof (this.modalRef.instance as IEditorSharedModal).modalReady === 'function') {
            (this.modalRef.instance as IEditorSharedModal).modalReady(module);
        }
        this.modalRef.instance.open({}, res => {
            this.modalRef.destroy();
            this.modalRef = undefined;
            this.execute(module, undefined, res);
        }, position);
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

    public once<E extends keyof IEditorListeners>(event: E, listener: IEditorListeners[E]): IEditorContainer;
    public once(event: string, cb: any) {
        const func = (...items: any[]) => {
            this.off(event, func);
            cb(...items);
        };
        this.on(event as any, func);
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