import { EditorBlockType, IEditorBlock, IEditorRange } from '../model';
import { IEditorContainer } from './editor';
import { IEditorElement } from './element';
import { EVENT_INPUT_BLUR, EVENT_INPUT_CLICK, EVENT_INPUT_KEYDOWN, EVENT_TOOL_ADD, EVENT_TOOL_ENTER, EVENT_TOOL_FLOW_CLOSE, IPoint } from './event';

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

    get selectedValue(): string {
        const items: string[] = [];
        const range = this.selection.range;
        let lastLine: Node;
        this.eachRange(range, node => {
            if (node === range.startContainer && range.startContainer === range.endContainer) {
                items.push(node.textContent.substring(range.startOffset, range.endOffset));
                return;
            }
            if (node.nodeName === 'BR') {
                items.push('\n');
                lastLine = undefined;
                return;
            }
            if (lastLine !== node.parentNode && node.parentNode !== this.element && ['P', 'DIV', 'TR'].indexOf(node.parentNode.nodeName) >= 0) {
                // 这里可以加一个判断 p div tr
                if (lastLine) {
                    items.push('\n');
                }
                lastLine = node.parentNode;
            }
            if (node === range.startContainer) {
                items.push(node.textContent.substring(range.startOffset));
            } else if (node === range.endContainer) {
                items.push(node.textContent.substring(0, range.endOffset));
            }
        });
        return items.join('');
    }

    set selectedValue(val: string) {
        this.insert({type: EditorBlockType.AddText, text: val});
    }

    get value(): string {
        return this.element.innerHTML;
    }
    set value(v: string) {
        this.element.innerHTML = v;
    }
    public insert(block: IEditorBlock, range?: IEditorRange): void {
        if (!range) {
            range = this.selection;
        }
        switch(block.type) {
            case EditorBlockType.AddHr:
                this.insertHr(range.range);
                break;
            case EditorBlockType.AddText:
                break;
            case EditorBlockType.AddLineBreak:
                this.insertLineBreak(range.range);
                break;
            case EditorBlockType.AddImage:
                break;
        }
    }
    public focus(): void {
        this.element.focus({preventScroll: true});
    }

    public blur(): void {
        return this.element.blur();
    }

    private insertHr(range: Range) {
        const hr = document.createElement('hr');
        this.insertElement(hr, range);
        hr.addEventListener('mouseenter', e => {
            if (e.currentTarget instanceof HTMLHRElement && e.currentTarget.previousSibling instanceof HTMLHRElement) {
                this.selectNode(e.currentTarget);
                this.container.emit(EVENT_TOOL_ENTER, this.getOffset(e.currentTarget.previousSibling));
            }
        });
    }

    private insertTable(range: Range) {
       
    }

    private insertImage(range: Range) {
       
    }

    private insertVideo(range: Range) {
       
    }
    
    private insertLineBreak(range: Range) {
        const p = document.createElement(this.container.option.blockTag);
        p.appendChild(document.createElement('br'));
        this.insertElement(p, range);
        this.selectNode(p);
    }

    private selectNode(node: Node, offset = 0) {
        const sel = window.getSelection();
        let range = sel.getRangeAt(0);
        range.deleteContents();
        range = range.cloneRange();
        range.setStart(node, offset);
        range.setEnd(node, offset);
        sel.removeAllRanges();
        sel.addRange(range);
    }

    public insertElement(node: Node, range: Range) {
        if (range.startContainer === this.element) {
            this.element.appendChild(node);
            return;
        }
        if (this.isEndNode(range.startContainer, range.startOffset)) {
            const next = this.nextNode(range.startContainer);
            if (!next) {
                this.element.appendChild(node);
                return;
            }
            this.element.insertBefore(node, next);
            return;
        }
        const nextNode = this.splitNode(range.startContainer, range.startOffset);
        if (nextNode !== this.element) {
            this.element.insertBefore(node, nextNode);
        } else {
            this.element.appendChild(node);
        }
    }

    private bindEvent() {
        this.element.addEventListener('keydown', e => {
            this.container.saveSelection();
            this.container.emit(EVENT_INPUT_KEYDOWN, e);
            this.container.emit(EVENT_TOOL_FLOW_CLOSE);
        });
        this.element.addEventListener('keyup', () => {
            const range = this.selection.range;
            if (this.isEmptyLine(range)) {
                this.container.emit(EVENT_TOOL_ADD, this.getOffset(range.startContainer).y);
                return;
            }
        })
        this.element.addEventListener('compositionstart', () => {
            this.container.saveSelection();
        });
        this.element.addEventListener('compositionend', () => {
            this.container.saveSelection();
        });
        this.element.addEventListener('mouseup', () => {
            this.container.saveSelection();
            // console.log([this.selectedValue]);
        });
        // this.element.addEventListener('mousemove', e => {
        //     // this.container.saveSelection();
        //     console.log(e.target);
            
        // });
        this.element.addEventListener('touchend', () => {
            this.container.saveSelection();
        });
        this.element.addEventListener('click', () => {
            this.container.saveSelection();
            const range = this.selection.range;
            if (this.isEmptyLine(range)) {
                this.container.emit(EVENT_TOOL_ADD, this.getOffset(range.startContainer).y);
                return;
            }
            this.container.emit(EVENT_INPUT_CLICK);
            this.container.emit(EVENT_TOOL_FLOW_CLOSE);
        });
        this.element.addEventListener('blur', () => {
            this.container.saveSelection();
            this.container.emit(EVENT_INPUT_BLUR);
        });
    }

    /**
     * 遍历选中的所有元素，最末端的元素，无子元素
     * @param range 
     * @param cb 
     */
    private eachRange(range: Range, cb: (node: Node) => void) {
        const begin = range.startContainer;
        const end = range.endContainer;
        cb(begin);
        let current = begin;
        while (current !== end) {
            let next = this.nextNode(current);
            if (!next) {
                break;
            }
            if (next === end) {
                cb(next);
                break;
            }
            while (next.hasChildNodes()) {
                next = next.firstChild;
                if (next === end) {
                    break;
                }
            }
            cb(next);
            current = next;
        }
    }

    /**
     * 获取下一个相邻的元素，不判断最小子元素
     * @param node 
     * @returns 
     */
    private nextNode(node: Node): Node|undefined {
        if (node.nextSibling) {
            return node.nextSibling;
        }
        if (node.parentNode === this.element) {
            return undefined;
        }
        return this.nextNode(node.parentNode); 
    }

    /**
     * 拆分元素
     * @param node 
     * @param offset 
     * @returns 
     */
    private splitNode(node: Node, offset: number): Node {
        if (offset < 1) {
            return node;
        }
        if (!node.parentNode) {
            return node;
        }
        if (node instanceof Text && node.length > offset) {
            return node.splitText(offset)
        }
        return node;
    }

    private getOffset(node: Node):IPoint {
        if (node.nodeType !== 1) {
            node = node.parentNode;
        }
        if (node === this.element) {
            const style = getComputedStyle(this.element);
            return {
                x: parseFloat(style.getPropertyValue('padding-left')),
                y: parseFloat(style.getPropertyValue('padding-top')),
            };
        }
        return {
            y: (node as HTMLDivElement).offsetTop,
            x: (node as HTMLDivElement).offsetLeft
        };
    }

    private isEndNode(node: Node, offset: number): boolean {
        if (node instanceof Text) {
            return node.length <= offset;
        }
        if (node.childNodes.length < 1) {
            return true;
        }
        if (node.childNodes.length == 1 && node.childNodes[0].nodeName === 'BR') {
            return true;
        }
        return false;
    }

    private isEmptyLine(range: Range): boolean {
        if (range.startOffset !== range.endOffset ||range.startOffset > 0) {
            return false;
        }
        if (range.startContainer !== range.endContainer) {
            return false;
        }
        if (range.startContainer.nodeType !== 1) {
            return false;
        }
        for (let i = 0; i < range.startContainer.childNodes.length; i++) {
            const element = range.startContainer.childNodes[i];
            if (element.nodeName !== 'BR') {
                return false;
            }
            return true;
        }
        return true;
    }
}