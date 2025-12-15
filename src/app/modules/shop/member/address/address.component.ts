import { Component, OnInit, inject, signal } from '@angular/core';
import { DialogService } from '../../../../components/dialog';
import { IErrorResponse } from '../../../../theme/models/page';
import { IAddress } from '../../model';
import { ShopService } from '../../shop.service';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-address',
    templateUrl: './address.component.html',
    styleUrls: ['./address.component.scss'],
})
export class AddressComponent implements OnInit {
    private readonly service = inject(ShopService);
    private readonly toastrService = inject(DialogService);

    public title = '地址管理';
    public items: IAddress[] = [];
    public hasMore = true;
    public page = 1;
    public perPage = 20;
    public isLoading = false;
    public total = 0;
    public dialogOpen = false;
    public readonly editForm = form(signal<IAddress>({
        id: 0,
        name: '',
        tel: '',
        region_id: 0,
        address: ''
    }), schemaPath => {
        required(schemaPath.name, {message: '请输入收货人姓名'});
    });

    constructor() {
        this.tapRefresh();
    }

    ngOnInit() {}


    public tapEdit(item?: IAddress) {
        this.editForm().value.update(v => {
            v.id = item?.id ?? 0;
            v.name = item?.name ?? '';
            v.tel = item?.tel ?? '';
            v.region_id = item?.region_id ?? 0;
            v.address = item?.address ?? '';
            return v;
        });
        this.dialogOpen = true;
    }

    public tapSave() {
        
        if (this.editForm().invalid()) {
            this.toastrService.warning('请输入收货人姓名');
            return;
        }
        const data = this.editForm().value();
        this.service.addressSave(data).subscribe({
            next: res => {
                this.dialogOpen = false;
                this.toastrService.success(data.id > 0 ? '地址已修改' : '地址已增加');
                if (!data.id) {
                    this.items.push(res);
                    return;
                }
                this.items = this.items.map(i => {
                    return i.id === res.id ? res : i;
                });
            }, error: err => {
                const res = err.error as IErrorResponse;
                this.toastrService.warning(res.message);
            }
        });
    }

    public tapRemove(item: IAddress) {
        if (!confirm('确定删除“' + item.region_name + item.address + '”收获地址？')) {
          return;
        }
        this.service.addressRemove(item.id).subscribe(res => {
            if (!res.data) {
                return;
            }
            this.toastrService.success($localize `Delete Successfully`);
            this.items = this.items.filter(it => {
                return it.id !== item.id;
            });
        });
      }

    public tapDefault(item: IAddress) {
        this.service.addressDefault(item.id).subscribe(res => {
            this.items = this.items.map(i => {
                i.is_default = i.id === item.id;
                return i;
            });
        });
    }

    public tapSearch() {
        this.tapRefresh();
    }

    /**
     * tapRefresh
     */
    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.page);
    }

    public tapMore() {
        this.goPage(this.page + 1);
    }

    /**
     * goPage
     */
    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        this.service.addressList({
            page,
            per_page: this.perPage
        }).subscribe(res => {
            this.isLoading = false;
            this.items = res.data;
            this.hasMore = res.paging.more;
            this.total = res.paging.total;
        });
    }


}
