import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService, DialogEvent } from '../../../../../components/dialog';
import { UploadButtonEvent } from '../../../../../components/form';
import { IPageQueries } from '../../../../../theme/models/page';
import { DownloadService, SearchService } from '../../../../../theme/services';
import { IGoodsCard } from '../../../model';
import { ShopService } from '../../shop.service';

@Component({
    standalone: false,
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {

    public items: IGoodsCard[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        keywords: '',
        goods: 0,
        page: 1,
        per_page: 20,
    };
    public editData = {
        amount: 1,
    };

    constructor(
        private service: ShopService,
        private toastrService: DialogService,
        private route: ActivatedRoute,
        private downloadService: DownloadService,
        private searchService: SearchService,
    ) {
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
        });
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            this.tapPage();
        });
    }

    public tapGenerate(modal: DialogEvent) {
        modal.open(() => {
            this.service.cardGenerate({
                amount: this.editData.amount,
                goods: this.queries.goods
            }).subscribe({
                next: _ => {
                    this.toastrService.success('生成成功');
                    this.tapRefresh();
                },
                error: err => {
                    this.toastrService.error(err);
                }
            })
        }, () => this.editData.amount > 0);
    }

    public tapExport() {
        this.downloadService.export('shop/admin/goods/card_export', {
            goods: this.queries.goods
        }, '卡密记录.xlsx');
    }

    public onUploadFile(event: UploadButtonEvent) {
        const form = new FormData();
        form.append('file', event.files[0]);
        form.append('goods', this.queries.goods);
        event.enter();
        this.service.cardImport(form).subscribe({
            next: _ => {
                event.reset();
                this.tapRefresh();
                this.toastrService.success('导入成功');
            },
            error: err => {
                event.reset();
                this.toastrService.error(err);
            }
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

    /**
     * goPage
     */
    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries, page};
        this.service.cardList(queries).subscribe(res => {
            this.isLoading = false;
            this.items = res.data;
            this.hasMore = res.paging.more;
            this.total = res.paging.total;
            this.searchService.applyHistory(this.queries = queries, ['goods']);
        });
    }

    public tapSearch(form: any) {
        this.queries = this.searchService.getQueries(form, this.queries);
        this.tapRefresh();
    }

    public tapRemove(item: IGoodsCard) {
        this.toastrService.confirm('确定删除“' + item.card_no + '”卡密？', () => {
            this.service.cardRemove(item.id).subscribe(res => {
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
