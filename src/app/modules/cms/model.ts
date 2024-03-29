import { IExtraRule } from '../../components/link-rule';
import { IPageTreeItem } from '../../theme/models/page';
import { IUser } from '../../theme/models/user';

export interface ICmsSite {
    id: number;
    title: string;
    keywords:    string;
    description: string;
    logo:        string;
    theme:       string;
    match_type:  number;
    match_rule:  string;
    is_default:  number;
    status:  number;
    language:  string;
    options:     any;
    updated_at:  string;
    created_at:  string;
}


export interface ICmsModel {
    id: number;
    name:              string;
    table:             string;
    type:              number;
    position:          number;
    child_model:       number;
    category_template: string;
    list_template:     string;
    show_template:     string;
    setting:           any;
}


export interface ICmsModelField {
    id: number;
    name:          string;
    field:         string;
    model_id:      number;
    type:          string;
    length:        number;
    position:      number;
    form_type:     number;
    is_main:       number;
    is_required:   number;
    is_search:     number;
    is_disable:    number;
    is_system:     number;
    match:         string;
    tip_message:   string;
    error_message: string;
    tab_name:      string;
    setting:       any;
}


export interface ICmsLinkage {
    id: number;
    name: string;
    type: number;
    code: string;
    language: string;
    data_count?: number;
}

export interface ICmsLinkageData {
    id: number;
    name: string;
    position: number;
    description:       string;
    thumb:             string;
    full_name?: string;
    parent_id: number;
    linkage_id: number;
    children_count?: number;
}

export interface ICmsGroup {
    id: number;
    name:        string;
    type:        number;
    description: string;
}

export interface ICmsCategory extends IPageTreeItem {
    id: number;
    name:              string;
    title:             string;
    type:              number;
    model_id:          number;
    parent_id:         number;
    keywords:          string;
    description:       string;
    thumb:             string;
    image:             string;
    content:           string;
    url:               string;
    position:          number;
    groups:            string;
    category_template: string;
    list_template:     string;
    show_template:     string;
    setting:           any;
    updated_at:        string;
    created_at:        string;
}

export interface ICmsContent {
    id: number;
    title: string;
    cat_id: number;
    model_id: number;
    parent_id: 0,
    user_id: number;
    keywords: string;
    thumb: string;
    description: string;
    status: number;
    view_count: number;
    comment_count: number;
    updated_at: number;
    created_at: number;
    category?: ICmsCategory;
    user?: IUser;
    form_data?: ICmsFormGroup[];
}

export interface ICmsComment {
    id: number;
    content?: string;
    parent_id: number;
    user: IUser;
    model_id: number;
    content_id: number;
    created_at?: string;
    agree_count?: number;
    disagree_count?: number;
    reply_count?: number;
    position?: number;
    children?: ICmsComment[];
    extra_rule?: IExtraRule[];
}

export interface ICmsFormGroup {
    name: string;
    active: boolean;
    items: ICmsFormInput[];
}

export interface ICmsFormInput {
    name: string;
    label: string;
    value: any;
    items?: string[];
    type: string;
}

export interface ICmsColumn {
    name: string;
    label: string;
}

export interface ICMSTheme {
    name:        string;
    description: string;
    author:      string;
    cover:       string;
}
