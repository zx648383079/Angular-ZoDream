import { IItem } from '../../theme/models/seo';

export const TimeTabItems: IItem[] = [
    {name: '今天', value: 'today'},
    {name: '昨天', value: 'yesterday'},
    {name: '最近7天', value: 'week'},
    {name: '最近30天', value: 'month'},
];

export interface ITrendAnalysis {
    ip_count: number;
    pv: number;
    uv: number; 
    stay_time: number; // 停留时间/s
    scale: string; // 占比%
    jump_scale: string; // 退出率%
    jump_count: number; // 退出次数
    next_count: number; // 贡献下游流量
}

export interface IUserAgent {
    os: [string, string];
    browser: [string, string];
    device: [string, string];
}

export interface IJumpLog extends IUserAgent {
    id:         number;
    referrer:   string;
    url:        string;
    ip:         string;
    user_agent: string;
    created_at: string;
}

export interface ITrendLog extends IUserAgent, ITrendAnalysis {
    host: string;
    domain: string;
    words: string;
    date: string;
    referrer:   string;
    url:        string;
    ip:         string;
    created_at: string;
}

export interface ITrendStatistics {
    date: string;
    pv: number;
    uv: number;
}

export interface ITrendLog {
    id: number;
    ip: string;
    method: string;
    hostname: string;
    pathname: string;
    queries?: string;
    user_agent: string;
    status_code: number;
    user_id: number;
    referrer_hostname?: string;
    referrer_pathname?: string;
    created_at: string;
}