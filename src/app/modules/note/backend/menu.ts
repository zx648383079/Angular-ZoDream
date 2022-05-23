import { INav } from '../../../theme/components';

export const NoteBackendMenu: INav[] = [
    {
        name: '便签管理',
        icon: 'icon-copy',
        url: './note',
        role: 'note_manage',
        children: [
            {
                name: '便签列表',
                label: '列',
                url: './note/list',
            },
        ],
    },
];