import { INav } from '../../theme/components';

export const ExamBackendMenu: INav[] = [
    {
        name: '题库管理',
        icon: 'icon-edit',
        url: './exam',
        role: 'exam_manage',
        children: [
            {
                name: '题库列表',
                label: '题',
                url: './exam/question',
            },
            {
                name: '科目列表',
                label: '科',
                url: './exam/course',
            },
            {
                name: '素材列表',
                label: '素',
                url: './exam/material',
            },
            {
                name: '试卷列表',
                label: '卷',
                url: './exam/page',
            },
            {
                name: '晋级列表',
                label: '级',
                url: './exam/upgrade',
            },
        ],
    },
];
