export interface IBlockItem {
    content: string;
    type?: number;
    user?: number; // 2
    topic?: number; // 3
    link?: string; // 4
    image?: string; // 1
}

export interface IExtraRule {
    s: string;    // 字符串
    i?: string;   // 图片链接
    u?: number;   // 用户id
    t?: number;   // 话题id
    l?: string;   // 链接
}