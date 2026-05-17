import { IPoint } from '../../theme/utils/canvas';
import { IEditorModule } from './base';

export interface IEditor {
    execute(block: IEditorCommand|string): void;
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

export enum EditorCommandType {
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
    AddFrame = 'addFrame',
    Heading = 'heading',
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
    NodeRemove = 'nodeRemove',
}

export interface IEditorCommand {
    [key: string]: any;
    type: EditorCommandType;
}

export interface IEditorValueCommand extends IEditorCommand {
    value: string,
}

export interface IEditorSizeCommand extends IEditorCommand {
    width: string|number;
    height: string|number;
}

export interface IEditorResizeCommand extends IEditorSizeCommand {
    x: number;
    y: number;
}

export interface IEditorTableCommand extends IEditorCommand {
    row: number;
    column: number;
}

export interface IEditorVideoCommand extends IEditorCommand {
    code: string;
    value: string;
    autoplay: boolean;
}

export interface IEditorFileCommand extends IEditorValueCommand {
    title: string,
    size: number;
}

export interface IEditorLinkCommand extends IEditorValueCommand {
    title: string,
    target: boolean;
}

export interface IEditorCodeCommand extends IEditorValueCommand {
    language: string;
}

export interface IEditorTextCommand extends IEditorValueCommand {
    cursor?: number; // 移动指针
}
export interface IEditorInclueCommand extends IEditorCommand {
    begin: string,
    end: string;
    cursor?: number; // 移动指针
}
