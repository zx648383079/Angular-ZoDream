import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IBlog, ICategory } from '../../../theme/models/blog';
import { IPageQueries } from '../../../theme/models/page';
import { applyHistory, getQueries } from '../../../theme/query';
import { BlogService } from '../blog.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

    public categories: ICategory[] = [];

    public items: IBlog[] = [];
    public queries: IPageQueries = {
        keywords: '',
        term: 0,
        page: 1,
        per_page: 20,
    };
    public hasMore = true;
    public isLoading = false;
    public total = 0;

    constructor(
        private service: BlogService,
        private toastrService: ToastrService,
        private route: ActivatedRoute,
    ) {
        this.service.categoryAll().subscribe(res => {
            this.categories = res;
        });
    }

    ngOnInit() {
        this.route.queryParams.subscribe(res => {
            this.queries = getQueries(res, {
                keywords: '',
                term: 0,
                page: 1,
                per_page: 20,
            });
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

    public tapSearch(form: any) {
        this.queries = getQueries(form, this.queries);
        this.tapRefresh();
    }

    public tapPage() {
        this.goPage(this.queries.page);
    }

    public tapRemove(item: IBlog) {
        if (!confirm('确定要删除《' + item.title + '》?')) {
            return;
        }
        this.service.blogRemove(item.id).subscribe(res => {
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
