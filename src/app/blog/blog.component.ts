import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {

  public detailMode = false;

  public items = [1];

  public categories = [
    {
      name: '全部',
      checked: true
    },
    {
      name: 'zodream'
    },
    {
      name: '把环境比较好'
    },
    {
      name: '热帖Greg反对'
    },
    {
      name: '热帖Gr'
    }
  ];

  public sortItems = [
    {
      name: '最新',
      checked: true
    },
    {
      name: '热门'
    },
    {
      name: '推荐'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  public tapCategory(item: any) {
    this.categories.forEach(i => {
      i.checked = i === item;
    });
  }

  public tapSort(item: any) {
    this.sortItems.forEach(i => {
      i.checked = i === item;
    });
  }

  public tapItem(item: any) {
    this.detailMode = true;
  }

}
