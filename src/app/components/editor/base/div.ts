import { wordLength } from '../../../theme/utils';
import { EditorBlockType, IEditorBlock, IEditorFileBlock, IEditorLinkBlock, IEditorRange, IEditorResizeBlock, IEditorTableBlock, IEditorVideoBlock } from '../model';
import { IEditorContainer } from './editor';
import { IEditorElement } from './element';
import { EVENT_CLOSE_TOOL, EVENT_EDITOR_CHANGE, EVENT_INPUT_BLUR, EVENT_INPUT_CLICK, EVENT_INPUT_KEYDOWN, EVENT_SELECTION_CHANGE, EVENT_SHOW_ADD_TOOL, EVENT_SHOW_COLUMN_TOOL, EVENT_SHOW_IMAGE_TOOL, EVENT_SHOW_LINE_BREAK_TOOL, EVENT_SHOW_LINK_TOOL, EVENT_SHOW_TABLE_TOOL, IBound, IEditorListeners, IPoint } from './event';

/**
 * 富文本模式
 */
export class DivElement implements IEditorElement {
    constructor(
        private element: HTMLDivElement,
        private container: IEditorContainer) {
        this.bindEvent();
    }

    private isComposition = false;

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

    public set selectedValue(val: string) {
        this.insert({type: EditorBlockType.AddText, text: val});
    }

    public get value(): string {
        return this.element.innerHTML;
    }
    public set value(v: string) {
        this.element.innerHTML = v;
    }

    public get length(): number {
        return this.value.length;
    }
    public get wordLength(): number {
        return wordLength(this.element.innerText);
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
        switch(block.type) {
            case EditorBlockType.AddHr:
                this.insertHr(range.range);
                this.container.emit(EVENT_EDITOR_CHANGE);
                break;
            case EditorBlockType.AddText:
                break;
            case EditorBlockType.Indent:
                this.insertIndent(range.range);
                this.container.emit(EVENT_EDITOR_CHANGE);
                return;
            case EditorBlockType.Outdent:
                this.insertOutdent(range.range);
                this.container.emit(EVENT_EDITOR_CHANGE);
                return;
            case EditorBlockType.AddLineBreak:
                this.insertLineBreak(range.range);
                this.container.emit(EVENT_EDITOR_CHANGE);
                break;
            case EditorBlockType.AddImage:
                this.insertImage(block as any, range.range);
                this.container.emit(EVENT_EDITOR_CHANGE);
                break;
            case EditorBlockType.AddTable:
                this.insertTable(block as any, range.range);
                this.container.emit(EVENT_EDITOR_CHANGE);
                break;
            case EditorBlockType.AddVideo:
                this.insertVideo(block as any, range.range);
                this.container.emit(EVENT_EDITOR_CHANGE);
                break;
            case EditorBlockType.AddLink:
                this.insertLink(block as any, range.range);
                this.container.emit(EVENT_EDITOR_CHANGE);
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
    }

    private insertIndent(range: Range) {
        const items: Node[] = [];
        this.eachRangeParentNode(range, node => {
            if (this.isBlockNode(node) || node.parentNode === this.element) {
                items.push(node);
                return true;
            }
        });
        for (const item of items) {
            let node: HTMLElement = item as any;
            if (!this.isBlockNode(node)) {
                const p = document.createElement(this.container.option.blockTag);
                p.appendChild(node.cloneNode(true));
                this.element.replaceChild(p, node);
                node = p;
            }
            const style = window.getComputedStyle(node);
            node.style.marginLeft = parseFloat(style.marginLeft.replace('px', '')) + 20 + 'px';
        }
    }

    private insertOutdent(range: Range) {
        this.eachRangeParentNode(range, node => {
            if (!this.isBlockNode(node)) {
                return;
            }
            const ele = node as HTMLDivElement;
            const style = window.getComputedStyle(ele);
            const padding = parseFloat(style.marginLeft.replace('px', '')) - 20;
            ele.style.marginLeft = Math.max(0, padding) + 'px';
            return true;
        });
    }

    private insertTable(block: IEditorTableBlock, range: Range) {
        const table = document.createElement('table');
        table.style.width = '100%';
        const tbody = table.createTBody();
        const tdWidth = 100 / block.column + '%';
        for (let i = 0; i < block.row; i++) {
            const tr = document.createElement('tr');
            for (let j = 0; j < block.column; j++) {
                const td = document.createElement('td');
                td.appendChild(document.createElement('br'));
                td.style.width = tdWidth;
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
        this.insertElement(table, range);
    }

    private insertImage(block: IEditorFileBlock, range: Range) {
        const image = document.createElement('img');
        image.src = block.value;
        image.title = block.title || '';
        this.insertElement(image, range);
    }

    private insertVideo(block: IEditorVideoBlock, range: Range) {
       
    }

    private insertFile(block: IEditorFileBlock, range: Range) {
       
    }

    private insertLink(block: IEditorLinkBlock, range: Range) {
        const link = document.createElement('a');
        link.href = block.value;
        link.text = block.title;
        if (block.target) {
            link.target = '_blank';
        }
        this.insertElement(link, range);
        this.selectNode(link);
    }

    
    private insertLineBreak(range: Range) {
        const p = document.createElement(this.container.option.blockTag);
        if (range.startContainer === this.element) {
            p.appendChild(document.createElement('br'));
            this.insertToChildIndex(p, range.startContainer, range.startOffset);
            this.selectNode(p);
            return;
        }
        this.eachBlockNext(range, node => {
            p.appendChild(node);
        });
        p.appendChild(document.createElement('br'));
        this.removeRange(range);
        // this.insertElement(p, range);
        let next: Node;
        let done = false;
        this.eachParentNode(range.startContainer, node => {
            if (this.isBlockNode(node) && node) {
                this.insertAfter(p, node);
                next = undefined;
                done = true;
                return false;
            }
            next = node;
        });
        if (!done) {
            if (next) {
                this.insertAfter(p, next);
            } else {
                this.element.appendChild(p);
            }
        }
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

    private bindEvent() {
        this.element.addEventListener('keydown', e => {
            this.container.saveSelection();
            this.container.emit(EVENT_INPUT_KEYDOWN, e);
            this.container.emit(EVENT_CLOSE_TOOL);
        });
        this.element.addEventListener('keyup', () => {
            if (this.isComposition) {
                return;
            }
            const range = this.selection.range;
            if (this.isEmptyLine(range)) {
                this.container.emit(EVENT_SHOW_ADD_TOOL, this.getNodeOffset(range.startContainer).y);
                return;
            }
        });
        this.element.addEventListener('compositionstart', () => {
            this.isComposition = true;
            // this.container.saveSelection();
        });
        this.element.addEventListener('compositionend', () => {
            this.isComposition = false;
            this.container.saveSelection();
            this.container.emit(EVENT_SELECTION_CHANGE);
            this.container.emit(EVENT_EDITOR_CHANGE);
        });
        this.element.addEventListener('mouseup', () => {
            this.container.saveSelection();
            this.container.emit(EVENT_SELECTION_CHANGE);
            // console.log([this.selectedValue]);
        });
        this.element.addEventListener('mouseenter', e => {
            if (!e.target) {
                return;
            }
            if (e.target instanceof HTMLHRElement) {
                if (e.target.previousSibling instanceof HTMLHRElement) {
                    this.selectNode(e.target);
                    this.container.emit(EVENT_SHOW_LINE_BREAK_TOOL, this.getNodeOffset(e.target.previousSibling));
                }
            }
        });
        this.element.addEventListener('mousemove', e => {
            // this.container.saveSelection();
            if (!e.target) {
                return;
            }
            if (e.target instanceof HTMLTableCellElement) {
                const td = e.target;
                const x = e.offsetX;
                if (x > 0 && x < 4 && td.previousSibling) {
                    td.style.cursor = 'col-resize';
                    return;
                } else if (td.nextSibling && x > td.clientWidth - 4) {
                    td.style.cursor = 'col-resize';
                    return;
                } else {
                    td.style.cursor = 'auto';
                }
            }
        });
        this.element.addEventListener('mousedown', e => {
            if (!e.target) {
                return;
            }
            if (e.target instanceof HTMLTableCellElement) {
                const td = e.target;
                const x = e.offsetX;
                if (x > 0 && x < 4 && td.previousSibling) {
                    this.moveTableCol(td.previousSibling as any);
                    return;
                } else if (td.nextSibling && x > td.clientWidth - 4) {
                    this.moveTableCol(td);
                    return;
                }
            }
        });
        this.element.addEventListener('touchend', () => {
            this.container.saveSelection();
        });
        this.element.addEventListener('click', e => {
            this.container.saveSelection();
            if (e.target instanceof HTMLImageElement) {
                const img = e.target as HTMLImageElement;
                this.selectNode(img);
                this.container.emit(EVENT_SHOW_IMAGE_TOOL, this.getNodeBound(img), data => this.updateNode(img, data));
                return;
            }
            const range = this.selection.range;
            if (this.isInBlock(range)) {
                return;
            }
            if (this.isEmptyLine(range)) {
                this.container.emit(EVENT_SHOW_ADD_TOOL, this.getNodeOffset(range.startContainer).y);
                return;
            }
            this.container.emit(EVENT_INPUT_CLICK);
            this.container.emit(EVENT_CLOSE_TOOL);
        });
        this.element.addEventListener('blur', () => {
            this.container.saveSelection();
            this.container.emit(EVENT_INPUT_BLUR);
        });
    }

    private moveTableCol(node: HTMLTableCellElement) {
        const table: HTMLTableElement = node.closest('table');
        if (!table) {
            return;
        }
        const base = this.element.getBoundingClientRect();
        const rect = table.getBoundingClientRect();
        const nodeRect = node.getBoundingClientRect();
        const x = nodeRect.x + nodeRect.width - base.x;
        this.container.emit(EVENT_SHOW_COLUMN_TOOL, <IBound>{
            x,
            y: table.offsetTop,
            width: 0,
            height: rect.height,
        }, (data: IBound) => {
            const cellIndex = node.cellIndex + node.colSpan;
            const pre = (data.x - x) * 100 / rect.width;
            for (let i = 0; i < table.rows.length; i++) {
                const tr = table.rows[i];
                for (let j = 0; j < tr.cells.length; j++) {
                    const cell = tr.cells[j];
                    if (cell.cellIndex + cell.colSpan === cellIndex) 
                    {
                        cell.style.width = parseFloat(cell.style.width.replace('%', '')) + pre + '%';
                        const next = tr.cells[j + 1];
                        next.style.width = parseFloat(next.style.width.replace('%', '')) - pre + '%';
                    }
                }
            }
        });
    }

    private updateNode(node: HTMLElement, data: IEditorBlock) {
        if (data.type === EditorBlockType.NodeResize) {
            const bound = data as IEditorResizeBlock;
            node.style.width = bound.width + 'px';
            node.style.height = bound.height + 'px';
        }
    }

    /**
     * 遍历选中的所有元素，最末端的元素，无子元素
     * @param range 
     * @param cb 
     */
    private eachRange(range: Range, cb: (node: Node) => void|false) {
        const begin = range.startContainer;
        const end = range.endContainer;
        if (cb(begin) === false) {
            return;
        }
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
            if (cb(next) === false) {
                break;
            }
            current = next;
        }
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

    private insertToChildIndex(newEle: HTMLElement, parent: Node, index: number) {
        if (parent.childNodes.length <= index) {
            parent.appendChild(newEle);
            return;
        }
        parent.insertBefore(newEle, parent.childNodes[index]);
    }

    private insertAfter(newEle: HTMLElement, node: Node) {
        const parent = node.parentNode;
        if (node.nextSibling) {
            parent.insertBefore(newEle, node.nextSibling);
            return;
        }
        parent.appendChild(newEle);
    }

    private removeRange(range: Range) {
        if (range.startContainer === range.endContainer) {
            if (range.startOffset > 0 && (range.startContainer instanceof Text)) {
                range.startContainer.textContent = range.startContainer.textContent.substring(0, range.startOffset);
            } else if (range.startContainer !== this.element) {
                range.startContainer.parentNode.removeChild(range.startContainer);
            }
            return
        }
        const beginParentItems: Node[] = [];
        this.eachParentNode(range.startContainer, node => {
            beginParentItems.push(node);
        });
        this.eachParentNode(range.endContainer, node => {
            if (beginParentItems.indexOf(node) < 0) {
                const parent = node.parentNode;
                this.eachBrother(node, item => {
                    if (beginParentItems.indexOf(item) >= 0) {
                        return false;
                    }
                    parent.removeChild(item);
                }, false);
                return;
            }
            return false;
        });

    }

    private indexOfNode(items: NodeListOf<Node>, find: Node): number {
        for (let i = 0; i < items.length; i++) {
            if (items[i] === find) {
                return i;
            }
        }
        return -1;
    }

    private eachBrother(node: Node, cb: (node: Node) => false|void, isNext = true) {
        if (!node.parentNode) {
            return;
        }
        let found = isNext;
        const parent = node.parentNode;
        for (let i = parent.children.length - 1; i >= 0; i--) {
            const item = parent.children[i];
            if (item === node) {
                if (cb(item) === false) {
                    break;
                }
                if (isNext) {
                    break;
                }
                found = true;
            }
            if (found && cb(item) === false) {
                break;
            }
        }
    }

    private eachBlockNext(range: Range, cb: (node: Node) => void) {
        if (range.endContainer === this.element) {
            return;
        }
        if (range.endOffset < 1) {
            cb(range.endContainer);
        } else if (range.endContainer instanceof Text && range.endContainer.length > range.endOffset) {
            cb(range.endContainer.splitText(range.endOffset));
        }
        let node = range.endContainer;
        while (true) {
            if (!node.nextSibling) {
                if (this.element === node.parentNode || this.isBlockNode(node.parentNode)) {
                    break;
                }
                node = node.parentNode;
                continue;
            }
            node = node.nextSibling;
            if (node.nodeName === 'BR' || this.isBlockNode(node)) {
                break;
            }
            cb(node);
        }
    }

    private isBlockNode(node: Node) {
        return node.nodeName === 'P' || node.nodeName === 'DIV';
    }

    /**
     * 判断当前是否是在某一个特殊的范围内
     * @param range 
     * @returns 
     */
    private isInBlock(range: Range): boolean {
        const linkTag = ['A'];
        const tableTag = ['TABLE', 'TD', 'TR', 'TH'];
        let event: keyof IEditorListeners|undefined;
        this.eachParentNode(range.startContainer, node => {
            if (linkTag.indexOf(node.nodeName) >= 0) {
                event = EVENT_SHOW_LINK_TOOL;
                return false;
            }
            if (tableTag.indexOf(node.nodeName) >= 0) {
                event = EVENT_SHOW_TABLE_TOOL;
                return false;
            }
        });
        if (event) {
            this.container.emit(event, this.getNodeOffset(range.startContainer));
        }
        return !!event;
    }

    /**
     * 获取当前作用的样式
     * @param node 
     * @returns 
     */
    private getNodeStyle(node: Node): string[] {
        const styleTag = ['B', 'EM', 'I', 'STRONG'];
        const items = [];
        this.eachParentNode(node, cur => {
            if (styleTag.indexOf(cur.nodeName) >= 0) {
                items.push(cur.nodeName);
            }
        });
        return items;
    }

    private eachParentNode(node: Node, cb: (node: Node) => void|false) {
        let current = node;
        while (true) {
            if (current === this.element) {
                break;
            }
            if (cb(current) === false) {
                break;
            }
            current = current.parentNode;
        }
    }

    /**
     * 循环遍历选中项的父元素
     * @param range 
     * @param cb 返回 true中断某一个子元素的父级查找， 返回false 中断整个查找
     */
    private eachRangeParentNode(range: Range, cb: (node: Node) => void|boolean) {
        const exist: Node[] = [];
        this.eachRange(range, node => {
            let isEnd = false;
            this.eachParentNode(node, cur => {
                if (exist.indexOf(cur) >= 0) {
                    return false;
                }
                const res = cb(cur);
                if (typeof res !== 'boolean') {
                    return;
                }
                if (res === false) {
                    isEnd = true;
                }
                return false;
            });
            if (isEnd) {
                return false;
            }
        });
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

    private getNodeOffset(node: Node):IPoint {
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
        // rect = elem.getBoundingClientRect();
		// win = elem.ownerDocument.defaultView;
		// return {
		// 	    top: rect.top + win.pageYOffset,
		// 	    left: rect.left + win.pageXOffset
		// };
        return {
            y: (node as HTMLDivElement).offsetTop,
            x: (node as HTMLDivElement).offsetLeft
        };
    }

    private getNodeBound(node: Node): IBound {
        if (node.nodeType !== 1) {
            node = node.parentNode;
        }
        if (node === this.element) {
            const style = getComputedStyle(this.element);
            return {
                x: parseFloat(style.getPropertyValue('padding-left')),
                y: parseFloat(style.getPropertyValue('padding-top')),
                width: 0,
                height: 0,
            };
        }
        const ele = node as HTMLDivElement;
        const rect = ele.getBoundingClientRect();
        return {
            y: ele.offsetTop,
            x: ele.offsetLeft,
            width: rect.width,
            height: rect.height
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