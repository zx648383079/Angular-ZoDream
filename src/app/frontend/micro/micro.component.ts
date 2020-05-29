import { Component, OnInit } from '@angular/core';
import { MicroService } from './micro.service';
import { IMicro } from 'src/app/theme/models/micro';

@Component({
  selector: 'app-micro',
  templateUrl: './micro.component.html',
  styleUrls: ['./micro.component.scss']
})
export class MicroComponent implements OnInit {

  public items: IMicro[] = [];
  public page = 1;
  public hasMore = true;
  public isLoading = false;

  constructor(
    private service: MicroService
  ) { }

  ngOnInit() {
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
    this.service.getPgae({
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
