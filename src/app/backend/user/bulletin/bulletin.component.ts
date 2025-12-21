import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from '../../../components/dialog';
import { IBlockItem } from '../../../components/link-rule';
import { openLink } from '../../../theme/utils/deeplink';
import { IBulletinUser } from '../../../theme/models/auth';
import { IPageQueries } from '../../../theme/models/page';
import { SearchService } from '../../../theme/services';
import { UserService } from '../user.service';
import { form } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-bulletin',
    templateUrl: './bulletin.component.html',
    styleUrls: ['./bulletin.component.scss']
})
export class BulletinComponent implements OnInit {
    private readonly service = inject(UserService);
    private readonly toastrService = inject(DialogService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    public readonly items = signal<IBulletinUser[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal<IPageQueries>({
        keywords: '',
        page: 1,
        per_page: 20,
    }));

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
        });
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
        this.toastrService.confirm('确定把所有的消息标为已读？已读后仍可查看消息', () => {
            this.service.bulletinReadAll().subscribe(_ => {
                this.items.update(v => {
                    return v.map(i => {
                        if (i.status < 1) {
                            i.status = 1;
                            i.open = false;
                        }
                        return i;
                    });
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

    public tapSearch() {

        this.tapRefresh();
    }

    /**
    * tapRefresh
    */
    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.queries.page().value());
    }

    public tapMore() {
        this.goPage(this.queries.page().value() + 1);
    }

    /**
    * goPage
    */
    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page};
        this.service.bulletinList(queries).subscribe({
            next: res => {
                this.items.set(res.data.map(i => {
                    i.open = i.status < 1;
                    return i;
                }));
                this.hasMore = res.paging.more;
                this.total.set(res.paging.total);
                this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
                this.isLoading.set(false);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

    public tapRemove(item: IBulletinUser) {
        this.toastrService.confirm('确定删除“' + item.bulletin.title + '”消息？', () => {
            this.service.bulletinRemove(item.bulletin_id).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success($localize `Delete Successfully`);
                this.items.update(v => {
                    return v.filter(it => {
                        return it.id !== item.id;
                    });
                });;
            });
        })

    }

}
