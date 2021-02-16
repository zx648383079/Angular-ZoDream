import { Component, OnInit } from '@angular/core';
import { LegworkService } from '../legwork.service';
import { ICategory, IService } from '../model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    public categories: ICategory[] = [];
    public category = 0;
    public items: IService[] = [];
    public page = 1;
    public hasMore = true;
    public isLoading = false;
    public keywords = '';

    constructor(
        private service: LegworkService,
    ) { }

    ngOnInit() {
        this.service.categoryList().subscribe(res => {
            this.categories = res.data;
        });
        this.tapRefresh();
    }

    public tapCategory(item?: ICategory) {
        this.category = item ? item.id : 0;
        this.tapRefresh();
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapMore() {
        if (!this.hasMore) {
            return;
        }
        this.goPage(this.page + 1);
    }

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        this.service.serviceList({
            keywords: this.keywords,
            category: this.category,
            page
        }).subscribe(res => {
            this.page = page;
            this.hasMore = res.paging.more;
            this.isLoading = false;
            this.items = page < 2 ? res.data : [].concat(this.items, res.data);
        }, () => {
            this.isLoading = false;
        });
    }

}
