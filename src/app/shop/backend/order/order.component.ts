import { Component, OnInit } from '@angular/core';
import { IOrder } from '../../../theme/models/shop';
import { OrderService } from './order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  public items: IOrder[] = [];

  public hasMore = true;

  public page = 1;

  public perPage = 20;

  public isLoading = false;

  public total = 0;

  constructor(
      private service: OrderService,
  ) {
      this.tapRefresh();
  }

  ngOnInit() {}

  public tapSearch(form: any) {
      this.tapRefresh();
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
      this.service.orderList({
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
