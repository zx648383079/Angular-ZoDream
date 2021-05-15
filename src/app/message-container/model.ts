import { IExtraRule } from '../theme/components/rule-block/model';
import { IUserItem } from '../theme/models/user';

export interface IMessageBase {
    id:         number;
    type:       number;
    content:    string;
    created_at: any;
    extra_rule: IExtraRule[];
    user:       IUserItem;
}