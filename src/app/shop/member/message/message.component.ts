import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ShopService } from '../../shop.service';

interface IMessageGroup {
    icon: string;
    name: string;
    remark: string;
}

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

    public navItems: IMessageGroup[] = [
        {
            icon: 'icon-mobile',
            name: '系统通知',
            remark: '无未读消息',
        }
    ];
    public navIndex = 0;

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

    public get pageTotal(): number {
        return Math.ceil(this.total / this.perPage);
    }

    public tapNav(i: number) {
        this.navIndex = i;
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
        this.service.orderList({
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
