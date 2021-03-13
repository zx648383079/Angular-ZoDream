import { Component, OnInit } from '@angular/core';
import { IActivityTime, ISeckillGoods } from '../../../theme/models/shop';
import { ShopService } from '../../shop.service';

@Component({
  selector: 'app-seckill',
  templateUrl: './seckill.component.html',
  styleUrls: ['./seckill.component.scss']
})
export class SeckillComponent implements OnInit {

    public timeItems: IActivityTime[] = [];
    public items: ISeckillGoods[] = [];
    public page = 1;
    public hasMore = true;
    public isLoading = false;
    public tabIndex = 0;

    constructor(
        private service: ShopService,
    ) { }

    ngOnInit() {
        this.service.seckillTime().subscribe(res => {
            this.timeItems = res.data;
            if (this.timeItems.length > 0) {
                this.tapTab(0);
            }
        });
    }

    public tapTab(i: number) {
        this.tabIndex = i;
        this.tapRefresh();
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
        this.service.seckillList({
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
