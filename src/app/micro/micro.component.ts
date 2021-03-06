import { Component, OnDestroy, OnInit } from '@angular/core';
import { MicroService } from './micro.service';
import { DialogService } from '../dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { IMicro, ITopic } from './model';
import { emptyValidate } from '../theme/validators';
import { IErrorResult, IPageQueries } from '../theme/models/page';
import { openLink } from '../theme/deeplink';
import { applyHistory, getQueries } from '../theme/query';
import { Store } from '@ngrx/store';
import { AppState } from '../theme/interfaces';
import { getCurrentUser } from '../theme/reducers/auth.selectors';
import { IUser } from '../theme/models/user';
import { DialogBoxComponent } from '../dialog';
import { IBlockItem } from '../link-rule';
import { SearchService, ThemeService } from '../theme/services';

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

    constructor(
        private service: MicroService,
        private toastrService: DialogService,
        private router: Router,
        private route: ActivatedRoute,
        private store: Store<AppState>,
        private searchService: SearchService,
        private themeService: ThemeService,
    ) {
        this.themeService.setTitle('微博客');
        this.store.select(getCurrentUser).subscribe(user => {
            this.authUser = user;
        });
    }

    ngOnInit() {
        this.searchService.on('change', keywords => {
            return this.service.suggestion({keywords});
        }).on('confirm', res => {
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
            this.queries = getQueries(params, this.queries);
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
        this.service.collect(item.id).subscribe(res => {
            item.is_collected = res.is_collected;
            item.collect_count = res.collect_count;
        }, (err: IErrorResult) => {
            this.toastrService.warning(err.error.message);
        });
    }

    public tapRecommend(item: IMicro) {
        this.service.recommend(item.id).subscribe(res => {
            item.is_recommended = res.is_recommended;
            item.recommend_count = res.recommend_count;
        }, (err: IErrorResult) => {
            this.toastrService.warning(err.error.message);
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
                this.toastrService.success('已转发');
            });
        }, () => !emptyValidate(this.editData.content));
    }

    public onPublish(item: IMicro) {
        this.tapRefresh();
    }

    public tapRemove(item: IMicro) {
        if (!confirm('确定要删除这条微博?')) {
            return;
        }
        this.service.remove(item.id).subscribe(res => {
            if (!res.data) {
                return;
            }
            this.toastrService.success('删除成功');
            this.items = this.items.filter(it => {
                return it.id !== item.id;
            });
        }, (err: IErrorResult) => {
            this.toastrService.warning(err.error.message);
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
                applyHistory(this.queries = params, false);
            }, 
            error: () => {
                this.isLoading = false;
            }
        });
    }

}
