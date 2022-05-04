import { IMenuItem } from '../../../context-menu';
import { MENU_ACTION } from './action';

export const EditorNotSelected: IMenuItem[]  = [
    {
        name: '粘贴',
        icon: 'icon-paste',
        data: MENU_ACTION.PASTE
    },
];

export const EditorSelected = (canMerge = false, canSplit = false): IMenuItem[] => {
    return [
        {
            name: '复制',
            icon: 'icon-copy',
            data: MENU_ACTION.COPY
        },
        {
            name: '剪切',
            icon: 'icon-cut',
            data: MENU_ACTION.CUT
        },
        {},
        {
            name: '组合',
            icon: 'icon-zuhe',
            disable: !canMerge,
            data: MENU_ACTION.MERGE
        },
        {
            name: '打散',
            icon: 'icon-quxiaozuhe',
            disable: !canSplit,
            data: MENU_ACTION.SPLIT
        },
        {},
        {
            name: '置顶',
            icon: 'icon-chevron-up',
            data: MENU_ACTION.ZINDEX_TOP
        },
        {
            name: '置底',
            icon: 'icon-chevron-down',
            data: MENU_ACTION.ZINDEX_BOTTOM
        },
        {},
        {
            name: '删除',
            icon: 'icon-trash',
            data: MENU_ACTION.DELETE
        },
    ];
}


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