import { IItem } from '../../models/seo';

export type FormatFunc = (value: string, name: string, data: ITableHeaderItem) => string;
export type CompareFunc = (a: any, b: any) => number;

export interface ITableHeaderItem {
    name: string;
    label?: string;
    asc?: boolean;
    searchable?: boolean;
    inputType?: string;
    optionItems?: IItem[];
    editable?: boolean;
    format?: string|FormatFunc;
    hidden?: boolean;
    compare?: CompareFunc;
}

export interface IColumnLink {
    name: string;
    label: string;
    index: number;
    value?: any;
    searchable?: boolean;
    inputType?: string;
    optionItems?: IItem[];
    editable?: boolean;
    format?: string|FormatFunc;
}