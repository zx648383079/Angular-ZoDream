import { form } from '@angular/forms/signals';
import { Component, OnInit, inject, viewChild, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { IPageQueries } from '../../../../theme/models/page';
import { SearchService } from '../../../../theme/services';
import { CateringService } from '../../catering.service';
import { ICateringCategory, ICateringStock } from '../../model';
import { CustomDialogComponent } from '../goods/custom-dialog/custom-dialog.component';

@Component({
    standalone: false,
    selector: 'app-stock',
    templateUrl: './stock.component.html',
    styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit {
    private readonly service = inject(CateringService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    private readonly customModal = viewChild(CustomDialogComponent);

    public items: ICateringStock[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public readonly queries = form(signal<IPageQueries>({
        keywords: '',
        page: 1,
        per_page: 20
    }));
    public categoryItems: ICateringCategory[] = [];

    ngOnInit() {
        this.service.merchantStockCategory().subscribe(res => {
            this.categoryItems = res.data;
        });
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
        });
    }

    public tapEditCategory(item?: ICateringCategory) {
        const modal = this.customModal();
        modal.value.set(item ? item.name : '');
        modal.open(value => {
            this.service.merchantStockCategorySave({id: item?.id, name: value}).subscribe(res => {
                if (item) {
                    this.categoryItems = this.categoryItems.map(i => {
                        return i.id == res.id ? res : i;
                    });
                } else {
                    this.categoryItems.push(res);
                }
            });
        });
    }

    public tapRemoveCategory(item: ICateringCategory) {
        this.service.merchantStockCategoryRemove(item.id).subscribe(_ => {
            this.categoryItems = this.categoryItems.filter(i => i.id !== item.id);
        });
    }

    public tapSearch() {

        this.tapRefresh();
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.queries.page().value());
    }

    public tapMore() {
        this.goPage(this.queries.page().value() + 1);
    }


    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries().value(), page};
        this.service.merchantStockList(queries).subscribe({
            next: res => {
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

}
