import { IDisk } from '../models/disk';

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
