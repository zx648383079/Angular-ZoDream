import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IBrand, ICategory, IGoods } from '../../../../theme/models/shop';
import { GoodsService } from '../goods.service';

@Component({
  selector: 'app-trash',
  templateUrl: './trash.component.html',
  styleUrls: ['./trash.component.scss']
})
export class TrashComponent implements OnInit {
  public items: IGoods[] = [];

  public hasMore = true;

  public page = 1;

  public perPage = 20;

  public isLoading = false;

  public total = 0;

  public keywords = '';
  public category = 0;
  public brand = 0;
  public categories: ICategory[] = [];
  public brandItems: IBrand[] = [];

  constructor(
    private service: GoodsService,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
  ) {
    this.service.categoryAll().subscribe(res => {
      this.categories = res.data;
    });
    this.service.brandAll().subscribe(res => {
      this.brandItems = res.data;
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params.category) {
        this.category = params.category;
      }
      if (params.brand) {
        this.brand = params.brand;
      }
      this.tapRefresh();
    });
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
    this.service.get({
      category: this.category,
      brand: this.brand,
      page,
      per_page: this.perPage,
      trash: true,
    }).subscribe(res => {
        this.isLoading = false;
        this.items = res.data;
        this.hasMore = res.paging.more;
        this.total = res.paging.total;
    });
  }

  public tapSearch(form: any) {
    this.keywords = form.keywords;
    this.category = form.cat_id || 0;
    this.brand = form.brand_id || 0;
    this.tapRefresh();
  }

  public tapRemove(item: IGoods) {
    if (!confirm('确定彻底删除“' + item.name + '”商品，删除后将无法恢复？')) {
      return;
    }
    this.service.trashRemove(item.id).subscribe(res => {
      if (!res.data) {
        return;
      }
      this.toastrService.success('删除成功');
      this.items = this.items.filter(it => {
        return it.id !== item.id;
      });
    });
  }

  public tapClear() {
    if (!confirm('确定彻底清空回收站的商品，删除后将无法恢复？')) {
      return;
    }
    this.service.trashClear().subscribe(res => {
      if (!res.data) {
        return;
      }
      this.toastrService.success('删除成功');
      this.items = [];
    });
  }

  public tapRestore(item?: IGoods) {
    if (!confirm(item ? '确定还原“' + item.name + '”商品？' : '确定还原所有回收站商品？')) {
      return;
    }
    this.service.trashRestore(item?.id).subscribe(res => {
      if (!res.data) {
        return;
      }
      this.toastrService.success('还原成功');
      this.items = item ? this.items.filter(it => {
        return it.id !== item.id;
      }) : [];
    });
  }

}
