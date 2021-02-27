import {
    Component,
    OnInit
} from '@angular/core';
import {
    GoodsService
} from '../goods.service';
import {
    IBrand,
    ICategory,
    IGoods
} from '../../../../theme/models/shop';
import {
    ToastrService
} from 'ngx-toastr';
import {
    ActivatedRoute
} from '@angular/router';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

    public items: IGoods[] = [];
    public hasMore = true;
    public page = 1;
    public perPage = 20;
    public isLoading = false;
    public total = 0;
    public keywords = '';
    public category = 0;
    public brand = 0;
    public categories: ICategory[] = [];
    public brandItems: IBrand[] = [];

    constructor(
        private service: GoodsService,
        private toastrService: ToastrService,
        private route: ActivatedRoute,
    ) {
        this.service.categoryAll().subscribe(res => {
            this.categories = res.data;
        });
        this.service.brandAll().subscribe(res => {
            this.brandItems = res.data;
        });
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            if (params.category) {
                this.category = params.category;
            }
            if (params.brand) {
                this.brand = params.brand;
            }
            this.tapRefresh();
        });
    }

    public get pageTotal(): number {
        return Math.ceil(this.total / this.perPage);
    }

    /**
     * tapRefresh
     */
    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.page);
    }

    public tapMore() {
        this.goPage(this.page + 1);
    }

    /**
     * goPage
     */
    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        this.service.get({
            keywords: this.keywords,
            category: this.category,
            brand: this.brand,
            page,
            per_page: this.perPage
        }).subscribe(res => {
            this.isLoading = false;
            this.items = res.data;
            this.hasMore = res.paging.more;
            this.total = res.paging.total;
        });
    }

    public tapSearch(form: any) {
        this.keywords = form.keywords;
        this.category = form.cat_id || 0;
        this.brand = form.brand_id || 0;
        this.tapRefresh();
    }

    public tapRemove(item: IGoods) {
        if (!confirm('确定删除“' + item.name + '”商品？')) {
            return;
        }
        this.service.goodsRemove(item.id).subscribe(res => {
            if (!res.data) {
                return;
            }
            this.toastrService.success('删除成功');
            this.items = this.items.filter(it => {
                return it.id !== item.id;
            });
        });
    }

}
