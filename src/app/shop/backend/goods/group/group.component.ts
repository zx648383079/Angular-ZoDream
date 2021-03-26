import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IAttributeGroup } from '../../../../theme/models/shop';
import { AttributeService } from '../attribute.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {

  public items: IAttributeGroup[] = [];

  public hasMore = true;

  public page = 1;

  public perPage = 20;

  public isLoading = false;

  public total = 0;

  public keywords = '';

  constructor(
    private service: AttributeService,
    private toastrService: ToastrService,
  ) {
    this.tapRefresh();
  }

  ngOnInit() {
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
    this.service.groupList({
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

  public tapRemove(item: IAttributeGroup) {
    if (!confirm('确定删除“' + item.name + '”分组？')) {
      return;
    }
    this.service.groupRemove(item.id).subscribe(res => {
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
