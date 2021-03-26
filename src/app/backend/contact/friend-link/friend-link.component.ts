import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IFriendLink } from '../../../theme/models/seo';
import { ContactService } from '../contact.service';

@Component({
  selector: 'app-friend-link',
  templateUrl: './friend-link.component.html',
  styleUrls: ['./friend-link.component.scss']
})
export class FriendLinkComponent implements OnInit {

  public items: IFriendLink[] = [];

  public hasMore = true;

  public page = 1;

  public perPage = 20;

  public isLoading = false;

  public total = 0;

  constructor(
    private service: ContactService,
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
    this.service.friendLinkList({
      page,
      per_page: this.perPage
    }).subscribe(res => {
        this.isLoading = false;
        this.items = res.data;
        this.hasMore = res.paging.more;
        this.total = res.paging.total;
    });
  }

  public tapPass(item: IFriendLink) {
    if (!confirm('确认审核通过此友情链接？')) {
      return;
    }
    this.service.friendLinkVerify(item.id).subscribe(res => {
      if (!res) {
        return;
      }
      this.toastrService.success('已审核通过！');
      item.status = res.status;
    });
  }

  public tapOff(item: IFriendLink) {
    if (!confirm('确认下架此友情链接？')) {
      return;
    }
    this.service.friendLinkOff(item.id).subscribe(res => {
      if (!res.data) {
        return;
      }
      this.toastrService.success('已下架！');
      item.status = 0;
    });
  }

  public tapRemove(item: IFriendLink) {
    if (!confirm('确认删除此友情链接？')) {
      return;
    }
    this.service.friendLinkRemove(item.id).subscribe(res => {
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
