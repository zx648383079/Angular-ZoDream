export interface IShortLink {
    id: number;
    user_id?: number;
    title: string;
    short_url?: string;
    source_url: string;
    click_count?: number;
    status?: number;
    is_system?: boolean;
    expired_at?: number;
    created_at?: string;
    updated_at?: string;
    complete_short_url?: string;
}