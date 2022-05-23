import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../../components/dialog';
import { DialogBoxComponent } from '../../../components/dialog';
import { emptyValidate } from '../../../theme/validators';
import { FinanceService } from '../finance.service';
import { IAccount } from '../model';

@Component({
  selector: 'app-money',
  templateUrl: './money.component.html',
  styleUrls: ['./money.component.scss']
})
export class MoneyComponent implements OnInit {

    public items: IAccount[] = [];
    public isLoading = false;
    public keywords = '';
    public editData: IAccount = {
        id: undefined,
        name: '',
        money: 0,
        frozen_money: 0,
        status: 1,
        remark: '',
    } as any;

    constructor(
        private service: FinanceService,
        private toastrService: DialogService,
    ) {}

    ngOnInit() {
        this.tapRefresh();
    }

    /**
     * tapRefresh
     */
    public tapRefresh() {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        this.service.accountList({
            keywords: this.keywords,
        }).subscribe(res => {
            this.isLoading = false;
            this.items = res.data;
        });
    }

    public tapSearch(form: any) {
        this.keywords = form.keywords;
        this.tapRefresh();
    }

    public tapRemove(item: IAccount) {
        if (!confirm('确定删除“' + item.name + '”资金账户？')) {
            return;
        }
        this.service.accountRemove(item.id).subscribe(res => {
            if (!res.data) {
                return;
            }
            this.toastrService.success('删除成功');
            this.items = this.items.filter(it => {
                return it.id !== item.id;
            });
        });
    }

    public onStatusChange(item: IAccount) {
        this.service.accountChange(item.id).subscribe(res => {
            item.status = res.status;
        });
    }

    open(modal: DialogBoxComponent, item?: IAccount) {
        this.editData = item ? {...item} : {
            id: undefined,
            name: '',
            money: 0,
            frozen_money: 0,
            status: 1,
            remark: '',
        } as any;
        modal.open(() => {
            this.service.accountSave({...this.editData}).subscribe(_ => {
                this.toastrService.success('保存成功');
                this.tapRefresh();
            });
        }, () => {
            return !emptyValidate(this.editData.name)
        });
    }

}
