import { EVENT_INPUT_BLUR, EVENT_INPUT_KEYDOWN, EVENT_SELECTION_CHANGE, IEditorElement } from '.';
import { wordLength } from '../../../theme/utils';
import { EditorBlockType, IEditorBlock, IEditorFileBlock, IEditorRange } from '../model';
import { IEditorContainer } from './editor';
/**
 * markdown 模式
 */
export class TextareaElement implements IEditorElement {
    constructor(
        private element: HTMLTextAreaElement,
        private container: IEditorContainer) {
        this.bindEvent();
    }
    public get selection(): IEditorRange {
        return {
            start: this.element.selectionStart,
            end: this.element.selectionEnd
        };
    }
    public set selection(v: IEditorRange) {
        this.element.selectionStart = v.start;
        this.element.selectionEnd = v.end;
        this.container.saveSelection();
    }

    public get selectedValue(): string {
        const s = this.selection;
        if (!s || s.start >= s.end) {
            return '';
        }
        return this.value.substring(s.start, s.end);
    }

    public set selectedValue(val: string) {
        const s = this.selection;
        const v = this.value;
        this.value = v.substring(0, s.start) + val + v.substring(s.end);
        this.selection = {
            start: s.start,
            end: s.start + val.length
        };
    }

    public get value(): string {
        return this.element.value;
    }
    public set value(v: string) {
        this.element.value = v;
    }

    public get length(): number {
        return this.value.length;
    }
    public get wordLength(): number {
        return wordLength(this.value);
    }

    public insert(block: IEditorBlock, range?: IEditorRange): void {
        if (!range) {
            range = this.selection;
        }
        if (block.begin && block.end) {
            this.includeBlock(block.begin, block.end, range);
            return;
        }
        switch(block.type) {
            case EditorBlockType.AddLink:
                this.insertLink(block.value, range);
                return;
            case EditorBlockType.AddText:
                this.insertText(block.value, range, block.cursor);
                return;
            case EditorBlockType.AddImage:
                this.insertImage(block as any, range);
                return;
            case EditorBlockType.Indent:
                this.insertIndent(range);
                return;
            case EditorBlockType.Outdent:
                this.insertOutdent(range);
                return;
            case EditorBlockType.AddLineBreak:
                this.insertLineBreak(range);
                return;
        }
    }
    public focus(): void {
        this.element.focus();
    }

    public blur(): void {
        return this.element.blur();
    }

    private insertLineBreak(range: IEditorRange) {
        this.insertText('\n', range);
    }

    private insertIndent(range: IEditorRange) {
        this.replaceSelectLine(s => {
            return s.split('\n').map(v => {
                return '    ' + v;
            }).join('\n');
        }, range);
    }

    private insertOutdent(range: IEditorRange) {
        this.replaceSelectLine(s => {
            return s.split('\n').map(v => {
                if (v.length < 1) {
                    return v;
                }
                switch(v.charCodeAt(0)) {
                    case 9:// \t
                        return v.substring(1);
                    case 32:// 空格
                        return v.replace(/^\s{1,4}/, '');
                    default:
                        return v;
                }
            }).join('\n');
        }, range);
    }

    private replaceSelectLine(cb: (s: string) => string, range: IEditorRange) {
        const v = this.value;
        let begin = range.start;
        if (begin > 0) {
            const i = v.lastIndexOf('\n', begin);
            if (i >= 0) {
                begin = i + 1;
            } else {
                begin = 0;
            }
        }
        const selected = v.substring(begin, range.end);
        const replace = cb(selected);
        this.value = v.substring(0, begin) + replace + v.substring(range.end);
        this.selection = {
            start: begin,
            end: begin + replace.length
        };
        this.focus();
    }

    private insertText(text: string, range: IEditorRange, cursor?: number) {
        const v = this.value;
        this.value = v.substring(0, range.start) + text + v.substring(range.start);
        this.moveCursor(range.start + (!cursor ? text.length : cursor));
    }

    private insertLink(link: string, range: IEditorRange) {
        if (typeof link === 'undefined') {
            link = '';
        }
        this.replaceSelect(s => {
            return `[${s}](${link})`;
        }, range, link ? link.length + 4 : 3);
    }

    private insertImage(block: IEditorFileBlock, range: IEditorRange) {
        this.replaceSelect(s => {
            if (s.trim().length === 0 && block.title) {
                s = block.title;
            }
            return `![${block.title}](${block.value})`;
        }, range, block.title ? block.title.length + 5 : 2);
    }

    private includeBlock(begin: string, end: string, range: IEditorRange) {
        this.replaceSelect(s => {
            return begin + s + end;
        }, range, begin.length);
    }

    private replaceSelect(cb: (s: string) => string, range: IEditorRange, cursor = 0, cursorBefore = true) {
        const v = this.value;
        const selected = v.substring(range.start, range.end);
        const replace = cb(selected);
        this.value = v.substring(0, range.start) + replace + v.substring(range.start);
        this.moveCursor(range.start + (cursorBefore ? selected.length : 0) + cursor);
    }

    /**
     * 移动光标到指定位置并focus
     * @param pos 
     */
    private moveCursor(pos: number) {
        this.selection = {
            start: pos,
            end: pos,
        };
        this.focus();
    }

    private bindEvent() {
        this.element.addEventListener('keydown', e => {
            this.container.emit(EVENT_INPUT_KEYDOWN, e);
        });
        this.element.addEventListener('keyup', e => {
            this.container.saveSelection();
        });
        this.element.addEventListener('blur', () => {
            this.container.emit(EVENT_INPUT_BLUR);
        });
        this.element.addEventListener('mouseup', () => {
            this.container.saveSelection();
            this.container.emit(EVENT_SELECTION_CHANGE);
        });
    }

}