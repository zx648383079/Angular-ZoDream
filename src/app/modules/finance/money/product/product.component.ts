import { Component, OnInit, inject, signal } from '@angular/core';
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


    public items: IFinancialProduct[] = [];
    public isLoading = false;
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
        history.back();
    }
    public tapRefresh() {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        this.service.productList(this.queries().value()).subscribe(res => {
            this.isLoading = false;
            this.items = res.data;
        });
    }

    public tapSearch() {
        this.tapRefresh();
    }

    public tapRemove(item: IFinancialProduct) {
        if (!confirm('确定删除“' + item.name + '”产品？')) {
            return;
        }
        this.service.productRemove(item.id).subscribe(res => {
            if (!res.data) {
                return;
            }
            this.toastrService.success($localize `Delete Successfully`);
            this.items = this.items.filter(it => {
                return it.id !== item.id;
            });
        });
    }

    public onStatusChange(item: IFinancialProduct) {
        this.service.productChange(item.id).subscribe(res => {
            item.status = res.status;
        });
    }

    open(modal: DialogEvent, item?: IFinancialProduct) {
        this.editForm().value.update(v => {
            v.id = item?.id ?? 0;
            v.name = item?.name ?? '';
            v.status = item?.status ?? 1;
            v.remark = item?.remark ?? '';
            return v;
        });
        modal.open(() => {
            this.service.productSave({...this.editForm}).subscribe(_ => {
                this.toastrService.success($localize `Save Successfully`);
                this.tapRefresh();
            });
        }, () => this.editForm().valid());
    }

}
