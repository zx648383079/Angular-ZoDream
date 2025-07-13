import { INavLink } from '../../../theme/models/seo';

export const NoteBackendMenu: INavLink[] = [
    {
        name: '便签管理',
        icon: 'icon-copy',
        url: './',
        role: 'note_manage',
        children: [
            {
                name: '便签列表',
                label: '列',
                url: './list',
            },
        ],
    },
];