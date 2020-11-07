
export interface ITask {
    id?: number;
    parent_id?: number;
    name: string;
    description: string;
    status?: number;
    every_time?: number;
    time_length?: number;
    time_format?: string;
    checked?: boolean;
    children?: ITask[];
    space_time?: number;
    duration?: number;
    start_at?: string;
}

export interface ITaskComment {
    id?: number;
    task_id?: number;
    content: string;
    type: number;
    created_at: string;
    updated_at: string;
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
