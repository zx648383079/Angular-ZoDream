import { Component, OnInit } from '@angular/core';
import { IShare } from 'src/app/theme/models/disk';
import { DiskService } from '../disk.service';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss']
})
export class ShareComponent implements OnInit {

  public checkedAll = false;

  public items: IShare[] = [];

  public page = 1;
  public hasMore = true;
  public isLoading = false;

  constructor(
    private service: DiskService
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
    this.service.getMyShare({
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

  public tapFile(item: any) {
    item.checked = !item.checked;
    if (!item.checked) {
      this.checkedAll = false;
    } else {
      this.checkedIfAll();
    }
  }

  public checkedIfAll() {
    for (const item of this.items) {
      if (!item.checked) {
        return;
      }
    }
    this.checkedAll = true;
  }

  public tapCheckAll() {
    this.checkedAll = !this.checkedAll;
    for (const item of this.items) {
      item.checked = this.checkedAll;
    }
  }

}
