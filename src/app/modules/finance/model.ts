import { IPageEditItem } from '../../theme/models/page';

export const LogTypeItems = ['支出', '收入', '借出', '贷入'];
export const ItemTypeItems = ['家电', '手机', '平板', '电脑'];


export interface IBudget {
    id: number;
    name: string;
    budget: number;
    cycle: number;
    spent: number;
    remain: number;
    remark: string;
    user_id: number;
    deleted_at: string;
    created_at: string;
    updated_at: string;
}

export interface IItem {
    id: number;
    type: number;
    name: string;
    price: number;
    remark: string;
    status: number;
    user_id: number;
    deleted_at: string;
    created_at: string;
    updated_at: string;

    avg?: number;
    days?: number;
}

export interface IAccount {
    id: number;
    name:         string;
    money:        number;
    frozen_money: number;
    status:       boolean;
    remark:       string;
    user_id:      number;
    deleted_at:   number;
    updated_at:   string;
    created_at:   string;
}

export interface IConsumptionChannel {
    id: number;
    name: string;
}

export interface IFinancialProduct {
    id: number;
    name: string;
    status: number;
    remark: string;
}

export interface IFinancialProject {
    product:         IFinancialProduct;
    id:              number;
    name:            string;
    alias:           string;
    money:           number;
    account_id:      number;
    earnings:        number;
    start_at:        string;
    end_at:          string;
    earnings_number: number;
    product_id:      number;
    status:          number;
    color:           number;
    remark:          string;
    user_id:         number;
    deleted_at:      number;
    updated_at:      string;
    created_at:      string;
}

export interface ILog extends IPageEditItem {
    id:             number;
    parent_id:      number;
    type:           number;
    money:          number;
    frozen_money:   number;
    account_id:     number;
    channel_id:     number;
    project_id:     number;
    budget_id:      number;
    item_id:        number;
    remark:         string;
    happened_at:    string;
    out_trade_no:   string;
    user_id:        number;
    trading_object: string;
    updated_at:     string;
    created_at:     string;
    channel?: IConsumptionChannel,
    project?: IFinancialProject;
    account?: IAccount;
    budget?: IBudget;
    parent?: ILog;
}

export interface ILogGroup {
    name: string;
    expenditure: number;
    income: number;
    items: ILog[];
}

