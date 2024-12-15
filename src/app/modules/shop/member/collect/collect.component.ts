import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ShopService } from '../../shop.service';

@Component({
    standalone: false,
  selector: 'app-collect',
  templateUrl: './collect.component.html',
  styleUrls: ['./collect.component.scss']
})
export class CollectComponent implements OnInit {
    public title = '我的收藏';
    public items: any[] = [];
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
        this.service.collectList({
            page,
            per_page: this.perPage
        }).subscribe({
            next: res => {
                this.isLoading = false;
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

}
