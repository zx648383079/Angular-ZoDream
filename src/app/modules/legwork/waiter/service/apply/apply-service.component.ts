import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../components/dialog';
import { IErrorResult, IPageQueries } from '../../../../../theme/models/page';
import { SearchService } from '../../../../../theme/services';
import { LegworkService } from '../../../legwork.service';
import { ICategory, IService } from '../../../model';

@Component({
    standalone: false,
  selector: 'app-apply-service',
  templateUrl: './apply-service.component.html',
  styleUrls: ['./apply-service.component.scss']
})
export class ApplyServiceComponent implements OnInit {
    private service = inject(LegworkService);
    private toastrService = inject(DialogService);
    private route = inject(ActivatedRoute);
    private searchService = inject(SearchService);


    public categories: ICategory[] = [];
    public items: IService[] = [];
    public hasMore = true;
    public isLoading = false;
    public queries: IPageQueries = {
        category: 0,
        keywords: '',
        page: 1,
        per_page: 20
    };

    ngOnInit() {
        this.service.categoryList().subscribe(res => {
            this.categories = res.data;
        });
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            this.tapPage();
        });
    }

    public tapApply(item: IService) {
        this.service.waiterServiceApply(item.id).subscribe(_ => {
            this.toastrService.success('已提交申请，等待审核');
        }, (err: IErrorResult) => {
            this.toastrService.warning(err.error.message);
        });
    }

    public tapSearch(form: any) {
        this.queries = this.searchService.getQueries(form, this.queries);
        this.tapRefresh();
    }

    public tapCategory(item?: ICategory) {
        this.queries.category = item ? item.id : 0;
        this.tapRefresh();
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.queries.page);
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
        this.service.waiterServiceList({...queries, all: true}).subscribe({
            next: res => {
                this.hasMore = res.paging.more;
                this.isLoading = false;
                this.items = page < 2 ? res.data : [].concat(this.items, res.data);
                this.searchService.applyHistory(this.queries = queries);
            }, 
            error: () => {
                this.isLoading = false;
            }
        });
    }

}
