import { IItem } from '../theme/models/seo';

export const EventItems: IItem[] = [
    {name: '默认回复', value: 'default'},
    {name: '消息回复', value: 'message'},
    {name: '关注', value: 'subscribe'},
    {name: '菜单事件', value: 'CLICK'},
];

export const EditorTypeItems: IItem[] = [
    {name: '文本', value: 0},
    {name: '媒体素材', value: 1},
    {name: '图文', value: 2},
    {name: '模板消息', value: 3},
    {name: '事件', value: 4},
    {name: '网址', value: 5},
    {name: '小程序', value: 6},
    {name: '场景', value: 7},
];

export const MediaTypeItems: IItem[] = [
    {name: '图片', value: 'image'},
    {name: '语音', value: 'voice'},
    {name: '视频', value: 'video'},
    {name: '缩略图', value: 'thumb'},
    {name: '图文', value: 'news'},
]

export interface IWeChatAccount {
    id: number;
    name: string;
    token:        string;
    access_token: string;
    account:      string;
    original:     string;
    type:         number;
    appid:        string;
    secret:       string;
    aes_key:      string;
    avatar:       string;
    qrcode:       string;
    address:      string;
    description:  string;
    username:     string;
    password:     string;
    status:       number;
    updated_at:   string;
    created_at:   string;
}

export interface IWeChatReply {
    id?:         number;
    wid?:        number;
    event:      string;
    keywords?:   string;
    match:      number;
    content:    any;
    type:       number;
    updated_at?: string;
    created_at?: string;
    status:     number;
}

export interface IWeChatMenuItem {
    id?:         number;
    wid?:        number;
    name:       string;
    type:       number;
    content:    any;
    parent_id?:  number;
    updated_at?: string;
    created_at?: string;
    children?: IWeChatMenuItem[];
    open?: boolean;
}

export interface IWeChatMedia {
    id:            number;
    wid:           number;
    type:          string;
    material_type: number;
    title:         string;
    thumb:         string;
    show_cover:    number;
    open_comment:  number;
    only_comment:  number;
    content:       string;
    parent_id:     number;
    media_id:      string;
    url:           string;
    expired_at:    number;
    updated_at:    string;
    created_at:    string;
    account?: IWeChatAccount;
}

export interface IWeChatTemplate {
    id:         number;
    type:       number;
    category:   number;
    name:       string;
    content:    string;
    updated_at: string;
    created_at: string;
    html?: any;
}



