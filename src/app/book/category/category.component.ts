import { Component, OnInit } from '@angular/core';
import { ICategory } from '../../../app/theme/models/book';
import { BookService } from '../book.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  public categories?: ICategory[] = [];

  constructor(
    private service: BookService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  public tapCategory(item: ICategory) {
    this.router.navigate([{
        name: 'bang',
        query: {
            category: item.id + '',
            title: item.name,
        },
    }]);
  }
}
