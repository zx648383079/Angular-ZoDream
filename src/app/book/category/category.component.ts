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
    this.service.getCategories().subscribe(res => {
      this.categories = res;
    });
  }

  public tapCategory(item: ICategory) {
    this.router.navigate(['/book/top'], {
      queryParams: {
        category: item.id,
        title: item.name,
      }
    });
  }
}
