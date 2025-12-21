import { form } from '@angular/forms/signals';
import { Component, OnInit, inject, signal } from '@angular/core';
import {
    ActivatedRoute
} from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { IPageQueries } from '../../../../theme/models/page';
import {
    IArticle,
    IArticleCategory
} from '../../model';
import { SearchService } from '../../../../theme/services';
import {
    ArticleService
} from '../article.service';

@Component({
    standalone: false,
    selector: 'app-article',
    templateUrl: './article.component.html',
    styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {
    private readonly service = inject(ArticleService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    public readonly items = signal<IArticle[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public categories: IArticleCategory[] = [];
    public readonly queries = form(signal({
        page: 1,
        per_page: 20,
        keywords: '',
        category: '0',
    }));

    constructor() {
        this.service.categoryTree().subscribe(res => {
            this.categories = res.data;
        });
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            const category = parseInt(params.category, 10) || 0;
            if (category) {
                this.queries.category().value.set(category as any);
            }
        });
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
        });
    }


    /**
     * tapRefresh
     */
    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.queries.page().value());
    }

    public tapMore() {
        this.goPage(this.queries.page().value() + 1);
    }

    /**
     * goPage
     */
    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page};
        this.service.articleList(queries).subscribe(res => {
            this.isLoading.set(false);
            this.items.set(res.data);
            this.hasMore = res.paging.more;
            this.total.set(res.paging.total);
            this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
        });
    }

    public tapSearch() {

        this.tapRefresh();
    }

    public tapRemove(item: IArticle) {
        this.toastrService.confirm('确定删除“' + item.title + '”文章？', () => {
            this.service.articleRemove(item.id).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success($localize `Delete Successfully`);
                this.items.update(v => {
                    return v.filter(it => {
                        return it.id !== item.id;
                    });
                });
            });
        });
    }

}
