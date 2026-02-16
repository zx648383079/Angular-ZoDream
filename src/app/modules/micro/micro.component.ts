import { form, required } from '@angular/forms/signals';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { MicroService } from './micro.service';
import { DialogEvent, DialogService } from '../../components/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { IMicro, ITopic } from './model';
import { IErrorResult, IPageQueries } from '../../theme/models/page';
import { openLink } from '../../theme/utils/deeplink';
import { Store } from '@ngrx/store';
import { AppState } from '../../theme/interfaces';
import { selectAuthUser } from '../../theme/reducers/auth.selectors';
import { IUser } from '../../theme/models/user';
import { IBlockItem } from '../../components/link-rule';
import { SearchService, ThemeService } from '../../theme/services';
import { IItem } from '../../theme/models/seo';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    standalone: false,
    selector: 'app-micro',
    templateUrl: './micro.component.html',
    styleUrls: ['./micro.component.scss']
})
export class MicroComponent {
    private readonly service = inject(MicroService);
    private readonly toastrService = inject(DialogService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly store = inject<Store<AppState>>(Store);
    private readonly searchService = inject(SearchService);
    private readonly themeService = inject(ThemeService);
    private readonly destroyRef = inject(DestroyRef);


    public readonly items = signal<IMicro[]>([]);
    public readonly hasMore = signal(true);
    public readonly isLoading = signal(false);
    public readonly queries = form(signal<IPageQueries>({
        page: 1,
        per_page: 20,
        keywords: '',
        user: 0,
        topic: 0,
        sort: 'new',
    }));
    public readonly forwardItem = signal<IMicro>(null);
    public readonly editForm = form(signal({
        content: '',
        is_comment: false,
        id: 0,
    }), schemaPath => {
        required(schemaPath.content);
    });

    public readonly user = signal<any>(null);
    public readonly topic = signal<ITopic>(null);
    public readonly authUser = signal<IUser>(null);
    public readonly tabItems: IItem[] = [
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

    constructor() {
        this.themeService.titleChanged.next($localize `Micro Blog`);
        this.store.select(selectAuthUser).subscribe(user => {
            this.authUser.set(user);
        });
        this.themeService.suggestTextChanged.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(req => {
            this.service.suggestion({keywords: req.text}).subscribe(res => {
                req.suggest(res);
            });
        });
        this.themeService.suggestQuerySubmitted.subscribe(res => {
            if (typeof res === 'object') {
                this.loadTopic(res.id);
                this.queries.topic().value.set(res.id);
                this.tapRefresh();
                return;
            }
            this.queries.keywords().value.set(res);
            this.tapRefresh();
        });
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            const user = this.queries.user().value() as number;
            if (user > 0) {
                this.loadUser(user);
            }
            const topic = this.queries.topic().value() as number;
            if (topic > 0) {
                this.loadTopic(topic);
            }
            this.tapPage();
        });
    }

    private loadUser(user: number) {
        if (user < 1 || this.user()?.id === user) {
            return;
        }
        this.service.user(user).subscribe({
            next: res => {
                this.user.set(res);
            },
            error: err => {
                this.toastrService.warning(err.error.message);
            }
        });
    }

    private loadTopic(topic: number) {
        if (topic < 1 || this.topic()?.id === topic) {
            return;
        }
        this.service.topic(topic).subscribe({
            next: res => {
                this.topic.set(res);
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
                    this.themeService.emitLogin(true);
                }
            }
        })
    }

    public tapTab(val: any) {
        this.queries.sort().value.set(val);
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

    public tapForward(modal: DialogEvent, item: IMicro) {
        this.forwardItem.set(item);
        this.editForm().value.update(v => {
            v.content = '';
            v.id = item.id,
            v.is_comment = false;
            return {...v};
        })
        modal.open(() => {
            this.service.forward(this.editForm).subscribe(res => {
                this.toastrService.success($localize `Forwarded`);
            });
        }, () => this.editForm().valid());
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
                    this.items.update(v => {
                        return v.filter(it => {
                            return it.id !== item.id;
                        });
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
        this.goPage(this.queries.page().value() + 1);
    }

    public tapPage() {
        this.goPage(this.queries.page().value());
    }

    public goPage(page: number) {
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page};
        this.service.getList(queries).subscribe({
            next: res => {
                this.hasMore.set(res.paging.more);
                this.isLoading.set(false);
                res.data = res.data.map(i => {
                    i.comment_open = false;
                    return i;
                })
                this.items.update(v => {
                    if (page < 2) {
                        return res.data;
                    }
                    return [...v, ...res.data];
                });
                this.queries().value.set(queries);
                this.searchService.applyHistory(queries, false);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

}
