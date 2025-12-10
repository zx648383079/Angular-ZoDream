import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { IPageQueries } from '../../../../theme/models/page';
import { SearchService } from '../../../../theme/services';
import { IGameFinancial } from '../../model';
import { GameMakerService } from '../game-maker.service';

@Component({
    standalone: false,
  selector: 'app-maker-financial',
  templateUrl: './financial.component.html',
  styleUrls: ['./financial.component.scss']
})
export class FinancialComponent implements OnInit {
    private service = inject(GameMakerService);
    private toastrService = inject(DialogService);
    private route = inject(ActivatedRoute);
    private searchService = inject(SearchService);


    public items: IGameFinancial[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        page: 1,
        per_page: 20,
        keywords: '',
    };

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
        // this.service.forumList(queries).subscribe({
        //     next: res => {
        //         this.isLoading = false;
        //         this.items = res.data;
        //         this.hasMore = res.paging.more;
        //         this.total = res.paging.total;
        //         this.searchService.applyHistory(this.queries = queries);
        //     },
        //     error: () => {
        //         this.isLoading = false;
        //     }
        // });
    }

    public tapSearch(form: any) {
        this.queries = this.searchService.getQueries(form, this.queries);
        this.tapRefresh();
    }

    public tapRemove(item: IGameFinancial) {
        this.toastrService.confirm('确定删除“' + item.name + '”土著？', () => {
            // this.service.forumRemove(item.id).subscribe(res => {
            //     if (!res.data) {
            //         return;
            //     }
            //     this.toastrService.success($localize `Delete Successfully`);
            //     this.items = this.items.filter(it => {
            //         return it.id !== item.id;
            //     });
            // });
        });
    }

}
