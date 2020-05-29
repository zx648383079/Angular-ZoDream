import { IPage } from '../models/page';
import { formatTime, randomInt } from '../utils';

export function mockPage<T>(data: T[], page: number = 1): IPage<T> {
    return {
        paging: {
            limit: 20,
            offset: page,
            total: 100,
            more: page < 5
        },
        data
    };
}

export const mockTimestamp = () => {
    return Math.floor(new Date().getTime() / 1000 - Math.random() * 100000);
};

export const mockDate = () => {
    return formatTime(new Date(mockTimestamp() * 1000));
};

export const mockImage = () => {
    return 'https://zodream.cn/assets/images/zd.jpg';
};

export const mockAvatar = () => {
    return 'https://zodream.cn/assets/images/avatar/' + randomInt(48) + '.png';
};
