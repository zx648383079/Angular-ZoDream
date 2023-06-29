import { IPageTreeItem } from '../../theme/models/page';

export interface ICategory extends IPageTreeItem {
    id: number;
    name: string;
    parent_id: number;
    children?: ICategory[];
    icon?: string;
    level?: number;
    count?: number;
}
export interface IProject {
    id:          number;
    user_id:     number;
    cat_id: number;
    name:        string;
    cover:       string;
    type:        number;
    description: string;
    environment: {
        name: string;
        title: string;
        domain: string;
    }[];
    status:      number;
    deleted_at:  number;
    updated_at:  string;
    created_at:  string;
}

export interface IProjectVersion {
    id:   number;
    name: string;
}

export interface IDocTreeItem {
    id:         number;
    name:       string;
    type: number;
    parent_id:  number;
    children?: IDocTreeItem[];
    expanded?: boolean;
}

export interface IDocPage extends IDocTreeItem {
    project_id: number;
    version_id: number;
    content:    any;
    updated_at?: string;
    created_at?: string;
    children?: IDocPage[];

}

export interface IDocApi extends IDocTreeItem {
    method:      string;
    uri:         string;
    project_id:  number;
    version_id:  number;
    description: string;
    updated_at?:  string;
    created_at?:  string;
    header?:      IApiField[];
    request?:     IApiField[];
    response?:    IApiField[];
    example?:     any;
    children?: IDocApi[];
}

export interface IApiField {
    id:            number;
    name:          string;
    title:         string;
    is_required:   number;
    default_value: string;
    mock:          string;
    parent_id:     number;
    api_id:        number;
    kind:          number;
    type:          string;
    remark:        string;
    updated_at:    string;
    created_at:    string;
    level?:        number;
    children?: IApiField[];
}


