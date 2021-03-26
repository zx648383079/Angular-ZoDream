import {
    Component,
    OnInit
} from '@angular/core';
import {
    ActivatedRoute
} from '@angular/router';
import {
    ToastrService
} from 'ngx-toastr';
import {
    IArticle,
    IArticleCategory
} from '../../../theme/models/shop';
import {
    ArticleService
} from '../article.service';

@Component({
    selector: 'app-article',
    templateUrl: './article.component.html',
    styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {

    public items: IArticle[] = [];

    public hasMore = true;

    public page = 1;

    public perPage = 20;

    public isLoading = false;

    public total = 0;

    public keywords = '';

    public categories: IArticleCategory[] = [];

    public category = 0;

    constructor(
        private service: ArticleService,
        private toastrService: ToastrService,
        private route: ActivatedRoute,
    ) {
        this.service.categoryTree().subscribe(res => {
            this.categories = res.data;
        });
    }

    ngOnInit() {
        this.route.queryParams.subscribe(res => {
            if (res.category) {
                this.category = parseInt(res.category, 10) || 0;
            }
            this.tapRefresh();
        });
    }


    /**
     * tapRefresh
     */
    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.page);
    }

    public tapMore() {
        this.goPage(this.page + 1);
    }

    /**
     * goPage
     */
    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        this.service.articleList({
            keywords: this.keywords,
            cat_id: this.category,
            page,
            per_page: this.perPage
        }).subscribe(res => {
            this.isLoading = false;
            this.items = res.data;
            this.hasMore = res.paging.more;
            this.total = res.paging.total;
        });
    }

    public tapSearch(form: any) {
        this.keywords = form.keywords;
        this.category = form.cat_id;
        this.tapRefresh();
    }

    public tapRemove(item: IArticle) {
        if (!confirm('确定删除“' + item.title + '”文章？')) {
            return;
        }
        this.service.articleRemove(item.id).subscribe(res => {
            if (!res.data) {
                return;
            }
            this.toastrService.success('删除成功');
            this.items = this.items.filter(it => {
                return it.id !== item.id;
            });
        });
    }

}
