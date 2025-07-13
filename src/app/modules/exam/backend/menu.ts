import { INavLink } from '../../../theme/models/seo';

export const ExamBackendMenu: INavLink[] = [
    {
        name: '题库管理',
        icon: 'icon-edit',
        url: './',
        role: 'exam_manage',
        children: [
            {
                name: '题库列表',
                label: '题',
                url: './question',
            },
            {
                name: '科目列表',
                label: '科',
                url: './course',
            },
            {
                name: '素材列表',
                label: '素',
                url: './material',
            },
            {
                name: '试卷列表',
                label: '卷',
                url: './page',
            },
            {
                name: '晋级列表',
                label: '级',
                url: './upgrade',
            },
        ],
    },
];
