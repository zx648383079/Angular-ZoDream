import { IDisk, IShare, IShareFile } from '../models/disk';
import { mockUser } from './auth';

export const mockDisks: IDisk[] = [
    {
        id: 1,
        name: '文件夹',
        created_at: 1590561441,
        updated_at: 1590561441,
    },
    {
        id: 2,
        name: '图片',
        file_id: 1,
        created_at: 1590561000,
        updated_at: 1590561000,
        file: {
            name: '',
            size: 10000,
            extension: 'jpg',
            thumb: 'https://zodream.cn/assets/images/zx.jpg',
            url: 'https://zodream.cn/assets/images/zx.jpg',
        }
    },
    {
        id: 3,
        name: '音乐',
        file_id: 2,
        created_at: 1590001000,
        updated_at: 1590001000,
        file: {
            name: '',
            size: 50000,
            extension: 'mp3',
            thumb: 'https://zodream.cn/assets/images/zx.jpg',
            url: 'http://zodream.localhost/assets/upload/2019.mp3',
        }
    },
    {
        id: 3,
        name: '视频',
        file_id: 3,
        created_at: 1590001000,
        updated_at: 1590001000,
        file: {
            name: '',
            size: 10050000,
            extension: 'mp4',
            thumb: 'https://zodream.cn/assets/images/zx.jpg',
            url: 'http://zodream.localhost/assets/upload/2008.mp4',
        }
    },
];

export const mockShare: IShare[] = [
    {
        id: 1,
        name: '分享好动i下',
        user: mockUser,
        created_at: '2108-08-1',
        view_count: 999,
        save_count: 199,
        down_count: 88
    },
    {
        id: 2,
        name: '分享好的',
        user: mockUser,
        created_at: '2108-08-1',
        view_count: 999,
        save_count: 199,
        down_count: 88
    }
];

export const mockMyShare: IShareFile[] = [
    {
        id: 1,
        file: mockDisks[0]
    },
    {
        id: 2,
        file: mockDisks[1]
    }
];
