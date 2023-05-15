import { EditorOptions } from 'tinymce';

export interface IEditor {
    insert(block: IEditorBlock|string): void;
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
    AddLink,
    AddTable,
    AddVideo,
    AddFile,
    AddCode,
    Bold,
    Indent,
    Outdent,
    NodeResize,
    NodeMove,
}

export interface IEditorBlock {
    [key: string]: any;
    type: EditorBlockType;
}

export interface IEditorValueBlock extends IEditorBlock {
    value: string,
}

export interface IEditorSizeBlock extends IEditorBlock {
    width: string|number;
    height: string|number;
}

export interface IEditorResizeBlock extends IEditorSizeBlock {
    x: number;
    y: number;
}

export interface IEditorTableBlock extends IEditorBlock {
    row: number;
    column: number;
}

export interface IEditorVideoBlock extends IEditorBlock {
    code: string;
    value: string;
    autoplay: boolean;
}

export interface IEditorFileBlock extends IEditorValueBlock {
    title: string,
    size: number;
}

export interface IEditorLinkBlock extends IEditorValueBlock {
    title: string,
    target: boolean;
}

export interface IEditorCodeBlock extends IEditorValueBlock {
    language: string;
}

export interface IEditorTextBlock extends IEditorValueBlock {
    cursor?: number; // 移动指针
}
export interface IEditorInclueBlock extends IEditorBlock {
    begin: string,
    end: string;
    cursor?: number; // 移动指针
}

export interface IHtmlEditorOption {
    key: string;
    init: Partial<EditorOptions>;
}