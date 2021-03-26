import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IAuthorize } from '../../../theme/models/open';
import { OpenService } from '../open.service';

@Component({
  selector: 'app-authorize',
  templateUrl: './authorize.component.html',
  styleUrls: ['./authorize.component.scss']
})
export class AuthorizeComponent implements OnInit {

  public items: IAuthorize[] = [];

  public hasMore = true;

  public page = 1;

  public perPage = 20;

  public isLoading = false;

  public total = 0;

  public keywords = '';

  constructor(
    private service: OpenService,
    private toastrService: ToastrService,
  ) {
    this.tapRefresh();
  }

  ngOnInit() {}


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
    this.service.authorizeList({
      keywords: this.keywords,
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
    this.tapRefresh();
  }

  public tapClear() {
    if (!confirm('确定清除所有的授权Token？')) {
      return;
    }
    this.service.authorizeClear().subscribe(res => {
      if (!res.data) {
        return;
      }
      this.toastrService.success('删除成功');
      this.tapRefresh();
    });
  }

  public tapRemove(item: any) {
    if (!confirm('确定删除这一条授权Token？')) {
      return;
    }
    this.service.authorizeRemove(item.id).subscribe(res => {
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
