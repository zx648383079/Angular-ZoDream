

export interface ISignature {
    id: number;
    sign_no?: string;
    name: string;
    is_default?: number;
}

export interface ITemplate {
    id: number;
    name: string;
    signature_id: number;
    content: string;
    sign_no: string;
    type: number;
}

export interface ILog {
    id: number;
    signature_id: number;
    template_id: number;
    mobile: string;
    content: string;
    ip: string;
    type: number;
    status: number;
    created_at: string;
}