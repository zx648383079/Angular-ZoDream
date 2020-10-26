import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { AppState } from '../../../theme/interfaces';
import { IUser } from '../../../theme/models/user';
import { getUserRole } from '../../../theme/reducers/selectors';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  public items: IUser[] = [];

  public hasMore = true;

  public page = 1;

  public perPage = 20;

  public isLoading = false;

  public total = 0;

  public keywords = '';

  public sortKey = '';

  public orderAsc = true;

  public editable = false;

  constructor(
    private service: AuthService,
    private toastrService: ToastrService,
    private store: Store < AppState > ,
  ) {
    this.tapRefresh();
    this.store.select(getUserRole).subscribe(roles => {
      this.editable = roles.indexOf('edit_user') >= 0;
    });
  }

  ngOnInit() {}

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
    this.service.userList({
      keywords: this.keywords,
      sort: this.sortKey,
      order: this.orderAsc ? 'asc' : 'desc',
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
    this.keywords = form.keywords || '';
    this.sortKey = '';
    this.tapRefresh();
  }

  public tapSort(key: string) {
    if (this.sortKey === key) {
      this.orderAsc = !this.orderAsc;
    } else {
      this.sortKey = key;
      this.orderAsc = true;
    }
    this.tapRefresh();
  }

  public tapRemove(item: IUser) {
    if (!this.editable) {
      return;
    }
    if (!confirm('确定删除“' + item.name + '”用户？')) {
      return;
    }
    this.service.userRemove(item.id).subscribe(res => {
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
