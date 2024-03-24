import { eachObject } from '../../../theme/utils';

export class EditorHelper {
    public static fileType(file: File): 'image'|'video'|'file' {
        if (file.type.indexOf('image') >= 0) {
            return 'image';
        }
        if (file.type.indexOf('video') >= 0) {
            return 'video';
        }
        return 'file';
    }

    public static height(node: HTMLElement): number {
        return node.offsetHeight;
    }

    public static css(node: HTMLElement, style: any) {
        eachObject(style, (val, key) => {
            node.style[key] = val;
        });
    }

    /**
    * 在内部前面添加子节点
    * @param current 
    * @param items 
    */
    public static insertFirst(current: Node, ...items: Node[]) {
        if (current.childNodes.length < 1) {
            this.insertLast(current, ...items);
            return;
        }
        this.insertBefore(current.childNodes[0], ...items);
    }

    /**
    * 在子节点最后添加元素
    * @param current 
    * @param items 
    */
    public static insertLast(current: Node, ...items: Node[]) {
        for (const item of items) {
            current.appendChild(item);
        }
    }

    /**
    * 在元素之前添加兄弟节点
    * @param current 
    * @param items 
    */
    public static insertBefore(current: Node, ...items: Node[]) {
        const parent = current.parentNode;
        for (const item of items) {
            parent.insertBefore(item, current);
        }
    }

    /**
    * 在元素之后添加兄弟节点
    * @param current 
    * @param items 
    * @returns 
    */
    public static insertAfter(current: Node, ...items: Node[]) {
        if (current.nextSibling) {
            this.insertBefore(current.nextSibling, ...items);
            return;
        }
        this.insertLast(current.parentNode, ...items);
    }

    /**
    * 替换节点为
    * @param node 
    * @param newNode 
    * @param removeFn 删除旧节点还是移动
    * @returns 
    */
    public static replaceNode<T extends Node>(node: Node, newNode: T, removeFn?: (node: T) => void): void;
    public static replaceNode(node: Node, newNode: Node[]): void;
    public static replaceNode(node: Node, newNode: Node[]|Node, removeFn?: Function) {
        const target = newNode instanceof Array ? newNode : [newNode];
        const fn = () => {
            if (removeFn) {
                removeFn(newNode);
                return;
            }
            this.removeNode(node);
        };
        let borther = node.previousSibling;
        if (borther) {
            fn();
            this.insertAfter(borther, ...target);
            return;
        }
        borther = node.nextSibling;
        if (borther) {
            fn();
            this.insertBefore(borther, ...target);
            return;
        }
        const parent = node.parentNode;
        fn();
        this.insertLast(parent, ...target);
        return;
    }

    /**
    * 删除节点
    * @param node 
    * @returns 
    */
    public static removeNode(node: Node) {
        if (!node || !node.parentNode) {
            return;
        }
        node.parentNode.removeChild(node);
    }

    public static splitNodeRange(node: Node, range: Range): Node[];
    public static splitNodeRange(node: Node, begin: number): Node[];
    public static splitNodeRange(node: Node, begin: number, end: number): Node[];
    public static splitNodeRange(node: Node, begin: Range|number, end: number = -1): Node[] {
        if (typeof begin === 'object') {
            end = node === begin.endContainer ? begin.endOffset : -1;
            begin = node === begin.startContainer ? begin.startOffset : 0;
        }
        if (begin === end) {
            return [];
        }
        if (node instanceof Text) {
            const len = node.length;
            if (begin > 0) {
                node = node.splitText(begin);
            }
            if (end > begin && end > 0 && end < len - 1) {
                (node as Text).splitText(end - begin);
            }
            return [node];
        }
        const count = end > begin && end > 0 && end < node.childNodes.length ? end + 1 : node.childNodes.length;
        let i = begin > 0 ? begin : 0;
        if (i <= 0 && count >= node.childNodes.length) {
            return [node];
        }
        const items = [];
        for (; i < count; i++) {
            items.push(node.childNodes[i]);
        }
        return items;
    }

    /**
    * 获取元素在兄弟中排第几
    * @param node 
    * @returns 
    */
    public static nodeIndex(node: Node): number {
        if (!node.parentNode) {
            return -1;
        }
        const parent = node.parentNode;
        for (let i = 0; i < parent.childNodes.length; i++) {
            if (parent.childNodes[i] === node) {
                return i;
            }
        }
        return -1;
    }
}