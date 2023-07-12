import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IBlockItem } from '../../../../components/link-rule';
import { IMessageBase } from '../../../../components/message-container';
import { openLink } from '../../../../theme/utils/deeplink';
import { ShopService } from '../../shop.service';

interface IMessageGroup {
    id?: number;
    icon?: string;
    avatar?: string;
    name: string;
    remark?: string;
}

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

    public title = '消息中心';

    public navItems: IMessageGroup[] = [
        {
            icon: 'icon-mobile',
            name: '系统通知',
            remark: '无未读消息',
        }
    ];
    public navIndex = -1;

    public items: IMessageBase[] = [];
    public hasMore = false;
    public page = 1;
    public perPage = 20;
    public isLoading = false;
    public total = 0;

    constructor(
        private service: ShopService,
        private router: Router,
        private route: ActivatedRoute,
    ) {

    }

    ngOnInit() {
        this.service.bulletinUser().subscribe(res => {
            this.navItems = res.data as any[];
        });
    }


    public tapNav(i: number) {
        this.navIndex = i;
        this.tapRefresh();
    }

    public onMessageTap(item: IBlockItem) {
        if (item.type == 4) {
            openLink(this.router, item.link);
        }
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

    public tapMore(lastId: number) {
        if (lastId < 1) {
            return;
        }
        const item = this.navIndex >= 0 ? this.navItems[this.navIndex] : null;
        this.service.bulletinList({
            user: item && item.id > 0 ? item.id : -1,
            last_id: lastId,
            page: 1,
            per_page: this.perPage
        }).subscribe(res => {
            const items = res.data.map(i => {
                return {
                    id: i.id,
                    user: i.bulletin.user,
                    content: i.bulletin.title + '\n' + i.bulletin.content,
                    extra_rule: i.bulletin.extra_rule,
                    type: 0,
                    created_at: i.created_at,
                };
            });
            this.items = [].concat(items, this.items);
            this.hasMore = res.paging.more;
        });
    }

    /**
     * goPage
     */
    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const item = this.navIndex >= 0 ? this.navItems[this.navIndex] : null;
        this.service.bulletinList({
            user: item && item.id > 0 ? item.id : -1,
            page,
            per_page: this.perPage
        }).subscribe(res => {
            this.isLoading = false;
            const items = res.data.map(i => {
                return {
                    id: i.id,
                    user: i.bulletin.user,
                    content: i.bulletin.title + '\n' + i.bulletin.content,
                    extra_rule: i.bulletin.extra_rule,
                    type: 0,
                    created_at: i.created_at,
                };
            });
            this.items = items;
            this.hasMore = res.paging.more;
            this.total = res.paging.total;
        }, _ => {
            this.isLoading = false;
        });
    }

}
