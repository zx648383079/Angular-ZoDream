import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ILog } from '../../../theme/models/sms';
import { SmsService } from '../sms.service';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss']
})
export class LogComponent {

  public items: ILog[] = [];

  public hasMore = true;

  public page = 1;

  public perPage = 20;

  public isLoading = false;

  public total = 0;

  public keywords = '';

  public type = 0;

  public typeItems = [];

  constructor(
    private service: SmsService,
    private toastrService: ToastrService,
  ) {
    this.service.typeItems().subscribe(res => {
      this.typeItems = res;
    });
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
    this.service.logList({
      keywords: this.keywords,
      type: this.type,
      page,
      per_page: this.perPage
    }).subscribe(res => {
        this.isLoading = false;
        this.items = res.data;
        this.hasMore = res.paging.more;
        this.total = res.paging.total;
    });
  }

  public tapSearch(form: any) {
    this.keywords = form.keywords;
    this.type = form.type;
    this.tapRefresh();
  }

  public tapRemove(item: ILog) {
    if (!confirm('确定删除本条短信记录？')) {
      return;
    }
    this.service.logRemove(item.id).subscribe(res => {
      if (!res.data) {
        return;
      }
      this.toastrService.success('删除成功');
      this.items = this.items.filter(it => {
        return it.id !== item.id;
      });
    });
  }

}
