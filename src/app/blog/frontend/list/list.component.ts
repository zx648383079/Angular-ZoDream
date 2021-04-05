import {
    Component,
    OnInit
} from '@angular/core';
import {
    BlogService
} from '../blog.service';
import {
    ICategory,
    IBlog
} from '../../../theme/models/blog';
import {
    IUser
} from '../../../theme/models/user';
import {
    ActivatedRoute
} from '@angular/router';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

    public title = '博客';

    public categories: ICategory[] = [];

    public newItems: IBlog[] = [];
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
    public tag = '';
    public sort = 'new';
    public header = '';

    public items: IBlog[] = [];
    public page = 1;
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public perPage = 20;

    constructor(
        private service: BlogService,
        private route: ActivatedRoute,
    ) {
        this.service.getCategories().subscribe(res => {
            this.categories = res;
            if (!this.category) {
                return;
            }
            res.forEach(item => {
                if (item.id === this.category.id) {
                    this.category = item;
                }
            });
        });
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            if (params.tag) {
                this.tag = this.header = params.tag;
            }
            if (params.category) {
                this.category = {id: parseInt(params.category, 10)} as any;
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
        this.goPage(this.page + 1);
    }

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        this.service.getPage({
            page,
            tag: this.tag,
            category: this.category?.id,
            sort: this.sort as any,
        }).subscribe(res => {
            this.page = page;
            this.hasMore = res.paging.more;
            this.isLoading = false;
            this.items = res.data;
            this.total = res.paging.total;
            this.perPage = res.paging.limit;
        }, () => {
            this.isLoading = false;
        });
    }

    public tapPage() {
        this.goPage(this.page);
    }

    public tapSort(item: any) {
        this.sort = item.value;
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
        this.tapRefresh();
    }

    public tapLanguage(item: string) {
        this.header = item;
        this.tapRefresh();
    }
}
