import { form } from '@angular/forms/signals';
import { Component, effect, inject, input, model, signal } from '@angular/core';
import { IPageQueries } from '../../../../../theme/models/page';
import { IAddress } from '../../../model';
import { OrderService } from '../order.service';
import { FormValueControl } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-address-picker',
    templateUrl: './address-picker.component.html',
    styleUrls: ['./address-picker.component.scss'],
})
export class AddressPickerComponent implements FormValueControl<IAddress> {
    private readonly service = inject(OrderService);


    public readonly user = input(0);
    public readonly disabled = input<boolean>(false);
    public readonly value = model<IAddress>();
    public isFocus = false;
    public editable = false;

    public readonly queries = form(signal<IPageQueries>({
        keywords: '',
        page: 1,
        per_page: 20
    }));
    public readonly items = signal<IAddress[]>([]);
    private hasMore = false;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);

    constructor() {
        effect(() => {
            if (this.user() > 0) {
                this.tapRefresh();
            }
        })
    }

    public toggleEdit() {
        this.editable = !this.editable;
        if (!this.editable) {
            return;
        }
        if (this.value()) {
            this.output({...this.value(), id: 0});
            return;
        }
        this.output({
            region_id: 0,
            name: '',
            address: '',
            tel: '',
        } as any);
    }

    public onValueChange(val: any, key: string) {
        this.value.update(v => {
            v[key] = val;
            return v;
        });
    }

    public tapItem(item: IAddress) {
        this.output(item);
    }

    public tapClear() {
        this.output();
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapMore() {
        this.goPage(this.queries.page().value() + 1);
    }

    public goPage(page: number) {
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page, user: this.user()};
        this.service.addressSearch(queries).subscribe({
            next: res => {
                this.isLoading.set(false);
                this.items.set(res.data);
                this.hasMore = res.paging.more;
                this.total.set(res.paging.total);
                this.queries().value.set(queries);
                if (this.items().length < 1 && this.total() < 1) {
                    this.toggleEdit();
                }
            },
            error: _ => {
                this.isLoading.set(false);
            }
        });
    }

    private output(v?: IAddress) {
        this.value.set(v);
    }

}
