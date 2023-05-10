import { IEditorBlock, IEditorRange } from '../model';
import { IEditorContainer } from './editor';
import { IEditorElement } from './element';
import { EVENT_INPUT_BLUR, EVENT_INPUT_KEYDOWN } from './event';

export class DivElement implements IEditorElement {
    constructor(
        private element: HTMLDivElement,
        private container: IEditorContainer) {
        this.bindEvent();
    }
    get selection(): IEditorRange {
        const sel = window.getSelection();
        const range = sel.getRangeAt(0);
        return {
            start: range.startOffset,
            end: range.endOffset,
            range: range.cloneRange()
        };
    }
    set selection(v: IEditorRange) {
        const sel = window.getSelection();
        let range = sel.getRangeAt(0);
        range.deleteContents();
        range = range.cloneRange();
        sel.removeAllRanges();
        range.setStart(this.element.firstChild, v.start);
        range.setEnd(this.element.firstChild, v.end);
        sel.addRange(range);
    }

    get selectedValue(): string {
        return '';
    }

    set selectedValue(val: string) {
    }

    get value(): string {
        return this.element.innerHTML;
    }
    set value(v: string) {
        this.element.innerHTML = v;
    }
    public insert(block: IEditorBlock, range?: IEditorRange): void {
        throw new Error('Method not implemented.');
    }
    public focus(): void {
        this.element.focus({preventScroll: true});
    }

    public blur(): void {
        return this.element.blur();
    }

    private bindEvent() {
        this.element.addEventListener('keydown', e => {
            this.container.emit(EVENT_INPUT_KEYDOWN, e);
        });
        this.element.addEventListener('blur', () => {
            this.container.emit(EVENT_INPUT_BLUR);
        });
    }
}