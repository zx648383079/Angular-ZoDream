import { Component, OnInit } from '@angular/core';
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
    public items: IGoodsHistory[] = [];
    public hasMore = true;
    public page = 1;
    public perPage = 20;
    public isLoading = false;
    public total = 0;

    constructor(
        private service: ShopService,
        private router: Router,
        private route: ActivatedRoute,
    ) {
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
        // this.service.orderList({
        //     page,
        //     per_page: this.perPage
        // }).subscribe(res => {
        //     this.isLoading = false;
        //     this.items = res.data;
        //     this.hasMore = res.paging.more;
        //     this.total = res.paging.total;
        // });
    }

}
