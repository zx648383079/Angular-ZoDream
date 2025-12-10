import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../components/dialog';
import { IPageQueries } from '../../../../../theme/models/page';
import { IUser } from '../../../../../theme/models/user';
import { SearchService } from '../../../../../theme/services';
import { LegworkService } from '../../../legwork.service';
import { IService } from '../../../model';

@Component({
    standalone: false,
  selector: 'app-waiter',
  templateUrl: './waiter.component.html',
  styleUrls: ['./waiter.component.scss']
})
export class WaiterComponent implements OnInit {
    private service = inject(LegworkService);
    private route = inject(ActivatedRoute);
    private toastrService = inject(DialogService);
    private searchService = inject(SearchService);


    public items: IUser[] = [];
    public hasMore = true;
    public isLoading = false;
    public queries: IPageQueries = {
        keywords: '',
        page: 1,
        per_page: 20
    };
    public data: IService;

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
        });
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.loadService(params.id);
        });
    }

    private loadService(id: any) {
        this.service.providerService(id).subscribe(res => {
            this.data = res;
            this.tapPage();
        });
    }

    public tapChange(item: IUser, status = 1) {
        this.service.providerWaiterChange({
            id: this.data.id,
            user_id: item.id,
            status
        }).subscribe({
            next: _ => {
                this.toastrService.success($localize `Edit successfully`);
            },
            error: err => {
                this.toastrService.error(err);
            }
        });
    }

    public tapSearch(form: any) {
        this.queries = this.searchService.getQueries(form, this.queries);
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
        const queries = {...this.queries, page, id: this.data.id};
        this.service.providerWaiterList(queries).subscribe({
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
