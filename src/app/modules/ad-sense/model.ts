export interface IAd {
    id: number;
    name: string;
    position_id: number;
    type: number;
    url: string;
    content: string;
    start_at: string;
    end_at: string;
    status: number;
    created_at: string;
    updated_at: string;
    position?: IAdPosition;
}

export interface IAdPosition {
    id: number;
    code: string;
    name: string;
    auto_size: number;
    source_type: number;
    width: string;
    height: string;
    template: string;
    status: number;
    created_at: string;
    updated_at: string;
}