import { Component, OnInit, inject, viewChild } from '@angular/core';
import { DialogService } from '../../../../components/dialog';
import { CustomDialogComponent } from './custom-dialog/custom-dialog.component';
import { GoodsDialogComponent } from './dialog/goods-dialog.component';
import { ICateringCategory, ICateringProduct } from '../../model';
import { IPageQueries } from '../../../../theme/models/page';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../../../../theme/services';
import { CateringService } from '../../catering.service';

@Component({
    standalone: false,
    selector: 'app-goods',
    templateUrl: './goods.component.html',
    styleUrls: ['./goods.component.scss']
})
export class GoodsComponent implements OnInit {
    private readonly service = inject(CateringService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private searchService = inject(SearchService);


    private readonly modal = viewChild(GoodsDialogComponent);
    private readonly customModal = viewChild(CustomDialogComponent);

    public items: ICateringProduct[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        keywords: '',
        page: 1,
        per_page: 20
    };
    public categoryItems: ICateringCategory[] = [];

    ngOnInit() {
        this.service.merchantProductCategory().subscribe(res => {
            this.categoryItems = res.data;
        });
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            this.tapPage();
        });
    }

    public tapEdit() {
        this.modal().open();
    }

    public tapEditCategory(item?: ICateringCategory) {
        const modal = this.customModal();
        modal.value.set(item ? item.name : '');
        modal.open(value => {
            this.service.merchantProductCategorySave({id: item?.id, name: value}).subscribe(res => {
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
        this.service.merchantProductCategoryRemove(item.id).subscribe(_ => {
            this.categoryItems = this.categoryItems.filter(i => i.id !== item.id);
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
        this.goPage(this.queries.page + 1);
    }

    
    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries, page};
        this.service.merchantProductList(queries).subscribe({
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
}
