export interface IBlockItem {
    [key: string]: any;
    content: string;
    type?: number;
    user?: number; // 2
    topic?: number; // 3
    link?: string; // 4
    image?: string; // 1
    file?: string; // 5
}

export interface IExtraRule {
    [key: string]: any;
    s: string;    // 字符串
    i?: string;   // 图片链接
    u?: number;   // 用户id
    t?: number;   // 话题id
    l?: string;   // 链接
}