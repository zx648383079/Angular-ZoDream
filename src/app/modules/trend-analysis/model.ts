import { IItem } from '../../theme/models/seo';

export const TimeTabItems: IItem[] = [
    {name: '今天', value: 'today'},
    {name: '昨天', value: 'yesterday'},
    {name: '最近7天', value: 'week'},
    {name: '最近30天', value: 'month'},
];

export interface IJumpLog {
    id:         number;
    referrer:   string;
    url:        string;
    ip:         string;
    user_agent: string;
    created_at: string;
}
