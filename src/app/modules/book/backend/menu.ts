import { INav } from '../../../theme/components';

export const BookBackendMenu: INav[] = [
    {
        name: '书籍管理',
        icon: 'icon-book',
        url: './',
        role: 'book_manage',
        children: [
            {
                name: '书籍管理',
                label: '书',
                url: './home'
            },
            {
                name: '分类管理',
                label: '类',
                url: './category'
            },
            {
                name: '作者管理',
                label: '作',
                url: './author'
            },
            {
                name: '书单管理',
                label: '单',
                url: './list'
            },
        ],
    }
];
