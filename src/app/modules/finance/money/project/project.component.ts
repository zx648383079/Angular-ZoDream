import { Component, OnInit, inject } from '@angular/core';
import { DialogEvent, DialogService } from '../../../../components/dialog';
import { emptyValidate } from '../../../../theme/validators';
import { FinanceService } from '../../finance.service';
import { IAccount, IFinancialProduct, IFinancialProject } from '../../model';

@Component({
    standalone: false,
    selector: 'app-finance-project',
    templateUrl: './project.component.html',
    styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
    private readonly service = inject(FinanceService);
    private readonly toastrService = inject(DialogService);


    public items: IFinancialProject[] = [];
    public isLoading = false;
    public keywords = '';
    public editData: IFinancialProject = {
        id: undefined,
        name: '',
        alias: '',
        money: 0,
        account_id: 0,
        product_id: 0,
        earnings: 0,
        start_at: '',
        end_at: '',
        remark: '',
    } as any;

    public accountItems: IAccount[] = [];
    public productItems: IFinancialProduct[] = [];

    ngOnInit() {
        this.tapRefresh();
        this.service.batch({
            account: {},
            product: {}
        }).subscribe(res => {
            this.accountItems = res.account;
            this.productItems = res.product;
        });
    }

    public tapBack() {
        history.back();
    }

    public formatScale(val: number) {
        return `${val * 100}%`;
    }

    public tapRefresh() {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        this.service.projectList({
            keywords: this.keywords,
        }).subscribe(res => {
            this.isLoading = false;
            this.items = res.data;
        });
    }

    public tapSearch() {
        this.keywords = form.keywords;
        this.tapRefresh();
    }

    public tapRemove(item: IFinancialProject) {
        if (!confirm('确定删除“' + item.name + '”理财项目？')) {
            return;
        }
        this.service.projectRemove(item.id).subscribe(res => {
            if (!res.data) {
                return;
            }
            this.toastrService.success($localize `Delete Successfully`);
            this.items = this.items.filter(it => {
                return it.id !== item.id;
            });
        });
    }

    open(modal: DialogEvent, item?: IFinancialProject) {
        this.editData = item ? {...item} : {
            id: undefined,
            name: '',
            alias: '',
            money: 0,
            account_id: 0,
            product_id: 0,
            earnings: 0,
            start_at: '',
            end_at: '',
            remark: '',
        } as any;
        modal.open(() => {
            this.service.projectSave({...this.editData}).subscribe(_ => {
                this.toastrService.success($localize `Save Successfully`);
                this.tapRefresh();
            });
        }, () => {
            return !emptyValidate(this.editData.name)
        });
    }

    public tapConfirm(modal: DialogEvent, item: IFinancialProject) {
        this.editData = {
            id: item.id,
            name: item.name,
            money: item.money,
            earnings: 0,
        } as any;
        modal.open(() => {
            this.service.projectEarnings({
                id: item.id,
                money: this.editData.earnings,
            }).subscribe(_ => {
                this.toastrService.success('成功确认收益');
            });
        }, () => {
            return this.editData.earnings > 0;
        });
    }

}
