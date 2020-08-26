import { Component, OnInit } from '@angular/core';
import { IBlog, ICategory } from 'src/app/theme/models/blog';
import { BlogService } from '../blog.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  public categories: ICategory[] = [];

  public items: IBlog[] = [];
  public page = 1;
  public hasMore = true;
  public isLoading = false;
  public total = 0;
  public perPage = 20;

  constructor(
    private service: BlogService
  ) {
    this.service.getCategories().subscribe(res => {
      this.categories = res;
    });
  }

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
    this.service.getPage({
      page
    }).subscribe(res => {
      this.page = page;
      this.hasMore = res.paging.more;
      this.isLoading = false;
      this.items = res.data;
      this.total = res.paging.total;
      this.perPage = res.paging.limit;
    }, () => {
      this.isLoading = false;
    });
  }

  public tapPage() {
    this.goPage(this.page);
  }

  public tapRemove(item: IBlog) {
    if (!confirm('确定要删除《' + item.title +  '》?')) {
      return;
    }
    
  }

}
