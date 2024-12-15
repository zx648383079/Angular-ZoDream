import { Component, OnInit } from '@angular/core';
import { ISitePage } from '../../model';
import { IPageQueries } from '../../../../theme/models/page';
import { VisualService } from '../visual.service';
import { DialogService } from '../../../../components/dialog';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../../../../theme/services';

@Component({
    standalone: false,
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {

    public items: ISitePage[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        keywords: '',
        site: 0,
        page: 1,
        per_page: 20
    };

    constructor(
        private service: VisualService,
        private toastrService: DialogService,
        private route: ActivatedRoute,
        private searchService: SearchService,
    ) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            this.tapPage();
        });
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.queries.page);
    }

    public tapMore() {
        this.goPage(this.queries.page + 1);
    }

    
    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries, page};
        this.service.sitePageList(queries).subscribe({
            next: res => {
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                this.searchService.applyHistory(this.queries = queries);
                this.isLoading = false;
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

    public tapRemove(item: ISitePage) {
        this.toastrService.confirm('确定删除“' + item.title + '”页面？', () => {
            this.service.sitePageRemove(item.id).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success($localize `Delete Successfully`);
                this.items = this.items.filter(it => {
                    return it.id !== item.id;
                });
            });
        })
    }

}
