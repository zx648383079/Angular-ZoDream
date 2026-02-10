import { Component, OnInit, inject, signal } from '@angular/core';
import { Location } from '@angular/common';
import { DialogEvent, DialogService } from '../../../../components/dialog';
import { FinanceService } from '../../finance.service';
import { IFinancialProduct } from '../../model';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-finance-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
    private readonly service = inject(FinanceService);
    private readonly toastrService = inject(DialogService);
    private readonly location = inject(Location);

    public readonly items = signal<IFinancialProduct[]>([]);
    public readonly isLoading = signal(false);
    public readonly queries = form(signal({
        keywords: ''
    }));
    public readonly editForm =  form(signal({
        id: 0,
        name: '',
        status: 1,
        remark: ''
    }), schemaPath => {
        required(schemaPath.name);
    });

    ngOnInit() {
        this.tapRefresh();
    }

    public tapBack() {
        this.location.back();
    }
    public tapRefresh() {
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        this.service.productList(this.queries().value()).subscribe(res => {
            this.isLoading.set(false);
            this.items.set(res.data);
        });
    }

    public tapSearch(e: Event) {
        e.preventDefault();
        this.tapRefresh();
    }

    public tapRemove(item: IFinancialProduct) {
        this.toastrService.confirm('确定删除“' + item.name + '”产品？', () => {
            this.service.productRemove(item.id).subscribe(res => {
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

    public onStatusChange(item: IFinancialProduct) {
        this.service.productChange(item.id).subscribe(res => {
            item.status = res.status;
        });
    }

    public open(modal: DialogEvent, item?: IFinancialProduct) {
        this.editForm().value.update(v => {
            v.id = item?.id ?? 0;
            v.name = item?.name ?? '';
            v.status = item?.status ?? 1;
            v.remark = item?.remark ?? '';
            return {...v};
        });
        modal.open(() => {
            this.service.productSave({...this.editForm().value()}).subscribe(_ => {
                this.toastrService.success($localize `Save Successfully`);
                this.tapRefresh();
            });
        }, () => this.editForm().valid());
    }

}
