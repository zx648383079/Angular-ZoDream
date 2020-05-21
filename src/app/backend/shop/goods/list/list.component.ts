import { Component, OnInit } from '@angular/core';
import { IProduct } from 'src/app/@theme/models/product';
import { GoodsService } from '../goods.service';
import { ThemeService } from 'src/app/@theme/services';

@Component({
  selector: 'zo-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  public items: IProduct[] = [];

  public hasMore = true;

  public page = 1;

  public perPage = 20;

  public isLoading = false;

  public total = 0;

  constructor(
    private service: GoodsService
  ) {
    this.tapRefresh();
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
    this.tapGo(1);
  }

  public tapMore() {
    this.tapGo(this.page + 1);
  }

  /**
   * tapGo
   */
  public tapGo(page: number) {
    if (this.isLoading) {
        return;
    }
    this.isLoading = true;
    this.service.get({
      page,
      per_page: this.perPage
    }).subscribe(res => {
        this.isLoading = false;
        this.items = res.data;
        this.hasMore = res.paging.more;
        this.total = res.paging.total;
    });
  }

}
