export interface IProject {
    id:          number;
    user_id:     number;
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

export interface IDocPage {
    id:         number;
    name:       string;
    type: number;
    project_id: number;
    version_id: number;
    parent_id:  number;
    content:    any;
    updated_at?: string;
    created_at?: string;
    children?: IDocPage[];
    expanded?: boolean;
}

export interface IDocApi {
    id:          number;
    name:        string;
    type: number;
    method:      string;
    uri:         string;
    project_id:  number;
    version_id:  number;
    description: string;
    parent_id:   number;
    updated_at?:  string;
    created_at?:  string;
    header?:      IApiField[];
    request?:     IApiField[];
    response?:    IApiField[];
    example?:     any;
    children?: IDocApi[];
    expanded?: boolean;
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


