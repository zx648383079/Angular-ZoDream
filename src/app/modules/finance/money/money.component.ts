import { Component, OnInit, inject, signal } from '@angular/core';
import { DialogEvent, DialogService } from '../../../components/dialog';
import { FinanceService } from '../finance.service';
import { IAccount } from '../model';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-finance-money',
    templateUrl: './money.component.html',
    styleUrls: ['./money.component.scss']
})
export class MoneyComponent implements OnInit {
    private readonly service = inject(FinanceService);
    private readonly toastrService = inject(DialogService);


    public readonly items = signal<IAccount[]>([]);
    public readonly isLoading = signal(false);
    public readonly queries = form(signal({
        keywords: ''
    }));
    public readonly editForm = form(signal({
        id: 0,
        name: '',
        money: 0,
        frozen_money: 0,
        status: 1,
        remark: '',
    }), schemaPath => {
        required(schemaPath.name);
    });

    ngOnInit() {
        this.tapRefresh();
    }
    
    public tapBack() {
        history.back();
    }

    public tapRefresh() {
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        this.service.accountList(this.queries().value()).subscribe(res => {
            this.isLoading.set(false);
            this.items.set(res.data);
        });
    }

    public tapSearch() {
        this.tapRefresh();
    }

    public tapRemove(item: IAccount) {
        this.toastrService.confirm('确定删除“' + item.name + '”资金账户？', () => {
            this.service.accountRemove(item.id).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success($localize `Delete Successfully`);
                this.items.update(v => {
                    return v.filter(it => {
                        return it.id !== item.id;
                    });
                });
            });
        });

    }

    public onStatusChange(item: IAccount) {
        this.service.accountChange(item.id).subscribe(res => {
            item.status = res.status;
        });
    }

    open(modal: DialogEvent, item?: IAccount) {
        this.editForm().value.update(v => {
            v.id = item?.id ?? 0;
            v.name = item?.name ?? '';
            v.money = item?.money ?? 0;
            v.frozen_money = item?.frozen_money ?? 0;
            v.status = item?.status as any ?? 1;
            v.remark = item?.remark ?? '';
            return v;
        });
        modal.open(() => {
            this.service.accountSave({...this.editForm}).subscribe(_ => {
                this.toastrService.success($localize `Save Successfully`);
                this.tapRefresh();
            });
        }, () => this.editForm().valid());
    }

}
