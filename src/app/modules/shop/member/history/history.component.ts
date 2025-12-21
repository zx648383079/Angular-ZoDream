import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ShopService } from '../../shop.service';
import { IGoodsHistory } from '../../model';

@Component({
    standalone: false,
    selector: 'app-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
    private readonly service = inject(ShopService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);

    public readonly items = signal<IGoodsHistory[]>([]);
    private hasMore = true;
    public readonly queries = signal({
        page: 1,
        per_page: 20
    });
    public readonly isLoading = signal(false);
    public readonly total = signal(0);

    constructor() {
        this.tapRefresh();
    }

    ngOnInit() {}


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
        if (this.isLoading) {
            return;
        }
        this.isLoading.set(true);
        // this.service.orderList({
        //     page,
        //     per_page: this.perPage
        // }).subscribe(res => {
        //     this.isLoading.set(false);
        //     this.items.set(res.data);
        //     this.hasMore = res.paging.more;
        //     this.total.set(res.paging.total);
        // });
    }

}
