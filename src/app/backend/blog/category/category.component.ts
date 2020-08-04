import { Component, OnInit } from '@angular/core';
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

}
