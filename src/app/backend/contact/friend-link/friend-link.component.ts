import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../dialog';
import { IPageQueries } from '../../../theme/models/page';
import { IFriendLink } from '../../../theme/models/seo';
import { applyHistory, getQueries } from '../../../theme/query';
import { ContactService } from '../contact.service';

@Component({
  selector: 'app-friend-link',
  templateUrl: './friend-link.component.html',
  styleUrls: ['./friend-link.component.scss']
})
export class FriendLinkComponent implements OnInit {

    public items: IFriendLink[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        page: 1,
        keywords: '',
        per_page: 20,
    };

    constructor(
        private service: ContactService,
        private toastrService: DialogService,
        private route: ActivatedRoute,
    ) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = getQueries(params, this.queries);
            this.tapPage();
        })
    }


    /**
     * tapRefresh
     */
    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.queries.page);
    }

    public tapMore() {
        this.goPage(this.queries.page + 1);
    }

    /**
     * goPage
     */
    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries, page};
        this.service.friendLinkList(queries).subscribe(res => {
            this.isLoading = false;
            this.items = res.data;
            this.hasMore = res.paging.more;
            this.total = res.paging.total;
            applyHistory(this.queries = queries);
        });
    }

    public tapSearch(form: any) {
        this.queries = getQueries(form, this.queries);
        this.tapRefresh();
    }

    public tapPass(item: IFriendLink) {
        if (!confirm('确认审核通过此友情链接？')) {
            return;
        }
        this.service.friendLinkToggle(item.id).subscribe(res => {
            if (!res) {
                return;
            }
            this.toastrService.success('已审核通过！');
            item.status = res.status;
        });
    }

    public tapOff(item: IFriendLink) {
        if (!confirm('确认下架此友情链接？')) {
            return;
        }
        this.service.friendLinkToggle(item.id).subscribe(res => {
            if (!res) {
                return;
            }
            this.toastrService.success('已下架！');
            item.status = res.status;
        });
    }

    public tapRemove(item: IFriendLink) {
        if (!confirm('确认删除此友情链接？')) {
            return;
        }
        this.service.friendLinkRemove(item.id).subscribe(res => {
            if (!res.data) {
                return;
            }
            this.toastrService.success('删除成功');
            this.items = this.items.filter(it => {
                return it.id !== item.id;
            });
        });
    }
}
