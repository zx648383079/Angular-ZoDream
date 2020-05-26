import { IPage } from '../models/page';

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
