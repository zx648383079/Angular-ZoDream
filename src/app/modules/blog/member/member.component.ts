import { Component, OnInit } from '@angular/core';
import { IPageQueries } from '../../../theme/models/page';
import { DialogService } from '../../../components/dialog';
import { ActivatedRoute } from '@angular/router';
import { SearchService, ThemeService } from '../../../theme/services';
import { IBlog, ICategory } from '../model';
import { BlogService } from './blog.service';
import { IItem } from '../../../theme/models/seo';

@Component({
    standalone: false,
    selector: 'app-member',
    templateUrl: './member.component.html',
    styleUrls: ['./member.component.scss']
})
export class MemberComponent implements OnInit {

    public categories: ICategory[] = [];
    public statusItems: IItem[] = [];

    public items: IBlog[] = [];
    public queries: IPageQueries = {
        keywords: '',
        term: 0,
        status: 0,
        page: 1,
        per_page: 20,
    };
    public hasMore = true;
    public isLoading = false;
    public total = 0;

    constructor(
        private service: BlogService,
        private toastrService: DialogService,
        private route: ActivatedRoute,
        private searchService: SearchService,
        private themeService: ThemeService,
    ) {
        this.service.editOption().subscribe(res => {
            this.categories = res.categories;
            this.statusItems = res.publish_status;
        });
    }

    ngOnInit() {
        this.themeService.titleChanged.next($localize `My Blog`);
        this.route.queryParams.subscribe(res => {
            this.queries = this.searchService.getQueries(res, this.queries);
            this.tapPage();
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
        this.service.blogList(queries).subscribe({
            next: res => {
                this.hasMore = res.paging.more;
                this.isLoading = false;
                this.items = res.data;
                this.total = res.paging.total;
                this.searchService.applyHistory(this.queries = queries);
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    public tapSearch(form: any) {
        this.queries = this.searchService.getQueries(form, this.queries);
        this.tapRefresh();
    }

    public tapPage() {
        this.goPage(this.queries.page);
    }

    public tapRemove(item: IBlog) {
        this.toastrService.confirm($localize `Are you sure to delete the "${item.title}"?`, () => {
            this.service.blogRemove(item.id).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success($localize `Delete Successfully`);
                this.items = this.items.filter(it => {
                    return it.id !== item.id;
                });
            });
        });
    }
}
