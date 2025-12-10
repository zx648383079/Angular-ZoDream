import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { IPageQueries } from '../../../../theme/models/page';
import { SearchService } from '../../../../theme/services';
import { ICmsComment } from '../../model';
import { CmsService } from '../cms.service';

@Component({
    standalone: false,
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
    private service = inject(CmsService);
    private route = inject(ActivatedRoute);
    private toastrService = inject(DialogService);
    private searchService = inject(SearchService);


    public items: ICmsComment[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        keywords: '',
        page: 1,
        per_page: 20,
        user: 0,
        category: 0,
        article: 0,
        model: 0,
        site: 0,
    };

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
        });
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
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
        this.service.commentList(queries).subscribe({
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

    public tapPage() {
        this.goPage(this.queries.page);
    }

    public tapSearch(form: any) {
        this.queries = this.searchService.getQueries(form, this.queries);
        this.tapRefresh();
    }

    public tapRemove(item: ICmsComment) {
        this.toastrService.confirm('确定删除“' + item.content + '”评论？', () => {
            this.service.commentRemove({
                article: this.queries.article,
                site: this.queries.site,
                category: this.queries.category,
                model: this.queries.model,
                id: item.id
            }).subscribe(res => {
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
