import { IEditorBlock, IEditorRange } from '../model';
import { IEditorListeners } from './event';
import { EditorOptionManager, IEditorTool } from './option';

export interface IEditorContainer {

    get option(): EditorOptionManager;

    get value(): string;
    set value(v: string);


    insertBlock(block: IEditorBlock|string, range?: IEditorRange): void;
    execute(module: string|IEditorTool, range?: IEditorRange, data?: any): void;
    saveSelection(): void;
    undo(): void;
    redo(): void;

    on<E extends keyof IEditorListeners>(event: E, listener: IEditorListeners[E]): IEditorContainer;
    on(event: string, cb: any): IEditorContainer;
    emit<E extends keyof IEditorListeners>(event: E, ...eventObject: Parameters<IEditorListeners[E]>): this;
    emit(event: string, ...items: any[]): IEditorContainer;
    off(...events: any[]): IEditorContainer;
}