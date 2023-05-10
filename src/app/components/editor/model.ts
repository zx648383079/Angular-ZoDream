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

export interface IEditorBlock {

}

export interface IHtmlEditorOption {
    key: string;
    init: Partial<EditorOptions>;
}