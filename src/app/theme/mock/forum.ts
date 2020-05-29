import { IForum, IThread, IThreadPost } from '../models/forum';
import { mockUser } from './auth';
import { mockDate, mockImage } from './page';

export const mockThreadPost: IThreadPost[] = [
    {
        id: 1,
        content: 'dsa',
        user: mockUser,
        grade: 0,
        created_at: mockDate(),
        updated_at: mockDate(),
    },
    {
        id: 1,
        content: '楼主好',
        user: mockUser,
        grade: 1,
        created_at: mockDate(),
    },
];

export const mockThread: IThread[] = [
    {
        id: 1,
        title: '213123',
        view_count: 99,
        post_count: 11,
        created_at: mockDate(),
        updated_at: mockDate(),
        user: mockUser,
    },
    {
        id: 2,
        title: 'zhehsi ',
        view_count: 99,
        post_count: 11,
        created_at: mockDate(),
        updated_at: mockDate(),
        user: mockUser,
    },
];

export const mockForum: IForum[] = [
    {
        id: 1,
        name: '这是分组',
        thumb: mockImage(),
        description: '',
        thread_count: 8,
        post_count: 888,
        children: [
            {
                id: 2,
                name: '方块',
                thumb: mockImage(),
                description: '',
                thread_count: 8,
                post_count: 888,
                last_thread: mockThread[0]
            }
        ],
    }
];
