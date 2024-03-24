import { EDITOR_EVENT_EDITOR_CHANGE, EDITOR_EVENT_INPUT_KEYDOWN, EDITOR_EVENT_SELECTION_CHANGE, EditorBlockType, IEditorBlock, IEditorContainer, IEditorElement, IEditorRange, IEditorTextBlock } from '../../../components/editor';
import { EditorHelper } from '../../../components/editor/base/util';
import { wordLength } from '../../../theme/utils';
import { getShimmed } from '../../../theme/utils/doc';


export class TextElement implements IEditorElement {
    constructor(
        public element: HTMLDivElement,
        private container: IEditorContainer) {
        this.init();
        this.bindEvent();
    }

    private isComposition = false;
    private shimmedKey = '';
    private indent = '\u00A0\u00A0\u00A0\u00A0';

    public get selection(): IEditorRange {
        const sel = window.getSelection();
        const range = sel.getRangeAt(0);
        return {
            start: range.startOffset,
            end: range.endOffset,
            range: range.cloneRange()
        };
    }
    public set selection(v: IEditorRange) {
        const sel = window.getSelection();
        let range: Range;
        if (v.range) {
            range = v.range;
        } else {
            range = sel.getRangeAt(0);
            range.deleteContents();
            range = range.cloneRange();
            range.setStart(this.element, v.start);
            range.setEnd(this.element, v.end);
        }
        sel.removeAllRanges();
        sel.addRange(range);
    }
    public get selectedValue(): string {
        return '';
    }
    public set selectedValue(v: string) {
        const range = this.selection.range;
        this.addTextExecute(range, {value: v} as any);
    }
    public get value(): string {
        const items = [];
        this.eachLine(node => {
            items.push(node.innerText);
        });
        return items.join('\n');
    }
    public set value(v: string) {
        this.element.innerHTML = '';
        const items = v.split('\n');
        items.forEach(i => {
            EditorHelper.insertLast(this.element, this.createLine(new Text(this.formatLineText(i))));
        });
        if (items.length === 0) {
            this.addLine();
        }
    }
    public get length(): number {
        return this.value.length;
    }
    public get wordLength(): number {
        return wordLength(this.value);
    }
    public selectAll(): void {
        const sel = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(this.element);
        sel.removeAllRanges();
        sel.addRange(range);
    }

    public insert(block: IEditorBlock, range?: IEditorRange): void {
        if (!range) {
            range = this.selection;
        }
        const type = block.type === EditorBlockType.AddRaw ? EditorBlockType.AddText : block.type;
        const func = this[type + 'Execute'];
        if (typeof func === 'function') {
            func.call(this, range.range, block);
            return;
        }
        throw new Error(`insert type error:[${block.type}]`);
    }


    public focus(): void {
        this.element.focus({preventScroll: true});
    }
    public blur(): void {
        return this.element.blur();
    }

    private init() {
        this.shimmedKey = getShimmed(this.element);
        this.element.contentEditable = 'true';
        this.addLine();
    }

    private bindEvent() {
        this.element.addEventListener('keydown', e => {
            this.container.saveSelection();
            this.container.emit(EDITOR_EVENT_INPUT_KEYDOWN, e);
        });
        this.element.addEventListener('keyup', e => {
            if (this.isComposition) {
                return;
            }
            this.container.emit(EDITOR_EVENT_EDITOR_CHANGE);
        });
        this.element.addEventListener('mouseup', () => {
            this.container.saveSelection();
            
        });
        this.element.addEventListener('paste', e => {
            e.preventDefault();
            this.paste((e.clipboardData || (window as any).clipboardData));
        });
        this.element.addEventListener('compositionstart', () => {
            this.isComposition = true;
            // this.container.saveSelection();
        });
        this.element.addEventListener('compositionend', () => {
            this.isComposition = false;
            this.container.saveSelection();
            this.container.emit(EDITOR_EVENT_SELECTION_CHANGE);
            this.container.emit(EDITOR_EVENT_EDITOR_CHANGE);
        });
    }

    public paste(data: DataTransfer): void {
        const value = data.getData('text');
        if (!value) {
            return;
        }
        this.insert({type: EditorBlockType.AddText, value});
    }

    //#region 外部调用的方法

    private addTextExecute(range: Range, block: IEditorTextBlock) {
        const begin = this.topLineNode(range.startContainer);
        const end = range.endContainer === range.startContainer ? begin : this.topLineNode(range.endContainer);
        const text = this.getLinePrevious(range) + block.value + this.getLineNext(range);
        const i = begin ? EditorHelper.nodeIndex(begin) : this.element.children.length;
        this.insertLines(i, begin === end || !end ? i : EditorHelper.nodeIndex(end), ...text.split('\n'));
    }

    private addLineBreakExecute(range: Range) {
        if (range.endContainer === this.element) {
            this.addLine();
            return;
        }
        const begin = this.topLineNode(range.startContainer);
        const end = range.endContainer === range.startContainer ? begin : this.topLineNode(range.endContainer);
        const i = begin ? EditorHelper.nodeIndex(begin) : this.element.children.length;
        this.insertLines(i, begin === end || !end ? i : EditorHelper.nodeIndex(end), this.getLinePrevious(range), this.getLineNext(range));
        this.selectNode(this.element.children[i + 1].firstChild, this.indent.length);
    }

    private indentExecute(range: Range) {
        const node = this.topLineNode(range.startContainer);
        if (!node) {
            return;
        }
        if (node instanceof HTMLElement) {
            node.innerText = this.indent + node.innerText;
            return;
        }
        EditorHelper.replaceNode(node, this.createLine(new Text(this.indent + node.textContent)));
    }

    private outdentExecute(range: Range) {
        const node = this.topLineNode(range.startContainer);
        if (!node) {
            return;
        }
        if (node instanceof HTMLElement) {
            node.innerText =  node.innerText.replace(/^\s{1,4}/, '');
            return;
        }
        EditorHelper.replaceNode(node, this.createLine(new Text(node.textContent.replace(/^\s{1,4}/, ''))));
    }

//#endregion

    private selectNode(node: Node, offset = 0) {
        const sel = window.getSelection();
        const range = document.createRange();
        // range.deleteContents();
        // range = range.cloneRange();
        range.setStart(node, offset);
        range.setEnd(node, offset);
        sel.removeAllRanges();
        sel.addRange(range);
    }

    private getLinePrevious(range: Range): string {
        const items = [];
        this.eachLinePrevious(range, line => {
            items.push(line);
        });
        return items.reverse().join('').replaceAll('\n', '');
    }
    private getLineNext(range: Range): string {
        const items = [];
        this.eachLineNext(range, line => {
            items.push(line);
        });
        return items.join('').replaceAll('\n', '');
    }

    private eachLinePrevious(range: Range, cb: (text: string) => void) {
        if (range.startContainer === this.element) {
            return;
        }
        if (range.startContainer instanceof HTMLDivElement) {
            return;
        }
        if (range.startOffset > 0) {
            const text = range.startContainer as Text;
            cb(text.textContent.substring(0, range.startOffset));
        }
        let current = range.startContainer;
        while (true) {
            if (current.previousSibling) {
                current = current.previousSibling;
                cb(current.textContent);
                continue;
            }
            if (current.parentNode.parentNode == this.element) {
                break;
            }
            current = current.parentNode;
        }
    }

    private eachLineNext(range: Range, cb: (text: string) => void) {
        if (range.endContainer === this.element) {
            return;
        }
        if (range.endContainer instanceof HTMLDivElement) {
            return;
        }
        const text = range.endContainer as Text;
        cb(range.endOffset > 0 ? text.textContent.substring(range.endOffset) : text.textContent);
        let current = range.endContainer;
        while (true) {
            if (current.nextSibling) {
                if (current.nextSibling instanceof HTMLBRElement) {
                    break;
                }
                current = current.nextSibling;
                cb(current.textContent);
                continue;
            }
            if (current.parentNode.parentNode === this.element) {
                break;
            }
            current = current.parentNode;
        }
    }

    private insertLines(begin: number, end: number, ...items: string[]) {
        const max = this.element.children.length;
        let lineNo = 0;
        for (let i = 0; i < items.length; i++) {
            const text = this.formatLineText(items[i]);
            lineNo = begin + i;
            if (max >= lineNo && lineNo <= end) {
                this.renderLine(this.element.children[lineNo] as any, text);
                continue;
            }
            if (lineNo > max) {
                EditorHelper.insertLast(this.element, this.createLine(new Text(text)));
                continue;
            }
            EditorHelper.insertAfter(this.element.children[lineNo - 1], this.createLine(new Text(text)));
        }
        for (let i = end; i > lineNo; i -- ) {
            EditorHelper.removeNode(this.element[i]);
        }
    }

    private eachLine(cb: (line: HTMLParagraphElement, index: number) => void|false) {
        for (let i = 0; i < this.element.children.length; i++) {
            const dt = this.element.children[i];
            if (cb(dt as any, i + 1) === false) {
                break;
            }
        }
    }

    private topLineNode(node: Node): Node|undefined {
        while (node) {
            if (node === this.element) {
                return;
            }
            if (node.parentNode == this.element) {
                return node;
            }
            node = node.parentNode;
        }
        return;
    }

    private addLine(appendFn?: (node: Node) => void) {
        const node = new Text(this.indent);
        const line = this.createLine(node);
        if (appendFn) {
            appendFn(line);
        } else {
            EditorHelper.insertLast(this.element, line);
        }
        this.selectNode(node, node.textContent.length);
    }

    private renderLine(parent: HTMLElement, line?: string) {
        if (typeof line === 'undefined') {
            return;
        }
        parent.innerText = line;
        EditorHelper.insertLast(parent, document.createElement('br'));
    }

    private formatLineText(s: string): string {
        return this.indent + s.replace(/^\s+/, '')
    }

    private lineText(node: Node) {
        return (node instanceof HTMLElement ? node.innerText : node.textContent).replaceAll('\n', '');
    }

    private createLine(...items: Node[]) {
        const node = document.createElement('p');
        if (this.shimmedKey) {
            node.setAttribute(this.shimmedKey, '');
        }
        EditorHelper.insertLast(node, ...items, document.createElement('br'));
        return node;
    }
}