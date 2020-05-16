import { Component, OnInit } from '@angular/core';
import { BlogService, ICategory } from '../blog.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  public items: ICategory[] = [];

  public title = '分类';

  constructor(
    private service: BlogService
  ) {
    this.service.getCategories().subscribe(res => {
      this.items = res;
    });
  }

  ngOnInit() {
  }

}
