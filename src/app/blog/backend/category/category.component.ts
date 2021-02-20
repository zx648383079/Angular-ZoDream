import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ICategory } from '../../../theme/models/blog';
import { BlogService } from '../blog.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  public items: ICategory[] = [];

  public isLoading = false;

  constructor(
    private service: BlogService,
    private toastrService: ToastrService,
  ) {
    this.tapRefresh();
  }

  ngOnInit() {}

  /**
   * tapRefresh
   */
  public tapRefresh() {
    if (this.isLoading) {
        return;
    }
    this.isLoading = true;
    this.service.getCategories().subscribe(res => {
        this.isLoading = false;
        this.items = res;
    });
  }

  public tapRemove(item: ICategory) {
    if (!confirm('确定删除“' + item.name + '”分类？')) {
      return;
    }
    this.service.categoryRemove(item.id).subscribe(res => {
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
