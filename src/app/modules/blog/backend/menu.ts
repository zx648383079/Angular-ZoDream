import { INav } from '../../../theme/components';

export const BlogBackendMenu: INav[] = [
    {
        name: '博客',
        icon: 'icon-file-text-o',
        url: './blog',
        children: [{
                name: '列表',
                label: '列',
                url: './blog/list',
            },
            {
                name: '分类',
                label: '类',
                url: './blog/category',
                role: 'blog_term_edit',
            },
            {
                name: '标签',
                label: '签',
                url: './blog/tag',
            },
            {
                name: '评论',
                label: '评',
                url: './blog/comment',
            }
        ]
    },
];
