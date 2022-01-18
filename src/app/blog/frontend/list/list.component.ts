import {
    Component,
    OnDestroy,
    OnInit
} from '@angular/core';
import {
    BlogService
} from '../blog.service';
import {
    ICategory,
    IBlog,
    IComment
} from '../../../theme/models/blog';
import {
    IUser
} from '../../../theme/models/user';
import {
    ActivatedRoute
} from '@angular/router';
import { IPageQueries } from '../../../theme/models/page';
import { applyHistory, getQueries } from '../../../theme/query';
import { SearchService, ThemeService } from '../../../theme/services';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {
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
    public queries: IPageQueries = {
        page: 1,
        per_page: 20,
        keywords: '',
        tag: '',
        sort: 'new',
        user: 0,
        category: 0,
        language: '',
        programming_language: '',
    };

    private searchFn = res => {
        if (typeof res === 'object') {
            return;
        }
        this.queries.keywords = res;
        this.tapRefresh();
        return false;
    };

    constructor(
        private service: BlogService,
        private route: ActivatedRoute,
        private searchService: SearchService,
        private themeService: ThemeService,
    ) {
        this.themeService.setTitle('Blog');
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
        this.searchService.on('confirm', this.searchFn);
        this.route.queryParams.subscribe(params => {
            this.queries = getQueries(params, this.queries);
            if (this.queries.tag) {
                this.header = this.queries.tag;
            }
            this.tapRefresh();
        });
    }

    ngOnDestroy() {
        this.searchService.off('confirm', this.searchFn);
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

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries, page};
        this.items = [];
        this.service.getPage(queries).subscribe({
            next: res => {
                this.hasMore = res.paging.more;
                this.items = res.data;
                this.total = res.paging.total;
                applyHistory(this.queries = queries);
            }, 
            complete: () => {
                this.isLoading = false;
            }
        });
    }

    public tapPage() {
        this.goPage(this.queries.page);
    }

    public tapSort(item: any) {
        this.queries.sort = item.value;
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
        this.queries.category = item.id;
        this.tapRefresh();
    }

    public tapLanguage(item: string) {
        this.header = item;
        this.queries.programming_language = item;
        this.tapRefresh();
    }
}
