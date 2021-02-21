import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TbkService } from '../tbk.service';

@Component({
  selector: 'app-tbk',
  templateUrl: './tbk.component.html',
  styleUrls: ['./tbk.component.scss']
})
export class TbkComponent implements OnInit {

    public items: any[] = [];
    public hasMore = true;
    public page = 1;
    public perPage = 20;
    public isLoading = false;
    public total = 0;
    public keywords = '';

    constructor(
        private service: TbkService,
        private toastrService: ToastrService,
        private route: ActivatedRoute,
    ) {
    }

    ngOnInit() {
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
        this.service.search({
            keywords: this.keywords,
            page,
            per_page: this.perPage
        }).subscribe(res => {
            this.isLoading = false;
            this.items = res.data;
            this.hasMore = res.data.length >= this.perPage;
            this.total = page * this.perPage * 2;
        });
    }

    public tapSearch(form: any) {
        this.keywords = form.keywords;
        this.tapRefresh();
    }

}
