import { EVENT_INPUT_BLUR, EVENT_INPUT_KEYDOWN, IEditorElement } from '.';
import { IEditorBlock, IEditorRange } from '../model';
import { IEditorContainer } from './editor';

export class TextareaElement implements IEditorElement {
    constructor(
        private element: HTMLTextAreaElement,
        private container: IEditorContainer) {
        this.element.addEventListener('keydown', e => {
            this.container.emit(EVENT_INPUT_KEYDOWN, e);
        });
        this.element.addEventListener('blur', () => {
            this.container.emit(EVENT_INPUT_BLUR);
        });
    }
    get selection(): IEditorRange {
        return {
            start: this.element.selectionStart,
            end: this.element.selectionEnd
        };
    }
    set selection(v: IEditorRange) {
        this.element.selectionStart = v.start;
        this.element.selectionEnd = v.end;
    }

    get selectedValue(): string {
        const s = this.selection;
        if (!s || s.start >= s.end) {
            return '';
        }
        return this.value.substring(s.start, s.end);
    }

    set selectedValue(val: string) {
        const s = this.selection;
        const v = this.value;
        this.value = v.substring(0, s.start) + val + v.substring(s.end);
    }

    get value(): string {
        return this.element.value;
    }
    set value(v: string) {
        this.element.value = v;
    }
    public insert(block: IEditorBlock, range?: IEditorRange): void {
        if (!range) {
            range = this.selection;
        }
        const v = this.value;
        this.value = v.substring(0, range.start) + block + v.substring(range.start)
    }
    public focus(): void {
        this.element.focus();
    }

    public blur(): void {
        return this.element.blur();
    }

}