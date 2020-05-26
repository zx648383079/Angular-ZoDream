import { ICategory, IArchives, ITag, IBlog } from '../models/blog';
import { mockUser } from './auth';

export const mockCategories: ICategory[] = [
    {id: 1, name: 'zodream', thumb: 'https://static.zodream.cn/debug.jpg', description: '', blog_count: 999}
];

export const mockArchives: IArchives[] = [
    {
        year: '2020',
        children: [
            {id: 1, title: '1231', date: '05-07'}
        ]
    }
];

export const mockTags: ITag[] = [
    {name: 'php', count: 1}
];

export const mockBlog: IBlog = {
    id: 83,
    title: '第三方支付对接',
    description: '这是说明',
    thumb: '',
    type: 1,
    language: 'zh',
    programming_language: 'php',
    comment_count: 999,
    click_count: 99999,
    recommend: 9999,
    content: '内容',
    created_at: '3天前',
    url: 'https://zodream.cn/blog/id/137.html',
    source_url: 'https://zodream.cn/blog/id/137.html',
    term: mockCategories[0],
    user: mockUser,
    tags: mockTags,
};
