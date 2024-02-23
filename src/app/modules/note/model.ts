import { IPageEditItem } from '../../theme/models/page';
import { IUser } from '../../theme/models/user';

export interface INote extends IPageEditItem {
    id: number;
    content: string;
    user_id: number;
    is_notice: number;
    status: number;
    created_at: string;
    user: IUser;
    editable: boolean;
    html?: any;
}