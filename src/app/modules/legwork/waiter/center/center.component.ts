import { form } from '@angular/forms/signals';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { IErrorResult, IPageQueries } from '../../../../theme/models/page';
import { SearchService } from '../../../../theme/services';
import { LegworkService } from '../../legwork.service';
import { IOrder } from '../../model';

@Component({
    standalone: false,
  selector: 'app-center',
  templateUrl: './center.component.html',
  styleUrls: ['./center.component.scss']
})
export class CenterComponent implements OnInit {
    private readonly service = inject(LegworkService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    public items: IOrder[] = [];
    public hasMore = true;
    public isLoading = false;
    public readonly queries = form(signal<IPageQueries>({
        keywords: '',
        page: 1,
        per_page: 20
    }));

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
        });
    }

    public tapSearch() {

        this.tapRefresh();
    }

    public tapTaking(item: IOrder) {
        this.toastrService.confirm($localize `Please confirm to take this order? `, () => {
            this.service.waiterTaking(item.id).subscribe({
                next: _ => {
                    this.toastrService.success($localize `Taking successfully`);
                    this.tapRefresh();
                },
                error: (err: IErrorResult) => {
                    this.toastrService.warning(err.error.message);
                }
            });
        });
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
        this.isLoading = true;
        const queries = {...this.queries().value(), page};
        this.service.waitingOrderList(queries).subscribe({
            next: res => {
                this.hasMore = res.paging.more;
                this.isLoading = false;
                this.items = page < 2 ? res.data : [].concat(this.items, res.data);
                this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

}
