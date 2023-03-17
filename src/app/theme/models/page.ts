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
    multiple?: boolean;
    min?: number;
    max?: number;
    items: IFilterOptionItem[];
}

export interface IFilterOptionItem {
    label: string;
    value: any;
    selected?: boolean;
    count?: number;
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

export interface IPageQueries extends Record<string, any> {
    page: number;
    per_page: number;
    keywords?: string;
    category?: number;
    parent?: number;
    user?: any;
    sort?: string;
    order?: string|boolean|number;
}

export interface IPageEditItem {
    /**
     * 是否选中
     */
    checked?: boolean;
    /**
     * 是否展开
     */
    toggled?: boolean;
}

export interface IPageBaeItem {
    id?: number;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
}