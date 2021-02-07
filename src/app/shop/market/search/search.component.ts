import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IGoods } from '../../../theme/models/shop';
import { ShopService } from '../../shop.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

    public keywords = '';

    public items: IGoods[] = [];
    public page = 1;
    public hasMore = true;
    public isLoading = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private service: ShopService,
    ) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.keywords = params.keywords || '';
            this.tapRefresh();
        });
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapMore() {
        if (!this.hasMore) {
            return;
        }
        this.goPage(this.page + 1);
    }

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        this.service.goodsList({
            keywords: this.keywords,
            page
        }).subscribe(res => {
            this.page = page;
            this.hasMore = res.paging.more;
            this.isLoading = false;
            this.items = page < 2 ? res.data : [].concat(this.items, res.data);
        }, () => {
            this.isLoading = false;
        });
    }

}
