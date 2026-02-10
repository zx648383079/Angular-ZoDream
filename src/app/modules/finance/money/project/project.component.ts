import { Component, OnInit, inject, signal } from '@angular/core';
import { Location } from '@angular/common';
import { DialogEvent, DialogService } from '../../../../components/dialog';
import { FinanceService } from '../../finance.service';
import { IAccount, IFinancialProduct, IFinancialProject } from '../../model';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-finance-project',
    templateUrl: './project.component.html',
    styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
    private readonly service = inject(FinanceService);
    private readonly toastrService = inject(DialogService);
    private readonly location = inject(Location);

    public readonly items = signal<IFinancialProject[]>([]);
    public readonly isLoading = signal(false);
    public readonly queries = form(signal({
        keywords: ''
    }));
    public readonly editForm = form(signal({
        id: 0,
        name: '',
        alias: '',
        money: 0,
        account_id: '',
        product_id: '',
        earnings: 0,
        start_at: '',
        end_at: '',
        remark: '',
    }), schemaPath => {
        required(schemaPath.name);
    });

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
        this.location.back();
    }

    public formatScale(val: number) {
        return `${val * 100}%`;
    }

    public tapRefresh() {
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        this.service.projectList(this.queries().value()).subscribe(res => {
            this.isLoading.set(false);
            this.items.set(res.data);
        });
    }

    public tapSearch(e: Event) {
        e.preventDefault();
        this.tapRefresh();
    }

    public tapRemove(item: IFinancialProject) {
        this.toastrService.confirm('确定删除“' + item.name + '”理财项目？', () => {
            this.service.projectRemove(item.id).subscribe(res => {
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

    open(modal: DialogEvent, item?: IFinancialProject) {
        this.editForm().value.update(v => {
            v.id = item?.id ?? 0;
            v.name = item?.name ?? '';
            v.alias = item?.alias ?? '';
            v.money = item?.money ?? 0;
            v.account_id = item?.account_id as any ?? '';
            v.product_id = item?.product_id as any ?? '';
            v.earnings = item?.earnings ?? 0;
            v.start_at = item?.start_at ?? '';
            v.end_at = item?.end_at ?? '';
            v.remark = item?.remark ?? '';
            return {...v};
        });
        modal.open(() => {
            this.service.projectSave({...this.editForm().value()}).subscribe(_ => {
                this.toastrService.success($localize `Save Successfully`);
                this.tapRefresh();
            });
        }, () => this.editForm().valid());
    }

    public tapConfirm(modal: DialogEvent, item: IFinancialProject) {
        this.editForm().value.update(v => {
            v.id = item.id;
            v.name = item.name;
            v.money = item.money;
            v.earnings = 0;
            return {...v};
        });
        modal.open(() => {
            this.service.projectEarnings({
                id: item.id,
                money: this.editForm.earnings().value(),
            }).subscribe(_ => {
                this.toastrService.success('成功确认收益');
            });
        }, () => {
            return this.editForm.earnings().value() > 0;
        });
    }

}
