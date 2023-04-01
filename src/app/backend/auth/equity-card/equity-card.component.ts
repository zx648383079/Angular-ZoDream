import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../components/dialog';
import { IEquityCard } from '../../../theme/models/auth';
import { IPageQueries } from '../../../theme/models/page';
import { emptyValidate } from '../../../theme/validators';
import { AuthService } from '../auth.service';
import { SearchService } from '../../../theme/services';

@Component({
    selector: 'app-equity-card',
    templateUrl: './equity-card.component.html',
    styleUrls: ['./equity-card.component.scss']
})
export class EquityCardComponent implements OnInit {

    public items: IEquityCard[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        page: 1,
        per_page: 20,
        keywords: ''
    };
    public editData: IEquityCard = {
        name: '',
        icon: '',
    } as any;

    constructor(
        private service: AuthService,
        private route: ActivatedRoute,
        private toastrService: DialogService,
        private searchService: SearchService
    ) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            this.tapPage();
        });
    }

    public open(modal: DialogEvent, item?: IEquityCard) {
        this.editData = item ? Object.assign({}, item) : {
            id: 0,
            name: '',
            icon: '',
            status: 0,
        };
        modal.open(() => {
            this.service.cardSave(this.editData).subscribe(_ => {
                this.toastrService.success($localize `Save Successfully`);
                this.tapRefresh();
            });
        }, () => {
            return !emptyValidate(this.editData.name);
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
        this.service.cardList(queries).subscribe({
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

    public tapSearch(form: any) {
        this.queries = this.searchService.getQueries(form, this.queries);
        this.tapRefresh();
    }


    public tapRemove(item: IEquityCard) {
        this.toastrService.confirm('确定删除这一条权益卡？', () => {
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
