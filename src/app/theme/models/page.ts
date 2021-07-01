export interface IPaging {
    limit: number;
    offset: number;
    total: number;
    more: boolean;
}

export interface IPage<T> {
    paging: IPaging;
    data: T[];
    filter?: IFilter[];
}

export interface IFilter {
    name: string;
    label: string;
    items: {
        label: string;
        value: any;
        selected?: boolean;
    }[];
}

export interface IBaseResponse {
    appid?: string;
    sign?: string;
    sign_type?: string;
    timestamp?: string;
    encrypt?: string;
    encrypt_type?: string;
    message?: string;
}

export interface IData<T> extends IBaseResponse {
    data?: T[];
}

export interface IDataOne<T> extends IBaseResponse {
    data?: T;
}

export interface IErrorResponse {
    [key: string]: any;
    code: number;
    message: string;
}

export interface IErrorResult {
    error: IErrorResponse;
}

export interface IPageQueries {
    [key: string]: any;
    page: number;
    per_page: number;
    keywords?: string;
    category?: number;
    parent?: number;
    user?: any;
}
