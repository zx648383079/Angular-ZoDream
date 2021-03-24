export interface IBudget {
    id: number;
    name: string;
    budget: number;
    cycle: number;
    spent: number;
    remain: number;
    user_id: number;
    deleted_at: string;
    created_at: string;
    updated_at: string;
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

export interface ILog {
    account:        IAccount;
    id:             number;
    parent_id:      number;
    type:           number;
    money:          number;
    frozen_money:   number;
    account_id:     number;
    channel_id:     number;
    project_id:     number;
    budget_id:      number;
    remark:         string;
    happened_at:    string;
    out_trade_no:   string;
    user_id:        number;
    trading_object: string;
    updated_at:     string;
    created_at:     string;
}



