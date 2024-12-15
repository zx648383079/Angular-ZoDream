import {
    Component,
    OnInit
} from '@angular/core';
import {
    ActivatedRoute
} from '@angular/router';
import {
    AdService
} from '../ad.service';
import { DialogService } from '../../../components/dialog';
import { IPageQueries } from '../../../theme/models/page';
import { SearchService } from '../../../theme/services';
import { IAd } from '../model';

@Component({
    standalone: false,
    selector: 'app-ad',
    templateUrl: './ad.component.html',
    styleUrls: ['./ad.component.scss']
})
export class AdComponent implements OnInit {

    public items: IAd[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        page: 1,
        per_page: 20,
        keywords: '',
        position: 0,
    };

    constructor(
        private service: AdService,
        private toastrService: DialogService,
        private route: ActivatedRoute,
        private searchService: SearchService,
    ) {}

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            this.tapPage();
        });
    }

    /**
     * tapRefresh
     */
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
        this.service.adList(queries).subscribe({
            next: res => {
                this.isLoading = false;
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                this.searchService.applyHistory(this.queries = queries);
            },
            error: _ => {
                this.isLoading = false;
            }
        });
    }

    public tapSearch(form: any) {
        this.queries = this.searchService.getQueries(form, this.queries);
        this.queries.position_id = 0;
        this.tapRefresh();
    }

    public tapRemove(item: IAd) {
        this.toastrService.confirm('确定删除“' + item.name + '”广告？', () => {
            this.service.adRemove(item.id).subscribe(res => {
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
