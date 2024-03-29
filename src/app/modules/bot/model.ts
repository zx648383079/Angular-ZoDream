import { IItem } from '../../theme/models/seo';

export const BotInstanceKey = 'bot';

export const PlatformTypeItems: IItem[] = [
    {name: '微信公众号', value: 0},
];

export const EventItems: IItem[] = [
    {name: '默认回复', value: 'default'},
    {name: '消息回复', value: 'message'},
    {name: '关注', value: 'subscribe'},
    {name: '菜单事件', value: 'menuclick'},
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

export const MenuTypeItems: IItem[] = [
    ...EditorTypeItems,
    {name: '扫码', value: 20},
    {name: '上传图片', value: 21},
    {name: '拍照', value: 22},
    {name: '发送定位', value: 23},
];

export const MediaTypeItems: IItem[] = [
    {name: '图片', value: 'image'},
    {name: '语音', value: 'voice'},
    {name: '视频', value: 'video'},
    {name: '缩略图', value: 'thumb'},
    {name: '图文', value: 'news'},
]

export interface IBotAccount {
    id: number;
    name: string;
    platform_type: number;
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

export interface IBotReply {
    id?:         number;
    bot_id?:        number;
    event:      string;
    keywords?:   string;
    match:      number;
    content:    any;
    type:       number;
    updated_at?: string;
    created_at?: string;
    status:     number;
}

export interface IBotMenuItem {
    id?:         number;
    bot_id?:        number;
    name:       string;
    type:       number;
    content:    any;
    parent_id?:  number;
    updated_at?: string;
    created_at?: string;
    children?: IBotMenuItem[];
    open?: boolean;
}

export interface IBotMedia {
    id:            number;
    bot_id:           number;
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
    publish_status: number;
    publish_id: string;
    account?: IBotAccount;
}

export interface IBotReplyTemplate {
    id:          number;
    bot_id:         number;
    template_id: string;
    title:       string;
    content:     string;
    example:     string;
    status?: number;
}

export interface IBotReplyTemplateField {
    name?: string;
    value?: string;
    color?: string;
}


export interface IBotTemplate {
    id:         number;
    type:       number;
    category:   number;
    name:       string;
    content:    string;
    updated_at: string;
    created_at: string;
    html?: any;
}

export interface IBotTemplateCategory {
    id: number;
    name: string;
    parent_id?: number;
    level?: number;
}

export interface IBotQr {
    id:          number;
    bot_id:         number;
    type:        number;
    scene_type: number;
    scene_str:   string;
    scene_id:    number;
    expire_time: number;
    qr_url:      string;
    url:         string;
    updated_at:  string;
    created_at:  string;
    name:        string;
}

export interface IBotUser {
    id: number;
    bot_id: number;
    openid:         string;
    nickname:       string;
    sex:            number;
    city:           string;
    country:        string;
    province:       string;
    language:       string;
    avatar:         string;
    subscribe_time: number;
    union_id:       string;
    remark:         string;
    group_id:       number;
    note_name:     string;
    status:     number;
    is_black:   number;
    updated_at:     string;
    created_at:     string;
    group?: IBotUserGroup;
}

export interface IBotUserGroup {
    id: number;
    bot_id: number;
    name: string;
    tag_id: string;
}


export interface IBotMessageHistory {
    id: number;
    bot_id: number; // 所属微信公众号ID
    type: number;
    item_type: number; // 发送类型
    item_id: number; //相应规则ID
    from: string; // 请求用户ID
    to: string; // 相应用户ID
    content: string; // 消息体内容
    is_mark?: boolean;
    created_at: string; // 创建时间
    from_user?: IBotUser;
    to_user?: IBotUser;
}