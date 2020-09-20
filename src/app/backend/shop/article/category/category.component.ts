import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IArticleCategory } from '../../../../theme/models/shop';
import { ArticleService } from '../../article.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  public categories: IArticleCategory[] = [];

  constructor(
    private service: ArticleService,
    private toastrService: ToastrService,
  ) {
    this.service.categoryTree().subscribe(res => {
      this.categories = res.data;
    });
  }

  ngOnInit() {
  }

  public tapRemove(item: IArticleCategory) {
    if (!confirm('确定删除“' + item.name + '”分类？')) {
      return;
    }
    this.service.articleRemove(item.id).subscribe(res => {
      if (!res.data) {
        return;
      }
      this.toastrService.success('删除成功');
      this.categories = this.categories.filter(it => {
        return it.id !== item.id;
      });
    });
  }

}
