import { form, required } from '@angular/forms/signals';
import { Component, OnInit, inject, signal } from '@angular/core';
import { IPageQueries } from '../../../../theme/models/page';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../../components/dialog';
import { SearchService } from '../../../../theme/services';
import { TrackerBackendService } from '../tracker.service';
import { IProduct } from '../../model';

@Component({
    standalone: false,
    selector: 'app-tracker-backend-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
    private readonly service = inject(TrackerBackendService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private readonly searchService = inject(SearchService);


    public items: IProduct[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public readonly queries = form(signal<IPageQueries>({
        keywords: '',
        channel: 0,
        project: 0,
        page: 1,
        per_page: 20,
    }));
    public readonly editForm = form(signal({
        id: 0,
        name: '',
        unique_code: '',
        items: []
    }), schemaPath => {
        required(schemaPath.name);
        required(schemaPath.unique_code);
    });

    ngOnInit() {
        this.route.queryParams.subscribe(res => {
            this.searchService.getQueries(res, this.queries);
            this.tapPage();
        });
    }

    public open(modal: DialogEvent, item?: IProduct) {
        this.editForm().value.update(v => {
            v.id = item?.id ?? 0;
            v.name = item?.name ?? '';
            v.items = item?.items ?? [];
            return v;
        });
        modal.open(() => {
            this.service.productSave(this.editForm().value()).subscribe(_ => {
                this.toastrService.success($localize `Save Successfully`);
                this.tapRefresh();
            });
        }, () => this.editForm().valid());
    }

    public tapAddChannel() {
        this.editForm.items().value.update(v => {
            v.push({
                channel: '',
                platform_no: '',
                extra_meta: ''
            });
            return v;
        });
    }

    public tapRemoveChannel(i: number) {
        this.editForm.items().value.update(v => {
            v.splice(i, 1);
            return v;
        });
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
        this.goPage(this.queries.page().value() + 1);
    }

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries().value(), page};
        this.service.productList(queries).subscribe({
            next: res => {
                this.hasMore = res.paging.more;
                this.isLoading = false;
                this.items = res.data;
                this.total = res.paging.total;
                this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    public tapPage() {
        this.goPage(this.queries.page().value());
    }

    public tapSearch() {

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
