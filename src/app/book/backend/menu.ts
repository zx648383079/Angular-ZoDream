import { INav } from '../../theme/components';

export const BookBackendMenu: INav[] = [
    {
        name: '书籍管理',
        icon: 'icon-book',
        url: './book',
        role: 'book_manage',
        children: [
            {
                name: '分类管理',
                label: '类',
                url: './book/category'
            },
            {
                name: '作者管理',
                label: '作',
                url: './book/author'
            },
            {
                name: '书单管理',
                label: '单',
                url: './book/list'
            },
        ],
    }
];
