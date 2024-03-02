import { IPageBaeItem } from '../../theme/models/page';

export interface ISignature {
    id: number;
    sign_no?: string;
    name: string;
    is_default?: number;
}

export interface ITemplate extends IPageBaeItem {
    type: number;
    title: string;
    name: string;
    target_no: string;
    content: string;
    data: any;
}

export interface ILog extends IPageBaeItem {
    template_name: string;
    template_id: number;
    target_type: number;
    target: string;
    content: string;
    ip: string;
    type: number;
    status: number;
    message: string;
}