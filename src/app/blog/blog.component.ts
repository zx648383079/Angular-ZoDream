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
} from '../theme/models/blog';
import {
    SafeHtml,
    DomSanitizer
} from '@angular/platform-browser';
import {
    IUser
} from '../theme/models/user';
import {
    PullToRefreshComponent
} from '../theme/components';
import {
    ActivatedRoute
} from '@angular/router';

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
    public category = 0;
    public sort: 'new' | 'hot' | 'best' = 'new';
    public page = 1;
    public hasMore = true;
    public isLoading = false;
    public keywords = '';

    public blog: IBlog;

    public content: SafeHtml;

    constructor(
        private sanitizer: DomSanitizer,
        private service: BlogService,
        private route: ActivatedRoute) {
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
        }).subscribe(res => {
            this.page = page;
            this.hasMore = res.paging.more;
            this.isLoading = false;
            this.items = page < 2 ? res.data : [].concat(this.items, res.data);
            this.pullBox?.endLoad();
        }, () => {
            this.isLoading = false;
            this.pullBox?.endLoad();
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

    loadBlog(id: number) {
        this.service.getDetail(id).subscribe(res => {
            this.blog = res;
            this.content = this.sanitizer.bypassSecurityTrustHtml(res.content);
            history.pushState(null, res.title,
                window.location.href.replace(/blog.*$/, 'blog/' + res.id.toString()));
            document.documentElement.scrollTop = 0;
        });
    }

}
