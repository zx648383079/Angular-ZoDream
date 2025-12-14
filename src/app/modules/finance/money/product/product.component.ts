import { Component, OnInit, inject } from '@angular/core';
import { DialogEvent, DialogService } from '../../../../components/dialog';
import { emptyValidate } from '../../../../theme/validators';
import { FinanceService } from '../../finance.service';
import { IFinancialProduct } from '../../model';

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
    public keywords = '';
    public editData: IFinancialProduct = {
        id: undefined,
        name: '',
        status: 1,
        remark: ''
    };

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
        this.service.productList({
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
        this.editData = item ? {...item} : {
            id: undefined,
            name: '',
            status: 1,
            remark: ''
        } as any;
        modal.open(() => {
            this.service.productSave({...this.editData}).subscribe(_ => {
                this.toastrService.success($localize `Save Successfully`);
                this.tapRefresh();
            });
        }, () => {
            return !emptyValidate(this.editData.name)
        });
    }

}
