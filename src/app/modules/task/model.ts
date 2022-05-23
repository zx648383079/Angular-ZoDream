import { IItem } from '../../theme/models/seo';
import { IUser } from '../../theme/models/user';

export const TaskStatusItems: IItem[] = [
    {name: '已完成', value: 1},
    {name: '无', value: 5},
    {name: '暂停中', value: 8},
    {name: '执行中', value: 9},
];

export interface ITask {
    id?: number;
    parent_id?: number;
    name: string;
    description: string;
    status?: number;
    every_time?: number;
    time_length?: number;
    checked?: boolean;
    children?: ITask[];
    space_time?: number;
    duration?: number;
    start_at?: string;
    formated_time?: string;
    formated_status?: string;
    tooltip?: string;
}

export interface ITaskComment {
    id?: number;
    task_id?: number;
    content: string;
    type: number;
    created_at: string;
    updated_at: string;
    user: IUser;
}

export interface ITaskDay {
    id: number;
    task_id: number;
    today: string;
    amount: number;
    success_amount: number;
    pause_amount: number;
    failure_amount: number;
    status: number;
    created_at: string;
    updated_at: string;
    task: ITask;
    log?: ITaskLog;
    tip?: string;
}

export interface ITaskLog {
    id: number;
    task_id: number;
    day_id: number;
    status: number;
    outage_time: number;
    end_at: number;
    created_at: string;
    time: number;
    time_format: string;
    task: ITask;
}

export interface ITaskPlan {
    id?: number;
    task_id: number;
    amount: number;
    plan_type: number;
    plan_time: number|string;
    priority: number;
    created_at?: string;
    task?: ITask;
}

export interface ITaskReview {
    amount: number;
    complete_amount: number;
    day: string;
    failure_amount: number;
    pause_amount: number;
    success_amount: number;
    total_time: number;
    valid_time: number;
    week: string;
}

export interface IShare {
    id: number;
    user_id?: number;
    task_id: number;
    share_type: number;
    share_rule: string;
    task: ITask;
    user?: IUser;
}
