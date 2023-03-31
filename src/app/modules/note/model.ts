import { IUser } from '../../theme/models/user';

export interface INote {
    id: number;
    content: string;
    user_id: number;
    is_notice: number;
    created_at: string;
    user: IUser;
    editable: boolean;
    html?: any;
}