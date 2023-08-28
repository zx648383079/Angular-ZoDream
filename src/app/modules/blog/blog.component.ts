import {
    Component,
    OnInit,
    ViewChild
} from '@angular/core';
import {
    BlogService
} from './blog.service';
import {
    ICategory,
    IBlog
} from './model';
import {
    SafeHtml,
    DomSanitizer
} from '@angular/platform-browser';
import {
    IUser
} from '../../theme/models/user';
import {
    PullToRefreshComponent
} from '../../theme/components';
import {
    ActivatedRoute
} from '@angular/router';
import { IErrorResult } from '../../theme/models/page';
import { DialogService } from '../../components/dialog';
import { SearchService } from '../../theme/services';

@Component({
    selector: 'app-blog',
    templateUrl: './blog.component.html',
    styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {

    @ViewChild(PullToRefreshComponent)
    public pullBox: PullToRefreshComponent;

    public detailMode = false;

    public items: IBlog[] = [];

    public categories: ICategory[] = [];

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
    public category = 0;
    public sort: 'new' | 'hot' | 'best' = 'new';
    public page = 1;
    public hasMore = true;
    public isLoading = false;
    public keywords = '';

    public blog: IBlog;

    public content = '';

    constructor(
        private service: BlogService,
        private route: ActivatedRoute,
        private toastrService: DialogService,
        private searchService: SearchService,
    ) {
        this.service.getCategories().subscribe(res => {
            this.categories = res;
        });
    }

    ngOnInit(): void {
        this.tapRefresh();
        this.route.params.subscribe(params => {
            if (!params.id || params.id < 1) {
                this.detailMode = false;
                return;
            }
            this.detailMode = true;
            this.loadBlog(params.id);
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
        this.pullBox?.startLoad();
        this.service.getPage({
            category: this.category,
            keywords: this.keywords,
            sort: this.sort,
            page
        }).subscribe({
            next: res => {
                this.page = page;
                this.hasMore = res.paging.more;
                this.isLoading = false;
                this.items = page < 2 ? res.data : [].concat(this.items, res.data);
                this.pullBox?.endLoad();
            }, 
            error: () => {
                this.isLoading = false;
                this.pullBox?.endLoad();
            }
        });
    }

    public tapCategory(item: ICategory) {
        this.category = item.id;
        this.tapRefresh();
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

    public tapLanguage(item: string) {
        this.tapRefresh();
    }

    public tapTag(item: string) {
        this.tapRefresh();
    }

    public tapItem(item: any) {
        this.detailMode = true;
        this.loadBlog(item.id);
    }

    public tapRecommend() {
        this.service.blogRecommend(this.blog.id).subscribe(res => {
            this.blog.recommend_count = res.recommend_count;
        }, (err: IErrorResult) => {
            this.toastrService.warning(err.error.message);
        });
    }

    loadBlog(id: number) {
        this.service.getDetail(id).subscribe(res => {
            this.blog = res;
            this.content = res.content;
            this.searchService.pushHistoryState(res.title,
                window.location.href.replace(/blog.*$/, 'blog/' + res.id.toString()));
            document.documentElement.scrollTop = 0;
        });
    }

}
