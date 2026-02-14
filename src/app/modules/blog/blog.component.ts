import { Component, inject, signal, viewChild } from '@angular/core';
import {
    BlogService
} from './blog.service';
import {
    ICategory,
    IBlog
} from './model';
import {
    IUser
} from '../../theme/models/user';
import {
    ActivatedRoute
} from '@angular/router';
import { DialogService } from '../../components/dialog';
import { SearchService } from '../../theme/services';
import { PullToRefreshComponent } from '../../components/tablet';
import { form } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-blog',
    templateUrl: './blog.component.html',
    styleUrls: ['./blog.component.scss']
})
export class BlogComponent {
    private readonly service = inject(BlogService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private readonly searchService = inject(SearchService);


    public readonly pullBox = viewChild(PullToRefreshComponent);
    public readonly detailMode = signal(false);
    public readonly items = signal<IBlog[]>([]);
    public readonly categories = signal<ICategory[]>([]);
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
    public readonly category = signal(0);
    public readonly sort = signal<'new' | 'hot' | 'best'>('new');
    private page = 1;
    public readonly hasMore = signal(false);
    public readonly isLoading = signal(false);
    public readonly queries = form(signal({
        keywords: ''
    }));

    public readonly data = signal<IBlog>(null);
    public readonly content = signal('');

    constructor() {
        this.service.getCategories().subscribe(res => {
            this.categories.set(res);
        });
        this.tapRefresh();
        this.route.params.subscribe(params => {
            if (!params.id || params.id < 1) {
                this.detailMode.set(false);
                return;
            }
            this.detailMode.set(true);
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
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        const control = this.pullBox();
        control?.enter();
        this.service.getPage({
            category: this.category(),
            keywords: this.queries.keywords().value(),
            sort: this.sort(),
            page
        }).subscribe({
            next: res => {
                this.page = page;
                this.hasMore.set(res.paging.more);
                this.isLoading.set(false);
                this.items.set(page < 2 ? res.data : [].concat(this.items, res.data));
                control?.reset();
            }, 
            error: () => {
                this.isLoading.set(false);
                control?.reset();
            }
        });
    }

    public tapCategory(item: ICategory) {
        this.category.set(item.id);
        this.tapRefresh();
    }

    public tapSort(item: any) {
        this.sort.set(item.value);
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
        this.detailMode.set(true);
        this.loadBlog(item.id);
    }

    public tapRecommend() {
        this.service.blogRecommend(this.data().id).subscribe({
            next: res => {
                this.data.update(v => {
                    return {...v, recommend_count: res.recommend_count}
                });
            }, 
            error: err => {
                this.toastrService.warning(err);
            }
        });
    }

    loadBlog(id: number) {
        this.service.getDetail(id).subscribe(res => {
            this.data.set(res);
            this.content.set(res.content);
            this.searchService.pushHistoryState(res.title,
                window.location.href.replace(/blog.*$/, 'blog/' + res.id.toString()));
            document.documentElement.scrollTop = 0;
        });
    }

}
