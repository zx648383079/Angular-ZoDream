import { EditorOptions } from 'tinymce';

export interface IEditor {
    /**
     * 插入图片
     * @param file 
     * @param name 
     */
    insertImage(file: string, name?: string): void;

    /**
     * 插入链接
     * @param text 
     * @param href 
     */
    insertLink(text: string, href: string): void;
    /**
     * 插入字符
     * @param val 
     * @param move 
     * @param focus 
     */
    insert(val: string, move?: number, focus?: boolean): void;
}

export interface IImageUploadEvent {
    files: FileList;
    target: IEditor;
}

export interface IEditorRange {
    start: number;
    end: number;
    range?: Range;
}

export type EditorModalCallback<T = any> = (data: T) => void;

export interface IEditorModal<T = any> {
    open(data: T, cb: EditorModalCallback<T>): void;
}

export enum EditorBlockType {
    AddLineBreak,
    AddHr,
    AddText,
    AddImage,
    Bold,
    Indent,
}

export interface IEditorBlock {
    [key: string]: any;
    type: EditorBlockType;
}

export interface IHtmlEditorOption {
    key: string;
    init: Partial<EditorOptions>;
}