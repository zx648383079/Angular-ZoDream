import { IEditorRange } from '../model';
import { IEditorContainer } from './editor';
import { IEditorElement } from './element';

export class DivElement implements IEditorElement {
    constructor(
        private element: HTMLDivElement,
        private container: IEditorContainer) {
        
    }
    get selection(): IEditorRange {
        const sel = window.getSelection();
        const range = sel.getRangeAt(0);
        return {
            start: range.startOffset,
            end: range.endOffset
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
    insert(val: string): void {
        throw new Error('Method not implemented.');
    }
    focus(): void {
        this.element.focus();
    }
}