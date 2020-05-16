import { Component, OnInit } from '@angular/core';
import { BlogService, ICategory } from '../blog.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  public title = '博客';

  public categories: ICategory[] = [];

  public newItems = [];

  public items = [
    {title: '1231231', created_at: '2019-09-01'}
  ];

  public page = 1;

  constructor(
    private service: BlogService
  ) {
    this.service.getCategories().subscribe(res => {
      this.categories = res;
    });
  }

  ngOnInit() {
  }

}
