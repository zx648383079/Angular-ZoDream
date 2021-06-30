import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../dialog';
import { IPageQueries } from '../../../../theme/models/page';
import { getQueries } from '../../../../theme/query';
import { TbkService } from '../tbk.service';

@Component({
  selector: 'app-tbk',
  templateUrl: './tbk.component.html',
  styleUrls: ['./tbk.component.scss']
})
export class TbkComponent implements OnInit {

    public items: any[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        page: 1,
        per_page: 20,
        keywords: '',
    };

    constructor(
        private service: TbkService,
        private toastrService: DialogService,
        private route: ActivatedRoute,
    ) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = getQueries(params, this.queries);
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
        this.service.search(queries).subscribe(res => {
            this.isLoading = false;
            this.items = res.data;
            this.hasMore = res.data.length >= this.queries.per_page;
            this.total = page * this.queries.per_page * 2;
        });
    }

    public tapSearch(form: any) {
        this.queries = getQueries(form, this.queries);
        this.tapRefresh();
    }

}
