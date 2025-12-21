import { form } from '@angular/forms/signals';
import { Component, OnInit, inject, signal } from '@angular/core';
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
    private readonly service = inject(LegworkService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    public categories: ICategory[] = [];
    public readonly items = signal<IService[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly queries = form(signal<IPageQueries>({
        category: 0,
        keywords: '',
        page: 1,
        per_page: 20
    }));

    ngOnInit() {
        this.service.categoryList().subscribe(res => {
            this.categories = res.data;
        });
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
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

    public tapSearch() {

        this.tapRefresh();
    }

    public tapCategory(item?: ICategory) {
        this.queries.category().value.set(item ? item.id : 0);
        this.tapRefresh();
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.queries.page().value());
    }

    public tapMore() {
        if (!this.hasMore) {
            return;
        }
        this.goPage(this.queries.page().value() + 1);
    }

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page};
        this.service.waiterServiceList({...queries, all: true}).subscribe({
            next: res => {
                this.hasMore = res.paging.more;
                this.isLoading.set(false);
                this.items.set(page < 2 ? res.data : [].concat(this.items, res.data));
                this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

}
