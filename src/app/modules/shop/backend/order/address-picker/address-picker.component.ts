import { Component, effect, inject, input, model } from '@angular/core';
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
    private service = inject(OrderService);


    public readonly user = input(0);
    public readonly disabled = input<boolean>(false);
    public readonly value = model<IAddress>();
    public isFocus = false;
    public editable = false;

    public queries: IPageQueries = {
        keywords: '',
        page: 1,
        per_page: 20
    };
    public items: IAddress[] = [];
    public hasMore = false;
    public isLoading = false;
    public total = 0;

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
        this.goPage(this.queries.page + 1);
    }

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries, page, user: this.user()};
        this.service.addressSearch(queries).subscribe({
            next: res => {
                this.isLoading = false;
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                this.queries = queries;
                if (this.items.length < 1 && this.total < 1) {
                    this.toggleEdit();
                }
            },
            error: _ => {
                this.isLoading = false;
            }
        });
    }

    private output(v?: IAddress) {
        this.value.set(v);
    }

}
