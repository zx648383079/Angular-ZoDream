import { IMicro } from '../models/micro';
import { mockUser } from './auth';
import { mockDate } from './page';

export const mockMicro: IMicro[] = [
    {
        id: 1,
        content: '哈哈',
        recommend_count: 88,
        forward_count: 88,
        comment_count: 88,
        collect_count: 88,
        created_at: mockDate(),
        user: mockUser
    }
];
