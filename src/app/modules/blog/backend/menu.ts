import { INavLink } from '../../../theme/models/seo';

export const BlogBackendMenu: INavLink[] = [
    {
        name: '博客',
        icon: 'icon-file-text-o',
        url: './',
        role: 'blog_manage',
        children: [{
                name: '列表',
                label: '列',
                url: './list',
            },
            {
                name: '分类',
                label: '类',
                url: './category',
            },
            {
                name: '标签',
                label: '签',
                url: './tag',
            },
            {
                name: '评论',
                label: '评',
                url: './comment',
            }
        ]
    },
];
