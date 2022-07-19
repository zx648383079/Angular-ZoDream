import { IEditorRange } from '../model';

export interface IEditorElement {

    get selection(): IEditorRange;

    set selection(v: IEditorRange);

    get selectedValue(): string;

    set selectedValue(v: string);

    get value(): string;

    set value(v: string);

    insert(val: string): void;

    focus(): void;
}