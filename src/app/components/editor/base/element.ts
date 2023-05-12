import { IEditorBlock, IEditorRange } from '../model';

export interface IEditorElement {

    get selection(): IEditorRange;

    set selection(v: IEditorRange);

    get selectedValue(): string;

    set selectedValue(v: string);

    get value(): string;

    set value(v: string);

    get length(): number;
    get wordLength(): number;

    insert(block: IEditorBlock, range?: IEditorRange): void;

    focus(): void;

    blur(): void;
}