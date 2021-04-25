import {
    Component,
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

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

    public title = '博客';
    public categories: ICategory[] = [];
    public newItems: IBlog[] = [];
    public commentItems: IComment[] = [];
    public sortItems = [{
            value: 'new',
            name: '最新',
        },
        {
            name: '热门',
            value: 'hot',
        },
        {
            name: '推荐',
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

    constructor(
        private service: BlogService,
        private route: ActivatedRoute,
    ) {
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
        this.route.queryParams.subscribe(params => {
            this.queries = getQueries(params, this.queries);
            if (this.queries.tag) {
                this.header = this.queries.tag;
            }
            this.tapRefresh();
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

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries, page};
        this.service.getPage(queries).subscribe(res => {
            this.hasMore = res.paging.more;
            this.isLoading = false;
            this.items = res.data;
            this.total = res.paging.total;
            applyHistory(this.queries = queries);
        }, () => {
            this.isLoading = false;
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
