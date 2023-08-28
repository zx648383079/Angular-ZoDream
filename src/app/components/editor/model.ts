import { IPoint } from '../../theme/utils/canvas';
import { IEditorModule } from './base';

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
    open(data: T, cb: EditorModalCallback<T>, position?: IPoint): void;
}

/**
 * 共享型弹窗，需要提前进行预配置
 */
export interface IEditorSharedModal<T = any> extends IEditorModal<T> {
    modalReady(module: IEditorModule): void;
}

export enum EditorBlockType {
    AddLineBreak = 'addLineBreak',
    AddHr = 'addHr',
    AddText = 'addText',
    AddRaw = 'addRaw',
    AddImage = 'addImage',
    AddLink = 'addLink',
    AddTable = 'addTable',
    AddVideo = 'addVideo',
    AddFile = 'addFile',
    AddCode = 'addCode',
    AddData = 'addData',
    H = 'h',
    Bold = 'bold',
    Italic = 'italic',
    Underline = 'underline',
    Strike = 'strike',
    Wavyline = 'wavyline',
    Dashed = 'dashed',
    Sub = 'sub',
    Sup = 'sup',
    FontSize = 'fontSize',
    FontFamily = 'fontFamily',
    Background = 'background',
    Foreground = 'foreground',
    ClearStyle = 'clearStyle',
    Align = 'align',
    List = 'list',
    Blockquote = 'blockquote',

    Thead = 'thead',
    TFoot = 'tfoot',
    DeleteTable = 'delTable',
    RowSpan = 'rowSpan',
    ColSpan = 'colSpan',

    OpenLink = 'openLink',
    Indent = 'indent',
    Outdent = 'outdent',
    NodeResize = 'nodeResize',
    NodeMove = 'nodeMove',
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
