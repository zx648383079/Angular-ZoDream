export interface IEditorContainer {

    get value(): string;
    set value(v: string);

    on(event: string, cb: any);
    emit(event: string, ...items: any[]);
    off(...events: any[]);
}