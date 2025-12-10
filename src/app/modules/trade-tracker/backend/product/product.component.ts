import { Component, OnInit, inject } from '@angular/core';
import { IPageQueries } from '../../../../theme/models/page';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../../components/dialog';
import { SearchService } from '../../../../theme/services';
import { TrackerBackendService } from '../tracker.service';
import { IProduct } from '../../model';
import { emptyValidate } from '../../../../theme/validators';

@Component({
    standalone: false,
    selector: 'app-tracker-backend-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
    private service = inject(TrackerBackendService);
    private route = inject(ActivatedRoute);
    private toastrService = inject(DialogService);
    private searchService = inject(SearchService);


    public items: IProduct[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        keywords: '',
        channel: 0,
        project: 0,
        page: 1,
        per_page: 20,
    };
    public editData = {
        items: []
    } as any;

    ngOnInit() {
        this.route.queryParams.subscribe(res => {
            this.queries = this.searchService.getQueries(res, this.queries);
            this.tapPage();
        });
    }

    public open(modal: DialogEvent, item?: IProduct) {
        this.editData = item ? Object.assign({items: []}, item) : {
            id: 0,
            name: '',
            items: []
        };
        modal.open(() => {
            this.service.productSave(this.editData).subscribe(_ => {
                this.toastrService.success($localize `Save Successfully`);
                this.tapRefresh();
            });
        }, () => {
            return !emptyValidate(this.editData.name) && !emptyValidate(this.editData.unique_code);
        });
    }

    public tapAddChannel() {
        this.editData.items.push({
            channel: '',
            platform_no: '',
            extra_meta: ''
        });
    }

    public tapRemoveChannel(i: number) {
        this.editData.items.splice(i, 1);
    }

    public tapImport() {
        // this.modal.open();
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
        this.service.productList(queries).subscribe({
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

    public tapRemove(item: IProduct) {
        this.toastrService.confirm('确定删除“' + item.name + '”产品？', () => {
            this.service.productRemove(item.id).subscribe(res => {
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
