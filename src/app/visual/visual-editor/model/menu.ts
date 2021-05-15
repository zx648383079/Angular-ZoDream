import { IMenuItem } from '../../../context-menu';

export const EditorNotSelected: IMenuItem[]  = [
    {
        name: '粘贴',
        icon: 'icon-paste'
    },
];

export const EditorSelected: IMenuItem[]  = [
    {
        name: '复制',
        icon: 'icon-copy'
    },
    {
        name: '剪切',
        icon: 'icon-cut'
    },
    {},
    {
        name: '组合',
        icon: 'icon-zuhe',
        disable: true,
    },
    {
        name: '打散',
        icon: 'icon-quxiaozuhe',
        disable: true,
    },
    {},
    {
        name: '置顶',
        icon: 'icon-chevron-up',
    },
    {
        name: '置底',
        icon: 'icon-chevron-down',
    },
    {},
    {
        name: '删除',
        icon: 'icon-trash',
    },
];


export const EditorLayer: IMenuItem[] = [
    {
        icon: 'icon-copy',
        name: '复制',
    },
    {},
    {
        icon: 'icon-trash',
        name: '删除',
    },
];