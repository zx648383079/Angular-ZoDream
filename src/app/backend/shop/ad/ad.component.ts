import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IAd } from '../../../theme/models/shop';
import { AdService } from '../ad.service';

@Component({
  selector: 'app-ad',
  templateUrl: './ad.component.html',
  styleUrls: ['./ad.component.scss']
})
export class AdComponent implements OnInit {

  public items: IAd[] = [];

  public hasMore = true;

  public page = 1;

  public perPage = 20;

  public isLoading = false;

  public total = 0;

  public keywords = '';

  public position = 0;

  constructor(
    private service: AdService,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(res => {
      if (res.position) {
        this.position = parseInt(res.position, 10) || 0;
      }
      this.tapRefresh();
    });
  }

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
    this.service.adList({
      keywords: this.keywords,
      position_id: this.position,
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
    this.position = 0;
    this.tapRefresh();
  }

  public tapRemove(item: IAd) {
    if (!confirm('确定删除“' + item.name + '”广告？')) {
      return;
    }
    this.service.adRemove(item.id).subscribe(res => {
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
