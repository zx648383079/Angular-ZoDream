import { IExtraRule } from '../link-rule';
import { IUserItem } from '../theme/models/user';

export interface IMessageBase {
    id:         number;
    type:       number;
    content:    string;
    created_at: any;
    extra_rule: IExtraRule[];
    user:       IUserItem;
}