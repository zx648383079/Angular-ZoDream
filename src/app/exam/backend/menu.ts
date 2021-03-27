import { INav } from '../../theme/components';

export const ExamBackendMenu: INav[] = [
    {
        name: '题库管理',
        icon: 'icon-edit',
        url: './exam',
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
                name: '试卷列表',
                label: '卷',
                url: './exam/page',
            },
        ],
    },
];
