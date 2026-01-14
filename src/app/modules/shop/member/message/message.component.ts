import { Component, OnInit, inject, signal } from '@angular/core';
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
    standalone: false,
    selector: 'app-shop-member-message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
    private readonly service = inject(ShopService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);


    public title = '消息中心';

    public navItems: IMessageGroup[] = [
        {
            icon: 'icon-mobile',
            name: '系统通知',
            remark: '无未读消息',
        }
    ];
    public navIndex = -1;

    public readonly items = signal<IMessageBase[]>([]);
    public readonly hasMore = signal(false);
    public readonly queries = signal({
        page: 1,
        per_page: 20
    });
    public readonly isLoading = signal(false);
    public readonly total = signal(0);

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
        this.goPage(this.queries().page);
    }

    public tapMore(lastId: number) {
        if (lastId < 1) {
            return;
        }
        const item = this.navIndex >= 0 ? this.navItems[this.navIndex] : null;
        this.service.bulletinList({
            user: item && item.id > 0 ? item.id : -1,
            last_id: lastId,
            ...this.queries(),
            page: 1,
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
            this.items.set([].concat(items, this.items));
            this.hasMore.set(res.paging.more);
        });
    }

    /**
     * goPage
     */
    public goPage(page: number) {
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        const item = this.navIndex >= 0 ? this.navItems[this.navIndex] : null;
        this.service.bulletinList({
            ...this.queries(),
            user: item && item.id > 0 ? item.id : -1,
            page,
        }).subscribe({
            next: res => {
                this.isLoading.set(false);
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
                this.items.set(items);
                this.hasMore.set(res.paging.more);
                this.total.set(res.paging.total);
                this.queries.update(v => {
                    v.page = page;
                    return {...v};
                });
            }, 
            error: _ => {
                this.isLoading.set(false);
            }
        });
    }

}
