import { Component, OnInit } from '@angular/core';
import { DialogAnimation } from '../../../theme/constants/dialog-animation';
import { IAddress } from '../../../theme/models/shop';
import { ShopService } from '../../shop.service';

@Component({
    selector: 'app-address',
    templateUrl: './address.component.html',
    styleUrls: ['./address.component.scss'],
    animations: [
        DialogAnimation,
    ]
})
export class AddressComponent implements OnInit {

    public items: IAddress[] = [];
    public hasMore = true;
    public page = 1;
    public perPage = 20;
    public isLoading = false;
    public total = 0;
    public dialogOpen = false;
    public editData: IAddress = {} as any;

    constructor(
        private service: ShopService,
    ) {
        this.tapRefresh();
    }

    ngOnInit() {}

    public get pageTotal(): number {
        return Math.ceil(this.total / this.perPage);
    }

    public tapEdit(item?: IAddress) {
        this.editData = item ? {...item} : {} as any;
        this.dialogOpen = true;
    }

    public tapSearch(form: any) {
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