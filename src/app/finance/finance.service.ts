import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IData, IDataOne, IPage } from '../theme/models/page';
import { IAccount, IBudget, IConsumptionChannel, IFinancialProduct, IFinancialProject, ILog } from './model';

@Injectable()
export class FinanceService {

    constructor(private http: HttpClient) { }

    public accountList(params: any) {
        return this.http.get<IData<IAccount>>('finance/account', {params});
    }

    public account(id: any) {
        return this.http.get<IAccount>('finance/account/detail', {
            params: {id},
        });
    }

    public accountSave(data: any) {
        return this.http.post<IAccount>('finance/account/save', data);
    }

    public accountChange(id: any) {
        return this.http.post<IAccount>('finance/account/change', {id});
    }

    public accountRemove(id: any) {
        return this.http.delete<IDataOne<true>>('finance/account/delete', {
            params: {id}
        });
    }


    public channelList(params: any) {
        return this.http.get<IPage<IConsumptionChannel>>('finance/channel', {params});
    }

    public channel(id: any) {
        return this.http.get<IConsumptionChannel>('finance/channel/detail', {
            params: {id},
        });
    }

    public channelSave(data: any) {
        return this.http.post<IConsumptionChannel>('finance/channel/save', data);
    }

    public channelRemove(id: any) {
        return this.http.delete<IDataOne<true>>('finance/channel/delete', {
            params: {id}
        });
    }


    public logList(params: any) {
        return this.http.get<IPage<ILog>>('finance/log', {params});
    }

    public logCount(params: any) {
        return this.http.get<IDataOne<number>>('finance/log/count', {params});
    }

    public log(id: any) {
        return this.http.get<ILog>('finance/log/detail', {
            params: {id},
        });
    }

    public logSave(data: any) {
        return this.http.post<ILog>('finance/log/save', data);
    }

    public logDaySave(data: any) {
        return this.http.post<IDataOne<boolean>>('finance/log/day', data);
    }

    public logRemove(id: any) {
        return this.http.delete<IDataOne<true>>('finance/log/delete', {
            params: {id}
        });
    }

    public logImport(data: any) {
        return this.http.post<IDataOne<boolean>>('finance/log/import', data);
    }

    public logBatchEdit(data: any) {
        return this.http.post<IDataOne<boolean>>('finance/log/batch', data);
    }

    public productList(params: any) {
        return this.http.get<IPage<IFinancialProduct>>('finance/product', {params});
    }

    public product(id: any) {
        return this.http.get<IFinancialProduct>('finance/product/detail', {
            params: {id},
        });
    }

    public productSave(data: any) {
        return this.http.post<IFinancialProduct>('finance/product/save', data);
    }

    public productChange(id: any) {
        return this.http.post<IFinancialProduct>('finance/product/change', {id});
    }

    public productRemove(id: any) {
        return this.http.delete<IDataOne<true>>('finance/product/delete', {
            params: {id}
        });
    }

    public projectList(params: any) {
        return this.http.get<IPage<IFinancialProject>>('finance/project', {params});
    }

    public project(id: any) {
        return this.http.get<IFinancialProject>('finance/project/detail', {
            params: {id},
        });
    }

    public projectSave(data: any) {
        return this.http.post<IFinancialProject>('finance/project/save', data);
    }

    public projectRemove(id: any) {
        return this.http.delete<IDataOne<true>>('finance/project/delete', {
            params: {id}
        });
    }

    /**
     * 确认收益
     * @param data 
     * @returns 
     */
    public projectEarnings(data: any) {
        return this.http.post<ILog>('finance/project/earnings', data);
    }

    public budgetList(params: any) {
        return this.http.get<IPage<IBudget>>('finance/budget', {params});
    }

    public budget(id: any) {
        return this.http.get<IBudget>('finance/budget/detail', {
            params: {id},
        });
    }

    public budgetSave(data: any) {
        return this.http.post<IBudget>('finance/budget/save', data);
    }

    public budgetRemove(id: any) {
        return this.http.delete<IDataOne<true>>('finance/budget/delete', {
            params: {id}
        });
    }

    public batch(data: {
        account?: any,
        budget?: any,
        channel?: any,
        project?: any,
        product?: any,
    }) {
        return this.http.post<{
            account: IAccount[],
            budget: IBudget[],
            channel: IConsumptionChannel[],
            project: IFinancialProject[],
            product: IFinancialProduct[],
        }>('finance/batch', data);
    }

    public statistics(params: any) {
        return this.http.get<any>('finance/statistics', {params});
    }
}
