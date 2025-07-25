import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from '../../../components/dialog';
import { IBlockItem } from '../../../components/link-rule';
import { openLink } from '../../../theme/utils/deeplink';
import { IBulletinUser } from '../../../theme/models/auth';
import { IPageQueries } from '../../../theme/models/page';
import { SearchService, ThemeService } from '../../../theme/services';
import { UserService } from '../user.service';

@Component({
    standalone: false,
    selector: 'app-member-bulletin',
    templateUrl: './bulletin.component.html',
    styleUrls: ['./bulletin.component.scss']
})
export class BulletinComponent implements OnInit {

    public items: IBulletinUser[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        keywords: '',
        page: 1,
        per_page: 20,
    };

    constructor(
        private service: UserService,
        private toastrService: DialogService,
        private router: Router,
        private route: ActivatedRoute,
        private searchService: SearchService,
        private themeService: ThemeService,
    ) {
    }

    ngOnInit() {
        this.themeService.titleChanged.next($localize `Bulletin`);
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            this.tapPage();
        });
    }

    public tapBack() {
        history.back();
    }

    public tapToggle(item: IBulletinUser) {
        item.open = !item.open;
        if (item.status > 0) {
            return;
        }
        this.service.bulletinRead(item.bulletin_id).subscribe(_ => {
            item.status = 1;
        });
    }

    public tapReadAll() {
        this.toastrService.confirm($localize `Sure to mark all messages as read? Messages can still be viewed after they have been read`, () => {
            this.service.bulletinReadAll().subscribe(_ => {
                this.items = this.items.map(i => {
                    if (i.status < 1) {
                        i.status = 1;
                        i.open = false;
                    }
                    return i;
                });
            });
        })
        
    }

    public tapBlock(item: IBlockItem) {
        if (item.link) {
            openLink(this.router, item.link);
            return;
        }
    }

    public tapSearch(form: any) {
        this.queries = this.searchService.getQueries(form, this.queries);
        this.tapRefresh();
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
        this.service.bulletinList(queries).subscribe({
            next: res => {
                this.items = res.data.map(i => {
                    i.open = i.status < 1;
                    return i;
                });
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                this.searchService.applyHistory(this.queries = queries);
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    public tapRemove(item: IBulletinUser) {
        this.toastrService.confirm($localize `Are you sure to delete "${item.bulletin.title}" bulletin？`, () => {
            this.service.bulletinRemove(item.bulletin_id).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success($localize `Delete Successfully`);
                this.items = this.items.filter(it => {
                    return it.id !== item.id;
                });
            });
        })
        
    }

}
