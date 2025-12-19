import { form } from '@angular/forms/signals';
import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import {
    BlogService
} from '../blog.service';
import {
    ICategory,
    IBlog,
    IComment
} from '../../model';
import {
    IUser
} from '../../../../theme/models/user';
import {
    ActivatedRoute
} from '@angular/router';
import { IPageQueries } from '../../../../theme/models/page';
import { SearchService, ThemeService } from '../../../../theme/services';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../theme/interfaces';
import { selectSystemConfig } from '../../../../theme/reducers/system.selectors';
import { Subscription } from 'rxjs';
import { parseNumber } from '../../../../theme/utils';

@Component({
    standalone: false,
    selector: 'app-blog-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {
    private readonly service = inject(BlogService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);
    private readonly themeService = inject(ThemeService);
    private readonly store = inject<Store<AppState>>(Store);

    public categories: ICategory[] = [];
    public newItems: IBlog[] = [];
    public commentItems: IComment[] = [];
    public sortItems = [{
            value: 'new',
            name: $localize `New`,
        },
        {
            name: $localize `Hot`,
            value: 'hot',
        },
        {
            name: $localize `Best`,
            value: 'best',
        }
    ];
    public category: ICategory;
    public header = '';
    public items: IBlog[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public readonly queries = form(signal({
        page: 1,
        per_page: 20,
        keywords: '',
        tag: '',
        sort: 'new',
        user: 0,
        category: 0,
        language: '',
        programming_language: '',
    }));
    public listView = 0;

    private subItems = new Subscription();

    private searchFn = res => {
        if (typeof res === 'object') {
            return;
        }
        this.queries.keywords().value.set(res);
        this.tapRefresh();
        return false;
    };

    constructor() {
        this.themeService.titleChanged.next($localize `Blog`);
        this.store.select(selectSystemConfig).subscribe(res => {
            this.listView = parseNumber(res.blog_list_view);
        });
        this.service.batch({
            categories: {},
            new_comment: {},
            new_blog: {},
        }).subscribe(res => {
            this.newItems = res.new_blog;
            this.commentItems = res.new_comment;
            this.categories = res.categories;
            if (!this.category) {
                return;
            }
            res.categories.forEach(item => {
                if (item.id === this.category.id) {
                    this.category = item;
                }
            });
        });
    }

    ngOnInit() {
        this.subItems.add(
            this.themeService.suggestQuerySubmitted.subscribe(this.searchFn)
        );
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            const tag = this.queries.tag().value();
            if (tag) {
                this.header = tag;
            }
            this.tapRefresh();
        });
    }

    ngOnDestroy() {
        this.subItems.unsubscribe();
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

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries().value(), page};
        this.items = [];
        this.service.getPage(queries as any).subscribe({
            next: res => {
                this.hasMore = res.paging.more;
                this.items = res.data;
                this.total = res.paging.total;
                this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    public tapPage() {
        this.goPage(this.queries.page().value());
    }

    public tapSort(item: any) {
        this.queries.sort().value.set(item.value);
        this.tapRefresh();
    }

    public tapUser(item: IUser) {
        if (!item) {
            return;
        }
        this.tapRefresh();
    }

    public tapCategory(item: ICategory) {
        this.category = item;
        this.queries.category().value.set(item.id);
        this.tapRefresh();
    }

    public tapLanguage(item: string) {
        this.header = item;
        this.queries.programming_language().value.set(item);
        this.tapRefresh();
    }
}
