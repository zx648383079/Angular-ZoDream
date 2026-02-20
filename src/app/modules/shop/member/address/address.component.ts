import { Component, inject, signal } from '@angular/core';
import { DialogService } from '../../../../components/dialog';
import { IErrorResponse } from '../../../../theme/models/page';
import { IAddress } from '../../model';
import { ShopService } from '../../shop.service';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-shop-address',
    templateUrl: './address.component.html',
    styleUrls: ['./address.component.scss'],
})
export class AddressComponent {
    private readonly service = inject(ShopService);
    private readonly toastrService = inject(DialogService);

    public title = '地址管理';
    public readonly items = signal<IAddress[]>([]);
    private hasMore = true;
    public readonly queries = signal({
        page: 1,
        per_page: 20
    });
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly regionSource = this.service.regionSource();
    public readonly dialogOpen = signal(false);
    public readonly editForm = form(signal<IAddress>({
        id: 0,
        name: '',
        tel: '',
        region_id: 0,
        address: '',
        is_default: false
    }), schemaPath => {
        required(schemaPath.name, {message: '请输入收货人姓名'});
    });

    constructor() {
        this.tapRefresh();
    }

    public toggleDefault() {
        this.editForm.is_default().value.update(v => !v);
    }

    public tapEdit(item?: IAddress) {
        this.editForm().value.update(v => {
            v.id = item?.id ?? 0;
            v.name = item?.name ?? '';
            v.tel = item?.tel ?? '';
            v.region_id = item?.region_id ?? 0;
            v.address = item?.address ?? '';
            return {...v};
        });
        this.dialogOpen.set(true);
    }

    public tapSave() {
        
        if (this.editForm().invalid()) {
            this.toastrService.warning('请输入收货人姓名');
            return;
        }
        const data = this.editForm().value();
        this.service.addressSave(data).subscribe({
            next: res => {
                this.dialogOpen.set(false);
                this.toastrService.success(data.id > 0 ? '地址已修改' : '地址已增加');
                this.items.update(v => {
                    if (!data.id) {
                        v.push(res);
                        return [...v];
                    }
                    return v.map(i => {
                        return i.id === res.id ? res : i;
                    });
                });
                
            }, error: err => {
                const res = err.error as IErrorResponse;
                this.toastrService.warning(res.message);
            }
        });
    }

    public tapRemove(item: IAddress) {
        this.toastrService.confirm('确定删除“' + item.region_name + item.address + '”收获地址？', () => {
            this.service.addressRemove(item.id).subscribe(res => {
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

    public tapDefault(item: IAddress) {
        this.service.addressDefault(item.id).subscribe(res => {
            this.items.update(v => {
                return v.map(i => {
                    i.is_default = i.id === item.id;
                    return i;
                });
            });
        });
    }

    public tapSearch(e: Event) {
        e.preventDefault();
        this.tapRefresh();
    }

    /**
     * tapRefresh
     */
    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.queries().page);
    }

    public tapMore() {
        this.goPage(this.queries().page + 1);
    }

    /**
     * goPage
     */
    public goPage(page: number) {
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        this.service.addressList({
            ...this.queries(),
            page,
        }).subscribe({
            next: res => {
                this.isLoading.set(false);
                this.items.set(res.data);
                this.hasMore = res.paging.more;
                this.total.set(res.paging.total);
                this.queries.update(v => {
                    v.page = page;
                    return v;
                });
            },
            error: _ => {
                this.isLoading.set(false);
            }
        });
    }


}
