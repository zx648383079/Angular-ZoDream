import { IUser } from '../../theme/models/user';

export interface INote {
    id: number;
    content: string;
    user_id: number;
    created_at: string;
    user: IUser;
    editable: boolean;
}