import { Component, OnDestroy, OnInit } from '@angular/core';
import { MicroService } from './micro.service';
import { DialogService } from '../../components/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { IMicro, ITopic } from './model';
import { emptyValidate } from '../../theme/validators';
import { IErrorResult, IPageQueries } from '../../theme/models/page';
import { openLink } from '../../theme/deeplink';
import { Store } from '@ngrx/store';
import { AppState } from '../../theme/interfaces';
import { selectAuthUser } from '../../theme/reducers/auth.selectors';
import { IUser } from '../../theme/models/user';
import { DialogBoxComponent } from '../../components/dialog';
import { IBlockItem } from '../../components/link-rule';
import { SearchService, ThemeService } from '../../theme/services';
import { IItem } from '../../theme/models/seo';
import { SearchEvents } from '../../theme/models/event';

@Component({
    selector: 'app-micro',
    templateUrl: './micro.component.html',
    styleUrls: ['./micro.component.scss']
})
export class MicroComponent implements OnInit, OnDestroy {

    public items: IMicro[] = [];
    public hasMore = true;
    public isLoading = false;
    public queries: IPageQueries = {
        page: 1,
        per_page: 20,
        keywords: '',
        user: 0,
        topic: 0,
        sort: 'new',
    }
    public forwardItem: IMicro;
    public editData = {
        content: '',
        is_comment: false,
        id: 0,
    };

    public user: any;
    public topic: ITopic;
    public authUser: IUser;
    public tabItems: IItem[] = [
        {
            name: $localize `Recommend`,
            value: 'recommend',
        },
        {
            value: 'new',
            name: $localize `New`,
        },
        {
            name: $localize `Hot`,
            value: 'hot',
        }
    ];

    constructor(
        private service: MicroService,
        private toastrService: DialogService,
        private router: Router,
        private route: ActivatedRoute,
        private store: Store<AppState>,
        private searchService: SearchService,
        private themeService: ThemeService,
    ) {
        this.themeService.setTitle($localize `Micro Blog`);
        this.store.select(selectAuthUser).subscribe(user => {
            this.authUser = user;
        });
    }

    ngOnInit() {
        this.searchService.on(SearchEvents.CHANGE, keywords => {
            return this.service.suggestion({keywords});
        });
        this.searchService.on(SearchEvents.CONFIRM, res => {
            if (typeof res === 'object') {
                this.loadTopic(res.id);
                this.queries.topic = res.id;
                this.tapRefresh();
                return;
            }
            this.queries.keywords = res;
            this.tapRefresh();
        });
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            if (this.queries.user > 0) {
                this.loadUser(this.queries.user);
            }
            if (this.queries.topic > 0) {
                this.loadTopic(this.queries.topic);
            }
            this.tapPage();
        });
    }

    ngOnDestroy() {
        this.searchService.offReceiver();
    }

    private loadUser(user: number) {
        if (user < 1 || this.user?.id === user) {
            return;
        }
        this.service.user(user).subscribe({
            next: res => {
                this.user = res;
            },
            error: err => {
                this.toastrService.warning(err.error.message);
            }
        });
    }

    private loadTopic(topic: number) {
        if (topic < 1 || this.topic?.id === topic) {
            return;
        }
        this.service.topic(topic).subscribe({
            next: res => {
                this.topic = res;
            }, 
            error: err => {
                this.toastrService.warning(err.error.message);
            }
        });
    }

    public tapFollow(user: any) {
        this.service.toggleFollow(user.id).subscribe({
            next: res => {
                user.follow_status = res.data;
            },
            error: (err: IErrorResult) => {
                this.toastrService.error(err.error);
                if (err.error.code === 401) {
                    this.searchService.emitLogin(true);
                }
            }
        })
    }

    public tapTab(val: any) {
        this.queries.sort = val;
        this.tapRefresh();
    }

    public tapBlock(item: IBlockItem) {
        if (item.user) {
            this.router.navigate(['./'], {relativeTo: this.route, queryParams: {
                user: item.user
            }});
            return;
        }
        if (item.topic) {
            this.router.navigate(['./'], {relativeTo: this.route, queryParams: {
                topic: item.topic
            }});
            return;
        }
        if (item.link) {
            openLink(this.router, item.link);
            return;
        }
    }

    public tapUser(item: IMicro) {
        this.router.navigate(['./'], {relativeTo: this.route, queryParams: {
            user: item.user_id
        }});
    }

    public tapToggleComment(item: IMicro) {
        item.comment_open = !item.comment_open;
    }

    public tapViewDetail(item: IMicro) {
        this.router.navigate(['detail', item.id], {relativeTo: this.route});
    }

    public tapCollect(item: IMicro) {
        this.service.collect(item.id).subscribe({
            next: res => {
                item.is_collected = res.is_collected;
                item.collect_count = res.collect_count;
            }, 
            error: (err: IErrorResult) => {
                this.toastrService.warning(err.error.message);
            }
        });
    }

    public tapRecommend(item: IMicro) {
        this.service.recommend(item.id).subscribe({
            next: res => {
                item.is_recommended = res.is_recommended;
                item.recommend_count = res.recommend_count;
            }, 
            error: (err: IErrorResult) => {
                this.toastrService.warning(err.error.message);
            }
        });
    }

    public tapForward(modal: DialogBoxComponent, item: IMicro) {
        this.forwardItem = item;
        this.editData = {
            content: '',
            is_comment: false,
            id: item.id,
        };
        modal.open(() => {
            this.service.forward(this.editData).subscribe(res => {
                this.toastrService.success($localize `Forwarded`);
            });
        }, () => !emptyValidate(this.editData.content));
    }

    public onPublish(item: IMicro) {
        this.tapRefresh();
    }

    public tapRemove(item: IMicro) {
        this.toastrService.confirm($localize `Are you sure you want to delete this post? `, () => {
            this.service.remove(item.id).subscribe({
                next: res => {
                    if (!res.data) {
                        return;
                    }
                    this.toastrService.success($localize `successfully deleted! `);
                    this.items = this.items.filter(it => {
                        return it.id !== item.id;
                    });
                }, 
                error: err => {
                    this.toastrService.warning(err);
                }
            });
        });
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapMore() {
        if (!this.hasMore) {
            return;
        }
        this.goPage(this.queries.page + 1);
    }

    public tapPage() {
        this.goPage(this.queries.page);
    }

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const params: any = {...this.queries, page};
        this.service.getList(params).subscribe({
            next: res => {
                this.hasMore = res.paging.more;
                this.isLoading = false;
                res.data = res.data.map(i => {
                    i.comment_open = false;
                    return i;
                })
                this.items = page < 2 ? res.data : [].concat(this.items, res.data);
                this.searchService.applyHistory(this.queries = params, false);
            }, 
            error: () => {
                this.isLoading = false;
            }
        });
    }

}
